# ADF-Hydra-application-tests

# 1. Manual Tests - ADF-Hydra - Test Plan - TestLink

This folder contains manual tests, the test plan, and the executed test cases for the ADF-Hydra application. These reports were created in TestLink and generated in PDF format.

# 2. Automated Tests - Selenium - ADF-Hydra

This folder contains automated tests written for the ADF-Hydra application in JavaScript using Selenium, along with a report containing the results of these tests.

# Running Automated Tests:

To run the automated tests, you need to download, open, and run the ADF-Hydra application by typing the following command in the terminal:
node app.js
The application runs on: localhost:3000
Then, open a new window and navigate to the automated tests located in this folder. In the terminal, type:
npx mocha --no-timeouts 'test/automaticTestsAdf-Hydra.js'
In order for the tests to run correctly, you must first download and install the chromedriver on your computer.

Opening the Test Results Report:
You need to download the report, then double-click on the file: mochawesome.html.
A browser will open with the test results.

# 3. Performance Tests - JMeter - ADF-Hydra

This folder contains performance tests created in JMeter and saved in the file named: ADF-Hydra-Test.jmx, as well as the test reports for 1, 20, and 50 samples.

# Running Performance Tests:

To run these tests, you also need to first download and start the ADF-Hydra application by typing the following command in the terminal of the open application:
node app.js
The application runs on: localhost:3000
Then, start the tests in JMeter.

# Opening the Performance Test Reports:

You need to download the reports, then double-click on the file: index.html.
A browser will open with the test results.
