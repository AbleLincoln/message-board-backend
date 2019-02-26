const express = require('express');
const uuid = require('uuid');
const shortid = require('shortid');
const moment = require('moment');

const router = express.Router();

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
let commentData = require('../data');

const adapter = new FileSync('db.json', {
  defaultValue: { comments: commentData },
});

const db = low(adapter);

// gets all comments
router.get('/', (req, res) => {
  res.json(db.get('comments').value());
});

// get single comment
router.get('/:id', (req, res) => {
  // check if id exists
  // const found = commentData.some(comment => comment.id === parseInt(req.params.id));
  const comment = db
    .get('comments')
    .find({ id: parseInt(req.params.id) })
    .value();

  if (comment) {
    // res.json(commentData.filter(comment => comment.id === parseInt(req.params.id)));
    res.json(comment);
  } else {
    res.status(400).json({ message: `No member with id ${req.params.id} exists` });
  }
});

// create comment
router.post('/', (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({ msg: 'Please include text' });
  }

  db.get('comments')
    .push({
      text: req.body.text,
      id: shortid.generate(),
      timestamp: moment(),
    })
    .write();

  res.send(db.get('comments').value());

  // const newComment = {
  //   text: req.params.text,
  //   id: shortid.generate(),
  //   timestamp: moment(),
  // };

  // commentData.push(newComment);
  // res.send(commentData);
});

// update comment
router.put('/:id', (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({ msg: 'Please include text' });
  }

  // check if id exists
  const found = commentData.some(comment => comment.id === parseInt(req.params.id));

  if (found) {
    // const updatedComment = req.body;
    const updatedComment = commentData.find(comment => comment.id === parseInt(req.params.id));
    updatedComment.text = req.body.text;
    res.json({ msg: 'Comment updated', comment: updatedComment });
  } else {
    res.status(400).json({ message: `No member with id ${req.params.id} exists` });
  }
});

// delete comment
router.delete('/:id', (req, res) => {
  // check if id exists
  const found = commentData.some(comment => comment.id === parseInt(req.params.id));

  if (found) {
    commentData = commentData.filter(comment => comment.id !== parseInt(req.params.id));
    res.json({
      msg: 'Member deleted',
      comments: commentData,
    });
  } else {
    res.status(400).json({ message: `No member with id ${req.params.id} exists` });
  }
});

module.exports = router;
