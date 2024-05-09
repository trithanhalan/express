const chai = require("chai");
const sinon = require("sinon");
const { expect } = chai;
const postController = require("../controllers/postController");
const Post = require("../models/post");

describe("Post Controller Unit Tests", () => {
    beforeEach(() => {
        // Stubbing model methods
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
        sinon.stub(Post, "findOne").callsFake((options) => {
            if (options.where.id === "1" && options.where.userId === 1) {
                return Promise.resolve({
                    id: 1,
                    title: "First Post",
                    body: "Content of the first post",
                    userId: 1,
                });
            } else {
                return Promise.resolve(null);
            }
        });
        sinon.stub(Post, "create").resolves({
            id: 3,
            title: "New Post",
            body: "Content of the new post",
            userId: 1,
        });
        sinon.stub(Post, "update").resolves([1]); // Simulating the update function
        sinon.stub(Post, "destroy").resolves(1); // Simulating a successful deletion
        sinon.stub(Post, "findByPk").callsFake((id) => {
            return id === "1"
                ? Promise.resolve({
                    id: 1,
                    title: "Existing Post",
                    body: "Existing content",
                    userId: 1,
                })
                : Promise.resolve(null);
        });
    });

    afterEach(() => {
        // Restoring the default behavior of stubs
        sinon.restore();
    });

    it("should fetch all posts for a user", async () => {
        const req = { user: { id: 1 } };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await postController.getAllPosts(req, res);
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledOnceWith(sinon.match.array)).to.be.true;
    });

    it("should create a new post", async () => {
        const req = {
            body: { title: "New Post", content: "Content of the new post" },
            user: { id: 1 },
        };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await postController.createPost(req, res);
        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(res.json.firstCall.args[0]).to.include({ title: "New Post" });
    });

    it("should update a post", async () => {
        const req = {
            params: { id: "1" },
            body: { title: "Updated Post", body: "Updated content" },
            user: { id: 1 },
        };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await postController.updatePost(req, res);
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
    });
});
