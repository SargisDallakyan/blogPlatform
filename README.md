# Blog Platform API

## Description

This project is a backend implementation of a blog platform. It features user authentication, *CRUD* operations for blog posts, and the ability to add comments to posts. The API is built using Node.js with Express and uses MongoDB as the database.

## Features

- User Authentication (Register, Login, Logout)
- CRUD operations for blog posts
- Ability to comment on blog posts
- JWT-based authentication for protected routes

## Installation
## 🚀 Quick start
1. Clone the repository:
   ```bash
   git clone [repository-url]
2. Navigate to the project directory 
    cd [blog_platform]
    3. Run `npm install` in your terminal to install all dependencies from npm.
4. Set up a MongoDB database and add URI to `.env` file as `DATABASE_URL=your_database_uri`.
5. Start the server by running `nodemon index.js` or `npm start`.

6. Open http://localhost:9000/ in your web browser to access the application.   
API Endpoints

7. Authentication
.POST /api/auth/register: Register a new user
.POST /api/auth/login: Login a user
.POST /api/auth/logout: Logout a user

8. Blog Posts
.GET /api/posts: Get all blog posts
.POST /api/posts: Create a new blog post (protected)
.GET /api/posts/:id: Get a single blog post
.PUT /api/posts/:id: Update a blog post (protected)
.DELETE /api/posts/:id: Delete a blog post (protected)

9. Comments
.POST /api/posts/:postId/comments: Add a comment to a post (protected)
.GET /api/posts/:postId/comments: Get comments for a post
.DELETE /api/comments/:commentId: Delete a comment (protected)


##Contributors
[Seyran]



