const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const userController = require("../controllers/userController");
const User = require("../models/user");

chai.use(require("sinon-chai"));

describe("User Controller Unit Tests", () => {
  let req, res;

  beforeEach(() => {
    // Create request and response objects for each test
    req = { user: { id: 1 } }; // Simulating a logged-in user with ID 1
    res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(), // Ensures that 'this' refers to 'res' object in chained calls
    };

    // Stub the User.findAll method to simulate fetching users
    sinon.stub(User, "findAll").resolves([
      { id: 1, username: "johndoe", email: "john.doe@example.com" },
      { id: 2, username: "janedoe", email: "jane.doe@example.com" },
    ]);

    // Stub the User.findByPk method to simulate fetching a single user by ID
    sinon.stub(User, "findByPk").callsFake((id) => {
      const users = {
        1: { id: 1, username: "johndoe", email: "john.doe@example.com" },
        2: { id: 2, username: "janedoe", email: "jane.doe@example.com" },
      };
      return Promise.resolve(users[id] || null);
    });
  });

  afterEach(() => {
    sinon.restore(); // Restore all stubs
  });

  it("getAllUsers should fetch all users", async () => {
    await userController.getAllUsers(req, res);
    expect(res.status).to.have.been.calledOnceWithExactly(200); // Checking the status was called correctly
    expect(res.json).to.have.been.calledWith([
      { id: 1, username: "johndoe", email: "john.doe@example.com" },
      { id: 2, username: "janedoe", email: "jane.doe@example.com" },
    ]);
  });

  it("getUserById should fetch a single user by ID", async () => {
    req.params = { id: "1" }; // User 1 is fetching their own data
    await userController.getUserById(req, res);
    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledOnceWithExactly({
      id: 1,
      username: "johndoe",
      email: "john.doe@example.com",
    });
  });

  it("getUserById should return a 404 if the user is not found", async () => {
    req.params = { id: "999" };
    await userController.getUserById(req, res);
    expect(res.status).to.have.been.calledWith(404);
    expect(res.json).to.have.been.calledOnceWithExactly({
      message: "User not found",
    });
  });

  it("getUserById should return a 403 when a user attempts to access another user's data", async () => {
    req.params = { id: "2" }; // User 1 attempting to access User 2's data
    await userController.getUserById(req, res);
    expect(res.status).to.have.been.calledWith(403);
    expect(res.json).to.have.been.calledOnceWithExactly({
      message: "Unauthorized to access this user data",
    });
  });
});
