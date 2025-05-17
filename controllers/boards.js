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
// GET /boards
// See all boards (community boards) or see my boards (user specific)
router.get('/', async (req, res) => {
 let boards;
 
 if (req.query.user) {
   // Only show boards created by the logged-in user
   boards = await Board.find({ createdBy: req.query.user });
 } else {
   // Show all community boards
   boards = await Board.find({});
 }

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
 if (!board.prospects.includes(prospectId)) {
  board.prospects.push(prospectId);
  await board.save();
 }
 // console.log(prospect.createdBy._id.toString());
 // console.log(req.user._id.toString());
 res.redirect(`/boards/${board._id}`);
});

//Show action for players on boards
router.get('/:boardId', async (req, res) => {
 const board = await Board.findById(req.params.boardId).populate('prospects').populate('createdBy');
 const prospects = await Prospect.find({});
 res.render('boards/show.ejs', { board, prospects, user: req.user });
});

// POST /boards/add-prospect
//show/create action for players being added to boards 
// POST/boards/:boardId/prospects/:prospectId
//Will have to figure out how to remove in edit/update action
router.post('/:boardId/prospects/:prospectId', ensureLoggedIn, async (req, res) => {
 try {
  const { boardId, prospectId } = req.body;
  const board = await Board.findById(boardId);

  // Only allow adding to your own boards
  if (!board.createdBy === req.user._id) {
   return console.log('Not authorized');
  }

  if (!board.prospects.includes(prospectId)) {
   board.prospects.push(prospectId);
   await board.save();
  }

  res.redirect(`/boards/${board._id}`);
 } catch (err) {
  console.error(err);
  res.redirect('/prospects');
 }
});

//DELETE Action
//DELETE /boards/:id
// router.delete('/:boardId', async)





module.exports = router;