// ================= IMPORTS ===================
const express = require("express");
const server = express();
const postRouter = require("./posts/postRouter");
const userRouter = require("./users/userRouter");

server.use(express.json()); // this is for accepting json requests

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

// MIDDLEWARE
// ================================================
function logger(req, res, next) {
  console.log(
    `Request method:\t${req.method}\nRequest url:\t${
      req.url
    }\nDate:\t${Date.now()}\n\n`
  );
  // next();
}

server.use(logger); // need middleware before endpoints

// ROUTES
// ================================================
server.use(`/api/posts`, postRouter);
server.use(`/api/users`, userRouter);

module.exports = server;
