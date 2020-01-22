const express = require('express');
const db = require("./userDb");
const postDb = require("../posts/postDb");

const router = express.Router();

router.post('/', validateUser, (req, res) => {
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
      res.status(500).json({ error: "There was an error while saving the user to the database", err })
  })
});

router.post('/:id/posts', validatePost, validateUserId, (req, res) => {
  // do your magic!
  postDb.insert(req.text)
    .then(post => {
        if(req.body.text !== "") {
            res.status(201).json(post)
        } else {
            res.status(400).json({ errorMessage: "Please provide text for post" })
        }
    })
    .catch(err => {
        res.status(500).json({ error: "There was an error while saving the post to the database", err })
    })
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

router.get('/:id', validateUserId, (req, res) => {
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

router.get('/:id/posts', validateUserId,  async(req, res) => {
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

router.delete('/:id', validateUserId, (req, res) => {
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

router.put('/:id', validateUserId, validateUser, (req, res) => {
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
  const {id} = req.params;

  db.getById(id)
    .then(user => {
        if(user) {
          req.user = user;
          next();
        } else {
          res.status(400).json({ message: "invalid user id" })
        }
    })
    .catch(err => {
      res.status(500).json({message: "error getting user with this id", err})
    })
}

function validateUser(req, res, next) {
  // do your magic!
  if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" })
  } else {
    req.user = req.body.name;
    next();
  }
}

function validatePost(req, res, next) {
  // do your magic!
  if (!req.body.text) {
    res.status({ message: "missing required text field" })
  } else {
    req.text = req.body.text && req.params.id;
    next();
  }
}

module.exports = router;
