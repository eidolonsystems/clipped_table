import { TestSet, TestRunner } from "alsatian";

let testSet = TestSet.create();
//testSet.addTestsFromFiles("./build/tests/*.js");
testSet.addTestsFromFiles("./build/tests/row_selector_tester.js");
let testRunner = new TestRunner();
testRunner.outputStream.pipe(process.stdout);
testRunner.run(testSet);
