function rowGenerator(str) {
  const rows = [];
  for (let i = 0; i < str.length; i += 9) {
    rows.push(str.slice(i, i + 9));
  }
  return rows;
}

function colGenerator(str) {
  const cols = [];
  for (let i = 0; i < 9; i++) {
    const col = [];
    for (let j = i; j < str.length; j += 9) {
      col.push(str[j]);
    }
    cols.push(col);
  }
  return cols;
}

function gridGenerator(str) {
  const old_grids = [];
  for (let i = 0; i < str.length; i += 3) {
    old_grids.push(str.slice(i, i + 3));
  }
  const grids = [];
  for (let i = 0; i < old_grids.length; i += 9) {
    const grid1 = old_grids[i]
      .concat(old_grids[i + 3])
      .concat(old_grids[i + 6]);
    const grid2 = old_grids[i + 1]
      .concat(old_grids[i + 4])
      .concat(old_grids[i + 7]);
    const grid3 = old_grids[i + 2]
      .concat(old_grids[i + 5])
      .concat(old_grids[i + 8]);
    grids.push(grid1);
    grids.push(grid2);
    grids.push(grid3);
  }
  return grids;
}

const mapping = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
  I: 8,
};

function getGridFromRowAndColumn(puzzle, row, col) {
  let grid_number = null;
  let grid_position = null;
  if (row < 3) {
    if (col < 3) {
      grid_number = 0;
      grid_position = row * 3 + col;
    } else if (col < 6) {
      grid_number = 1;
      grid_position = row * 3 + (col - 3);
    } else if (col < 9) {
      grid_number = 2;
      grid_position = row * 3 + (col - 6);
    }
  } else if (row < 6) {
    if (col < 3) {
      grid_number = 3;
      grid_position = (row - 3) * 3 + col;
    } else if (col < 6) {
      grid_number = 4;
      grid_position = (row - 3) * 3 + (col - 3);
    } else if (col < 9) {
      grid_number = 5;
      grid_position = row * 3 + col;
      grid_position = (row - 3) * 3 + (col - 6);
    }
  } else if (row < 9) {
    if (col < 3) {
      grid_number = 6;
      grid_position = (row - 6) * 3 + col;
    } else if (col < 6) {
      grid_number = 7;
      grid_position = (row - 6) * 3 + (col - 3);
    } else if (col < 9) {
      grid_number = 8;
      grid_position = (row - 6) * 3 + (col - 6);
    }
  }
  return [grid_number, grid_position];
}

class SudokuSolver {
  validate(puzzleString) {
    const regex = new RegExp(/[0-9\.]{81}/);
    return regex.test(puzzleString);
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rows = rowGenerator(puzzleString);
    const row_arr = rows[mapping[row]].split("");

    if (row_arr[parseInt(column) - 1] === value) {
      return true;
    } else if (row_arr.includes(value)) {
      return false;
    } else {
      return true;
    }
  }

  checkColPlacement(puzzleString, row, column, value) {
    const cols = colGenerator(puzzleString);
    column = parseInt(column) - 1;
    const column_arr = cols[column];

    if (column_arr[mapping[row]] === value) {
      return true;
    } else if (column_arr.includes(value)) {
      return false;
    } else {
      return true;
    }
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const grids = gridGenerator(puzzleString);
    row = mapping[row];
    column = parseInt(column) - 1;
    const [grid_number, grid_position] = getGridFromRowAndColumn(
      puzzleString,
      row,
      column
    );
    const grid = grids[grid_number].split("");
    if (grid[grid_position] === value) {
      return true;
    } else if (grid.includes(value)) {
      return false;
    } else {
      return true;
    }
  }

