const express = require("express");
const userDb = require("./userDb.js");

const router = express.Router();

router.post("/", (req, res) => {});

router.post("/:id/posts", (req, res) => {});

router.get("/", (req, res) => {
  userDb
    .get()
    .then(users => {
      res.status(200).json(users); // why does this work without middleware?
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: "The users' information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  const userId = req.params.id;

  userDb
    .getById(userId)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err =>
      res.status(500).json({
        error: `The user ${userId}'s information could not be retrieved.`
      })
    );
});

router.get("/:id/posts", (req, res) => {
  const userId = req.params.id;

  userDb
    .getUserPosts(userId)
    .then(userPosts => {
      res.status(200).json(userPosts);
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: `The user ${userId}'s posts could not be retrieved.` })
    );
});

router.delete("/:id", (req, res) => {
  const userId = req.params.id;

  userDb
    .remove(userId)
    .then(deleted => {
      if (deleted) {
        res.status(200).json({ message: `The user ${userId} was deleted.` });
      } else {
        res.status(404).json({ error: `The user ${userId} does not exist.` });
      }
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: `The user ${userId} could not be deleted.` })
    );
});

router.put("/:id", (req, res) => {});

//custom middleware

function validateUserId(req, res, next) {
  console.log("user id", req.params.id);
}

function validateUser(req, res, next) {
  console.log("validateDatUser", res);
  if (!req.body) {
    res.status(400).json({ message: "missing user data" });
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  }
}

function validatePost(req, res, next) {}

module.exports = router;
