const express = require("express");

const server = express();
const postRouter = require("./posts/postRouter");
const userRouter = require("./users/userRouter");

// server.use(express.json());

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use(`/api/posts`, postRouter);
server.use(`/api/users`, userRouter);

//custom middleware

function logger(req, res, next) {
  console.log("logging, yay.");
  next();
}

// server.use(logger);

module.exports = server;
