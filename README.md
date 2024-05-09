# ExpressJS Blog API

This project is an ExpressJS application that serves as a blogging platform API. It supports operations such as posting blog posts, commenting on them, and user authentication.

## Features

- RESTful API endpoints for managing posts, comments, and users.
- Authentication and authorization to secure endpoints.
- Unit and end-to-end testing of API routes.

## Technologies Used

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT for authentication
- Chai and Mocha for testing

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm installed on your machine. This project was built using Node.js version 16.x.

### Installing

To get the development environment running, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://yourrepositorylink.com

   ```

2. Navigate to the project directory:
   bash
   cd express-blog-api

3. Install dependencies:
   npm install

4. Setup your database and environment variables:
   Configure your MySQL database according to the config/config.json file.
   Set up a .env file based on the .env.example provided in the project.

5. Running the application
   Start the server by running:

npm start
This will launch the server on http://localhost:3000 by default.

6. Running the tests
   Execute the tests by running:
   npm test

This command will run both unit and end-to-end tests defined in the test directory.

### API Endpoints

The following are the primary routes defined in this application:

GET /posts: Fetch all posts.
GET /posts/:id: Fetch a single post by ID.
POST /posts: Create a new post.
PATCH /posts/:id: Update a post.
DELETE /posts/:id: Delete a post.
POST /posts/:id/comments: Add a comment to a post.
DELETE /posts/:postId/comments/:commentId: Delete a comment from a post.
GET /users: Fetch all users.
POST /login: Authenticate a user and return a JWT.
