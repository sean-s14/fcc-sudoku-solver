const chai = require("chai");
const assert = chai.assert;
const {
  puzzlesAndSolutions: examples,
} = require("../controllers/puzzle-strings.js");
const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

// Maybe use done()
// Changed Unit Tests to UnitTests

suite("UnitTests", () => {
  test("Logic handles a valid puzzle string of 81 characters", function (done) {
    assert.isTrue(solver.validate(examples[0][0]));
    done();
  });

  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function (done) {
    assert.isFalse(solver.validate(examples[0][0].slice(0, 80) + "t"));
    done();
  });

  test("Logic handles a puzzle string that is not 81 characters in length", function (done) {
    assert.isFalse(solver.validate(examples[0][0].slice(0, 80)));
    done();
  });

  test("Logic handles a valid row placement", function (done) {
    assert.isTrue(solver.checkRowPlacement(examples[0][0], "B", "2", "4"));
    done();
  });

  test("Logic handles an invalid row placement", function (done) {
    assert.isFalse(solver.checkRowPlacement(examples[0][0], "B", "2", "3"));
    done();
  });

  test("Logic handles a valid column placement", function (done) {
    assert.isTrue(solver.checkColPlacement(examples[0][0], "B", "2", "5"));
    done();
  });

  test("Logic handles an invalid column placement", function (done) {
    assert.isFalse(solver.checkColPlacement(examples[0][0], "B", "2", "9"));
    done();
  });

  test("Logic handles a valid region (3x3 grid) placement", function (done) {
    assert.isTrue(solver.checkRegionPlacement(examples[0][0], "A", "3", "9"));
    done();
  });

  test("Logic handles an invalid region (3x3 grid) placement", function (done) {
    assert.isFalse(solver.checkRegionPlacement(examples[0][0], "A", "1", "2"));
    done();
  });

  test("Valid puzzle strings pass the solver", function (done) {
    assert.equal(solver.solve(examples[0][0]), examples[0][1]);
    done();
  });

  test("Invalid puzzle strings fail the solver", function (done) {
    // assert.isTrue(true); // The below assert does not work with fcc's testing
    assert.throws(
      () => solver.solve(examples[0][0].slice(0, 10)),
      "Invalid Puzzle"
    );
    done();
  });

  test("Solver returns the expected solution for an incomplete puzzle", function (done) {
    assert.equal(solver.solve(examples[1][0]), examples[1][1]);
    done();
  });
});
