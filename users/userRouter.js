const express = require("express");
const userDb = require("./userDb.js");

const router = express.Router();

// USER ENDPOINTS
// ================================================

// ADD NEW USER - done (was getting 500 error without .json() middleware)
router.post("/", validateUser, (req, res) => {
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
router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const addedPost = req.body;
  userDb
    .insert(addedPost)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "The users' post could not be added" });
    });
});

// GET ALL USERS - done
// ================================================
router.get("/", (req, res) => {
  userDb
    .get()
    .then(users => {
      // console.log(users);
      // res.end();
      res.status(200).json(users);
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
router.get("/:id", validateUserId, (req, res) => {
  console.log("get user!"); // doesn't log when user doesn't exist b/c is caught by middlware
  // const userId = req.params.id;

  // userDb
  //   .getById(userId)
  //   .then(user => {
  //     res.status(200).json(user);
  //   })
  //   .catch(err =>
  //     res.status(500).json({
  //       error: `The user ${userId}'s information could not be retrieved.`
  //     })
  //   );

  res.status(200).json(req.user);
});

// GET A USER'S POSTS - done
// ================================================
router.get("/:id/posts", validateUserId, (req, res) => {
  // with validateUserId, error message instead of empty array is returned
  const userId = req.params.id;

  userDb
    .getUserPosts(userId)
    .then(userPosts => {
      // console.log(userPosts);
      // res.end();
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
router.delete("/:id", validateUserId, (req, res) => {
  const userId = req.params.id;

  userDb
    .remove(userId)
    .then(deleted => {
      // if (deleted) {
      res.status(204).json({ message: `The user ${userId} was deleted.` });
      // } else {
      //   res.status(404).json({ error: `The user ${userId} does not exist.` });
      // }
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: `The user ${userId} could not be deleted.` })
    );
});

// EDIT A USER - done
// ================================================
router.put("/:id", validateUserId, validateUser, (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;

  userDb
    .update(userId, updatedUser) // updatedUser ==> { name } b/c it avoids throwing errors when a client provides extra data you don't need
    .then(updated => {
      // if (updated) { // remove b/c added middleware
      res.status(200).json({ message: `User ${userId} has been updated` });
      // } else {
      //   res.status(404).json({ message: `User ${userId} does not exist` });
      // }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: `The user's information could not be updated.` });
    });
});

// CUSTOM MIDDLEWARE
// ================================================

function validateUserId(req, res, next) {
  const userId = req.params.id;

  userDb.getById(userId).then(user => {
    if (user) {
      req.user = user; // add user as key to req so we don't need to remake the request for .get
      next();
    } else {
      res.status(404).json({ error: `User ${userId} does not exist` });
      // no need for next()  because you are sending a response back & you don't want to continue on with the PUT
    }
  });
}

// check user input - PUT/POST
function validateUser(req, res, next) {
  console.log("REQUEST", req.body);
  // if (!req.body) { // ASK HENRY
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "missing user data" });
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    req.name = req.body.name;
    next();
  }
}

function validatePost(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "missing post data" });
  } else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" });
  }
}

module.exports = router;
