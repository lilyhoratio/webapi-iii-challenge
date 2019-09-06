const express = require("express");
const userDb = require("./userDb.js");

const router = express.Router();

// USER ENDPOINTS
// ================================================

// ADD NEW USER - done (was getting 500 error without .json() middleware)
router.post("/", (req, res) => {
  const user = req.body;

  userDb
    .insert(user)
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: "The users' information could not be added." });
    });
});

// ADD post for a user (middleware on it)
// ================================================
router.post("/:id/posts", (req, res) => {});

// GET ALL USERS - done
// ================================================
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

// GET A USER - done
// ================================================
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

// GET A USER'S POSTS - done
// ================================================
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

// DELETE A USER - done
// ================================================
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

// EDIT A USER - done
// ================================================
router.put("/:id", (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;

  userDb
    .update(userId, updatedUser)
    .then(updated => {
      if (updated) {
        res.status(200).json({ message: `User ${userId} has been updated` });
      } else {
        res.status(404).json({ message: `User ${userId} does not exist` });
      }
    })
    .catch(err => console.log(err));
});

// CUSTOM MIDDLEWARE
// ================================================

function validateUserId(req, res, next) {
  console.log("user id", req.params.id);
}

function validateUser(req, res, next) {
  console.log("validateDatUser", res);
  if (!req.body) {
    res.status(400).json({ message: "missing user data" });
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    req.body = { name };
  }
}

function validatePost(req, res, next) {}

module.exports = router;