  solve(puzzleString) {
    const validated = this.validate(puzzleString);
    if (!validated) throw new Error("Invalid Puzzle");
    function count(arr) {
      return arr.reduce((accumulator, currentValue) => {
        if (currentValue === ".") {
          return accumulator + 1;
        } else {
          return accumulator;
        }
      }, 0);
    }
    function findNumsLeft(arr) {
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      return numbers.filter((num) => !arr.includes(num.toString()));
    }
    let a = puzzleString.split("");

    // Generate Rows
    const rows = [];
    for (let i = 0; i < a.length; i += 9) {
      rows.push(a.slice(i, i + 9));
    }

    // Generate Columns
    const cols = [];
    for (let i = 0; i < 9; i++) {
      const col = [];
      for (let j = i; j < a.length; j += 9) {
        col.push(a[j]);
      }
      cols.push(col);
    }

    // Generate Grids
    const old_grids = [];
    for (let i = 0; i < a.length; i += 3) {
      old_grids.push(a.slice(i, i + 3));
    }
    const grids = [];
    for (let i = 0; i < old_grids.length; i += 9) {
      const grid1 = old_grids[i]
        .concat(old_grids[i + 3])
        .concat(old_grids[i + 6]);
      const grid2 = old_grids[i + 1]
        .concat(old_grids[i + 4])
        .concat(old_grids[i + 7]);
      const grid3 = old_grids[i + 2]
        .concat(old_grids[i + 5])
        .concat(old_grids[i + 8]);
      grids.push(grid1);
      grids.push(grid2);
      grids.push(grid3);
    }
    // End of generator

    let temp_grid = [];
    for (const grid of grids) {
      temp_grid.push(...grid);
    }

    let dot_count = count(temp_grid);
    let count_ = 0;
    while (dot_count > 0) {
      for (let i = 0; i < grids.length; i++) {
        for (let j = 0; j < grids[i].length; j++) {
          let row_num = null;
          let row_pos = null;
          let col_num = null;
          let col_pos = null;

          // Generate row number & position as well as column position
          if (i < 3) {
            if (j < 3) {
              row_num = 0;
              row_pos = j + (i % 3) * 3;
              col_pos = 0;
            } else if (j < 6) {
              row_num = 1;
              row_pos = j - 3 + (i % 3) * 3;
              col_pos = 1;
            } else if (j < 9) {
              row_num = 2;
              row_pos = j - 6 + (i % 3) * 3;
              col_pos = 2;
            }
          } else if (i < 6) {
            if (j < 3) {
              row_num = 3;
              row_pos = j + (i % 3) * 3;
              col_pos = 3;
            } else if (j < 6) {
              row_num = 4;
              row_pos = j - 3 + (i % 3) * 3;
              col_pos = 4;
            } else if (j < 9) {
              row_num = 5;
              row_pos = j - 6 + (i % 3) * 3;
              col_pos = 5;
            }
          } else if (i < 9) {
            if (j < 3) {
              row_num = 6;
              row_pos = j + (i % 3) * 3;
              col_pos = 6;
            } else if (j < 6) {
              row_num = 7;
              row_pos = j - 3 + (i % 3) * 3;
              col_pos = 7;
            } else if (j < 9) {
              row_num = 8;
              row_pos = j - 6 + (i % 3) * 3;
              col_pos = 8;
            }
          }

          // Column Number
          if ([0, 3, 6].includes(i)) {
            if ([0, 3, 6].includes(j)) {
              col_num = 0;
            } else if ([1, 4, 7].includes(j)) {
              col_num = 1;
            } else if ([2, 5, 8].includes(j)) {
              col_num = 2;
            }
          } else if ([1, 4, 7].includes(i)) {
            if ([0, 3, 6].includes(j)) {
              col_num = 3;
            } else if ([1, 4, 7].includes(j)) {
              col_num = 4;
            } else if ([2, 5, 8].includes(j)) {
              col_num = 5;
            }
          } else if ([2, 5, 8].includes(i)) {
            if ([0, 3, 6].includes(j)) {
              col_num = 6;
            } else if ([1, 4, 7].includes(j)) {
              col_num = 7;
            } else if ([2, 5, 8].includes(j)) {
              col_num = 8;
            }
          }

          const nums_left_in_grid = findNumsLeft(grids[i]);
          const nums_left_in_row = findNumsLeft(rows[row_num]);
          const nums_left_in_col = findNumsLeft(cols[col_num]);
          const nums_left = nums_left_in_grid.filter(
            (num) =>
              nums_left_in_row.includes(num) && nums_left_in_col.includes(num)
          );
          if (grids[i][j] === ".") {
            if (nums_left.length === 1) {
              const replacement = nums_left[0].toString();
              grids[i][j] = replacement;
              rows[row_num][row_pos] = replacement;
              cols[col_num][col_pos] = replacement;
            }
          }
        }
      }
      temp_grid = [];
      for (const grid of grids) {
        temp_grid.push(...grid);
      }
      dot_count = count(temp_grid);

      count_++;
      if (count_ > 100) break;
    }

    let temp_rows = [];
    for (const row of rows) {
      temp_rows.push(row.join(""));
    }

    if (temp_rows.join("").split("").includes(".")) {
      throw new Error("Unsolvable");
    }
    return temp_rows.join("");
  }
}

module.exports = SudokuSolver;
