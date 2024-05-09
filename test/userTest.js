const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index");
const expect = chai.expect;

chai.use(chaiHttp);

describe("User Endpoints", () => {
  it("should fetch all users", (done) => {
    chai
      .request(app)
      .get("/users")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });
});
