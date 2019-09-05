const express = require("express");
const postDb = require("./postDb.js");

const router = express.Router();

router.use(express.json());

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

router.get("/:id", (req, res) => {});

router.delete("/:id", (req, res) => {});

router.put("/:id", (req, res) => {});

// custom middleware

function validatePostId(req, res, next) {
  // validate that the post exists
}

module.exports = router;
