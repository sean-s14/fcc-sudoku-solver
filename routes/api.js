"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    if (!puzzle || !coordinate || !value) {
      return res.json({ error: "Required field(s) missing" });
    }

    try {
      const parsed_value = parseInt(value);
      if (isNaN(parsed_value) || parsed_value < 1 || parsed_value > 9) {
        return res.json({ error: "Invalid value" });
      }
    } catch (e) {
      return res.json({ error: "Invalid value" });
    }

    const regex = /^[A-I][1-9]$/;
    if (!regex.test(coordinate)) {
      return res.json({ error: "Invalid coordinate" });
    }

    if (puzzle.length !== 81) {
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    }
    if (!solver.validate(puzzle)) {
      return res.json({ error: "Invalid characters in puzzle" });
    }

    const errors = [];
    const row = coordinate.split("")[0];
    const col = coordinate.split("")[1];
    const rowPlacement = solver.checkRowPlacement(puzzle, row, col, value);
    if (!rowPlacement) {
      errors.push("row");
    }
    const colPlacement = solver.checkColPlacement(puzzle, row, col, value);
    if (!colPlacement) {
      errors.push("column");
    }
    const gridPlacement = solver.checkRegionPlacement(puzzle, row, col, value);
    if (!gridPlacement) {
      errors.push("region");
    }

    if (errors.length > 0) {
      return res.json({ valid: false, conflict: errors });
    }

    return res.json({ valid: true });
  });

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;
    if (!puzzle) {
      return res.json({ error: "Required field missing" });
    }
    if (puzzle.length !== 81) {
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    }
    if (!solver.validate(puzzle)) {
      return res.json({ error: "Invalid characters in puzzle" });
    }

    try {
      const solution = solver.solve(puzzle);
      return res.json({ solution });
    } catch (e) {
      // console.log(e);
      return res.json({ error: "Puzzle cannot be solved" });
    }
  });
};
