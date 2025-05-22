const express = require('express');
const router = express.Router();
const Prospect = require('../models/prospect');
const Board = require('../models/board');

const ensureLoggedIn = require('../middleware/ensure-logged-in');

router.get('/', async (req, res) => {
  const prospects = await Prospect.find({});
  const boardId = req.query.boardId || null;
  res.render('prospects/index.ejs', { prospects, boardId, user: req.user });
});

router.get('/new', ensureLoggedIn, async (req, res) => {
  const prospects = await Prospect.find({});
  res.render('prospects/new.ejs', { user: req.user, prospects });
});

router.post('/', async (req, res) => {
  try {
    if (!req.body.imageUrl) {
      delete req.body.imageUrl;
    }
    req.body.createdBy = req.user._id;
    const newPlayer = new Prospect(req.body);
    await newPlayer.save();
    res.redirect('/prospects');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/:prospectId', async (req, res) => {
  const prospect = await Prospect.findById(req.params.prospectId)
    .populate('createdBy')
    .exec();
  let boards = [];
  if (req.user) {
    boards = await Board.find({ createdBy: req.user._id });
  }
  res.render('prospects/show.ejs', { prospect, user: req.user, boards });
});

router.delete('/:id', async (req, res) => {
  await Prospect.findByIdAndDelete(req.params.id);
  res.redirect('/prospects');
});

router.get('/:id/edit', async (req, res) => {
  const prospect = await Prospect.findById(req.params.id);
  res.render('prospects/edit.ejs', { prospect });
});

router.put('/:id', async (req, res) => {
  const prospect = await Prospect.findById(req.params.id);
  Object.assign(prospect, req.body);
  await prospect.save();
  res.redirect(`/prospects/${prospect._id}`);
});

module.exports = router;
