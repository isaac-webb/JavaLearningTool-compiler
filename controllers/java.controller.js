'use strict';

// Import dependencies
const debug = require('debug')('java:controller');
const { exec, execFile } = require('child_process');
const { promisify } = require('util');
const fs = require("fs");

module.exports = {
  runTest: function (req, res, next) {
    // Ensure the desired test exists
    let alphas = /^[a-zA-Z]+$/;
    if (!(req.params.testName.match(alphas)
      && fs.existsSync(`./challenges/${req.params.testName}/${req.params.testName}Test.java`))) {
      let err = new Error(`Test ${req.params.testName} not found`);
      err.status = 404;
      next(err);
      return;
    }

    // Make sure there is code to run
    if (!(req.body.src && req.body.src.length > 0)) {
      let err = new Error(`No code to execute`);
      err.status = 400;
      next(err);
      return;
    }

    // Promisify the file system callback methods
    const writeFile = promisify(fs.writeFile);
    const copyFile = promisify(fs.copyFile);

    // Write the test file to the sandbox and copy the test file
    Promise.all([writeFile(`/sandbox/${req.params.testName}.java`, req.body.src),
      copyFile(`./challenges/${req.params.testName}/${req.params.testName}Test.java`,
        `/sandbox/${req.params.testName}Test.java`)]).then(() => {
      exec(`cd /sandbox && javac ${req.params.testName}Test.java`, (err, stdout, stderr) => {
        // Output any compilation errors or attempt to execute the code
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
      debug(err.message);
      err.message = 'Error while copying testing files';
      next(err);
    });
  }
};
