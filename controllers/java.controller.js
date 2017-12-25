'use strict';

// Import dependencies
const { exec, execFile } = require('child_process');
const { promisify } = require('util');
const fs = require("fs");

module.exports = {
  runTest: function (req, res, next) {
    // TODO: Rewrite this to deal with possible more than one test executing
    // Write the given code to the directory
    const writeFile = promisify(fs.writeFile);
    const copyFile = promisify(fs.copyFile);
    Promise.all([writeFile(`/sandbox/${req.params.testName}.java`, req.body.src),
      copyFile(`/challenges/${req.params.testName}/${req.params.testName}Test.java`,
        `/sandbox/${req.params.testName}Test.java`)]).then(() => {
      exec(`cd /sandbox && javac ${req.params.testName}Test.java`, (err, stdout, stderr) => {
        if (err) {
          res.status(200).send({
            passed: false,
            output: stderr
          });
        } else {
          execFile('/usr/bin/java', ['-cp', '.', `${req.params.testName}Test`],
            { cwd: '/sandbox', signal: 'SIGINT', timeout: 5000 },
            (err, stdout, stderr) => {
              // Remove all files in the sandbox
              exec(`rm -rf /sandbox/*`);

              // If the test failed, relay that to the client
              if (err) {
                res.status(200).send({
                  passed: false,
                  output: stderr || 'Execution time exceeded'
                });
              } else {
                res.status(200).send({
                  passed: true
                });
              }
          });
        }
      });
    })
    .catch((err) => {
      err.message = 'Error while copying testing files';
      next(err);
    });
  }
};
