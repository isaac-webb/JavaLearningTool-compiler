const { expect } = require('chai');
const supertest = require('supertest');
const app = supertest(require('../app.js'));

describe('Compiler API', function() {
  // Test an invalid URL
  it('should return a 404 for an invalid URL', function() {
    return app.post('/invalid').then(res => {
      expect(res.status).to.equal(404);
      expect(res.text).to.equal('Not Found');
    });
  });

  // Test the Java compiler API
  describe('Java API', function() {
    // Override the "slow" time for mocha
    this.slow(2000);
    this.timeout(10000);

    // Test an invalid test name
    it('should return a 404 for an invalid test name', function() {
      return app.post('/java/%20').then(res => {
        expect(res.status).to.equal(404);
        expect(res.text).to.equal('Test   not found');
      });
    });

    // Test a valid but nonexistent test name
    it('should return a 404 for a nonexistent test', function() {
      return app.post('/java/Hello').then(res => {
        expect(res.status).to.equal(404);
        expect(res.text).to.equal('Test Hello not found');
      });
    });

    // Test a valid test with no code to run
    it('should return a 400 for an empty source', function() {
      return app.post('/java/HelloWorld').send({ src: ""}).then(res => {
        expect(res.status).to.equal(400);
        expect(res.text).to.equal('No code to execute');
      });
    });

    // Test a valid test with noncompiling code
    it('should return a 200 and fail if the code doesn\'t compile', function() {
      return app.post('/java/HelloWorld').send({ src: "asdf" }).then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.passed).to.be.false;
      });
    });

    // Test a valid test with infinitely running code
    it('should return a 200 and fail if the code executes for too long', function() {
      this.slow(7000);
      return app.post('/java/HelloWorld')
        .send({ src: "public class HelloWorld { public static void main(String[] args) { while (true) {} } }" })
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.passed).to.be.false;
          expect(res.body.output).to.equal('Execution time exceeded');
      });
    });

    // Test a valid test with failing code
    it('should return a 200 and fail if the code fails the test case', function() {
      return app.post('/java/HelloWorld')
        .send({ src: "public class HelloWorld { public static void main(String[] args) { System.exit(1); }" })
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.passed).to.be.false;
      });
    });

    // Test a valid test with passing code
    it('should return a 200 and pass if the code passes the test', function() {
      return app.post('/java/HelloWorld')
        .send({ src: "public class HelloWorld { public static void main(String[] args) { } }" })
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.passed).to.be.true;
      });
    });
  });
});
