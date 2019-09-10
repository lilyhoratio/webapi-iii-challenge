const express = require("express");
const postDb = require("./postDb.js");

const router = express.Router();

router.use(express.json()); // for requests only

// GET ALL POSTS
router.get("/", (req, res) => {
  postDb
    .get()
    .then(posts => {
      // res.send(posts); // why is this still formatted like JSON?
      res.status(200).json(posts); // why does this work without middleware?
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

// GET A POST
router.get("/:id", (req, res) => {
  const postId = req.params.id;
  postDb
    .getById(postId)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: `The post with the specified ID ${postId} does not exist.`
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: `The information for post ${postId} could not be retrieved.`
      });
    });
});

// DELETE A POST
router.delete("/:id", (req, res) => {
  const postId = req.params.id;
  postDb
    .remove(postId) // returns count of posts deleted
    .then(deleted => {
      if (deleted) {
        // if post exists
        res.status(200).json({ message: `Post ${postId} has been deleted` });
      } else {
        // if post does not exist
        res.status(404).json({
          error: `Post ${postId} does not exist.`
        });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The post could not be removed" });
    });
});

// requires middleware for user? {text: "something", user_id: 1}

// EDIT A POST
router.put("/:id", (req, res) => {
  const postId = req.params.id;
  const updatedPost = req.body;
  postDb
    .update(postId, updatedPost) // returns count of updated posts
    .then(updated => {
      if (updated) {
        res.status(200).json({ message: `Post ${postId} has been updated` });
      } else {
        res.status(404).json({ message: `User ${userId} does not exist` });
      }
    });
});

// custom middleware

function validatePostId(req, res, next) {
  // validate that the post exists
}

module.exports = router;
