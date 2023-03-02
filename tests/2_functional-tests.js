const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");
const {
  puzzlesAndSolutions: examples,
} = require("../controllers/puzzle-strings.js");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  test("Solve a puzzle with valid puzzle string", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: examples[0][0] })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "solution");
        assert.equal(res.body.solution, examples[0][1]);
        done();
      });
  });

  test("Solve a puzzle with missing puzzle string", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        done();
      });
  });

  test("Solve a puzzle with invalid characters", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: examples[0][0].slice(0, 80) + "t" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });

  test("Solve a puzzle with incorrect length", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: examples[0][0].slice(0, 80) })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        assert.equal(
          res.body.error,
          "Expected puzzle to be 81 characters long"
        );
        done();
      });
  });

  test("Solve a puzzle that cannot be solved", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: examples[0][0].slice(0, 80) + "5" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Puzzle cannot be solved");
        done();
      });
  });

  test("Check a puzzle placement with all fields", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: examples[0][0], coordinate: "A1", value: "1" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "valid");
        assert.isTrue(res.body.valid);
        done();
      });
  });

  test("Check a puzzle placement with single placement conflict", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: examples[0][0], coordinate: "B2", value: "5" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "valid");
        assert.property(res.body, "conflict");
        assert.isFalse(res.body.valid);
        assert.deepEqual(res.body.conflict, ["region"]);
        done();
      });
  });

  test("Check a puzzle placement with multiple placement conflicts", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: examples[0][0], coordinate: "A2", value: "6" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "valid");
        assert.property(res.body, "conflict");
        assert.isFalse(res.body.valid);
        assert.deepEqual(res.body.conflict, ["column", "region"]);
        done();
      });
  });

  test("Check a puzzle placement with all placement conflicts", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: examples[0][0], coordinate: "A2", value: "2" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "valid");
        assert.property(res.body, "conflict");
        assert.isFalse(res.body.valid);
        assert.deepEqual(res.body.conflict, ["row", "column", "region"]);
        done();
      });
  });

  test("Check a puzzle placement with missing required fields", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Required field(s) missing");
        done();
      });
  });

  test("Check a puzzle placement with invalid characters", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: examples[0][0].slice(0, 80) + "t",
        coordinate: "A1",
        value: "1",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });

  test("Check a puzzle placement with incorrect length", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: examples[0][0].slice(0, 80),
        coordinate: "A1",
        value: "1",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        assert.equal(
          res.body.error,
          "Expected puzzle to be 81 characters long"
        );
        done();
      });
  });

  test("Check a puzzle placement with invalid placement coordinate", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: examples[0][0], coordinate: "AT", value: "9" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Invalid coordinate");
        done();
      });
  });

  test("Check a puzzle placement with invalid placement value", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: examples[0][0], coordinate: "A1", value: "10" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Invalid value");
        done();
      });
  });
});
