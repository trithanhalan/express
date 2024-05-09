const chai = require("chai");
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");
const sinon = require("sinon");
const { expect } = chai;
const app = require("../index"); 
const Post = require("../models/post"); 

chai.use(chaiHttp);

describe("Post Endpoints E2E Tests", () => {
  let authToken;
  let authToken2;
  let postStub;

  before(() => {
    // Setup and create a token for authentication
    authToken = jwt.sign({ id: 1, username: "user1" }, "your_secret_key", {
      expiresIn: "1h",
    });
    authToken2 = jwt.sign({ id: 2, username: "user2" }, "your_secret_key", {
      expiresIn: "1h",
    });

    // Stub the Post model's methods
    sinon
      .stub(Post, "findAll")
      .resolves([
        {
          id: 1,
          title: "First Post",
          body: "Content of the first post",
          userId: 1,
        },
      ]);
    sinon
      .stub(Post, "findOne")
      .resolves({
        id: 1,
        title: "First Post",
        body: "Content of the first post",
        userId: 1,
      });
    sinon
      .stub(Post, "create")
      .resolves({
        id: 2,
        title: "New Post",
        body: "Content of the new post",
        userId: 1,
      });
    sinon.stub(Post, "update").callsFake((values, options) => {
      // Check if the update condition matches any predefined condition
      if (options.where.id === 1 && options.where.userId === 1) {
        // Simulate that the update method returns an array where the first element is the count of rows updated
        return Promise.resolve([
          1,
          [{ id: 1, title: values.title, body: values.body, userId: 1 }],
        ]);
      } else {
        // Simulate no rows being updated
        return Promise.resolve([0]);
      }
    });

    sinon.stub(Post, "destroy").callsFake((options) => {
      return options.where.id === 1 ? 1 : 0; // Simulating delete count
    });
  });

  after(() => {
    // Restore all stubs
    sinon.restore();
  });

  it("should fetch all posts for the logged-in user", (done) => {
    chai
      .request(app)
      .get("/posts")
      .set("Authorization", `Bearer ${authToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  it("should fetch a single post by ID", (done) => {
    chai
      .request(app)
      .get("/posts/1")
      .set("Authorization", `Bearer ${authToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("id");
        done();
      });
  });

  it("should create a new post", (done) => {
    chai
      .request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ title: "New Post", body: "Content of the new post" })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("id");
        done();
      });
  });

  it("should update a post if the user is the owner", (done) => {
    chai
      .request(app)
      .patch("/posts/1") // Assuming post ID = 1 belongs to user ID = 1
      .set("Authorization", `Bearer ${authToken}`)
      .send({ title: "Updated Post Title", content: "Updated content here" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        // expect(res.text).to.equal('Post updated');
        done();
      });
  });

  it("should not update a post if the user is not the owner", (done) => {
    chai
      .request(app)
      .patch("/posts/2") // Assuming post ID = 2 does not belong to user ID = 1
      .set("Authorization", `Bearer ${authToken2}`)
      .send({
        title: "Unauthorized Update Attempt",
        content: "This should fail",
      })
      .end((err, res) => {
        expect(res).to.have.status(403); // Access denied due to ownership
        expect(res.text).to.include("Not authorized to update this post");
        done();
      });
  });


});
