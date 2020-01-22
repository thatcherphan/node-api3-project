const express = require('express');
const db = require("./userDb");

const router = express.Router();

router.post('/', (req, res) => {
  // do your magic!
  db.insert(req.body)
  .then(user => {
      if(req.body.name !== "") {
          res.status(201).json(user)
      } else {
          res.status(400).json({ errorMessage: "Please provide name for user" })
      }
  })
  .catch(err => {
      res.status(500).json({ error: "There was an error while saving the post to the database", err })
  })
});

router.post('/:id/posts', (req, res) => {
  // do your magic!
});

router.get('/', (req, res) => {
  // do your magic!
  db.get()
    .then(user => {
        res.status(200).json(user)
    })
    .catch(err => {
        res.status(500).json({ error: "The users information could not be retrieved.", err })
    })
});

router.get('/:id', (req, res) => {
  // do your magic!
  const id = req.params.id;

  db.getById(id)
      .then(user => {
          if (user != undefined) {
              res.status(200).json(user)
          } else  {
              res.status(404).json({ message: "The user with the specified ID does not exist." })
          }
      })
      .catch(err => {
          res.status(500).json({ error: "The user information could not be retrieved.", err })
      })
});

router.get('/:id/posts', async(req, res) => {
  // do your magic!
  try {
    const post = await db.getUserPosts(req.params.id);
    if (post.length > 0) {
        res.status(200).json(post)
    } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
    } 
} catch(error) {
    console.log(error)
    res.status(500).json({ error: "The post information could not be retrieved.", error })
}
});

router.delete('/:id', (req, res) => {
  // do your magic!
  const id = req.params.id; 

  db.remove(id)
      .then(user => {
          if (user === undefined) {
              res.status(404).json({ message: "The user with the specified ID does not exist." })
          } else {
              res.status(200).end()
          }
      })
      .catch(err => {
         res.status(500).json({ error: "The user could not be removed", err }) 
      })
});

router.put('/:id', (req, res) => {
  // do your magic!
  const changes = req.body;
  const id = req.params.id;

  db.update(id, changes)
      .then(user => {
          if (user === undefined) {
              res.status(404).json({ message: "The user with the specified ID does not exist." })
          } else {
              res.status(200).json(user)
          }
      })
      .catch(err => {
          res.status(500).json({ error: "The user information could not be modified.", err })
      })
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
}

function validateUser(req, res, next) {
  // do your magic!
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
