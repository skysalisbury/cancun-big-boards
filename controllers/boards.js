const express = require('express');
const router = express.Router();
const Board = require('../models/board');
const Prospect = require('../models/prospect');
// Middleware used to protect routes that need a logged in user
const ensureLoggedIn = require('../middleware/ensure-logged-in');

// This is how we can more easily protect ALL routes for this router
// router.use(ensureLoggedIn);

// ALL paths start with '/unicorns'

// index action
// GET /prospects
// Example of a non-protected route
router.get('/', ensureLoggedIn, async (req, res) => {
 const boards = await Board.find({});
 res.render('boards/index.ejs', { boards });
});

// GET /prospects/new
// Example of a protected route
router.get('/new', ensureLoggedIn, async (req, res) => {
 const boards = await Board.find({});
 res.render('boards/new.ejs', { user: req.user, boards });
});

//Create Action
router.post('/', async (req, res) => {
 try {
  // if (!req.body.imageUrl) {
  //   delete req.body.imageUrl;
  // }
  req.body.createdBy = req.user._id;
  const newBoard = new Board(req.body);
  await newBoard.save();
  res.redirect('/boards');
 } catch (error) {
  console.log(error);
  res.redirect('/');
 }

});

//Show action
//POST /boards/:boardId/prospects/:prospectId
router.post('/:boardId/prospects/:prospectId', ensureLoggedIn, async (req, res) => {
 req.body.createdBy = req.user._id;
 const board = await Board.findById(req.params.boardId).populate('createdBy').exec();
 const prospect = await Prospect.findById(req.params.prospectId).populate('createdBy').exec();
 board.prospects.push(prospect._id);
 await board.save();
 // console.log(prospect.createdBy._id.toString());
 // console.log(req.user._id.toString());
 res.redirect('boards/show.ejs', { board, prospect });
});

router.get('/:boardId', async (req, res) => {
//finding board by boardId
const board = await Board.findById(req.params.boardId)
//find all prospects
const prospects = await Prospect.find({});
 res.render('boards/show.ejs', { board, prospects });
});


module.exports = router;