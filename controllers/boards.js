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
  req.body.createdBy = req.user._id;
  const newBoard = new Board(req.body);
  await newBoard.save();
  res.redirect('/boards');
 } catch (error) {
  console.log(error);
  res.redirect('/');
 }

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
// POST /boards/:boardId/prospects
router.post('/:boardId/prospects', ensureLoggedIn, async (req, res) => {
 try {
   const board = await Board.findById(req.params.boardId);
   const prospectId = req.body.prospectId;

   if (!board.createdBy === req.user._id) {
     return res.status(403).send('Unauthorized');
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
router.delete('/:id', async (req, res) => {
  await Board.findByIdAndDelete(req.params.id);
  res.redirect('/boards');
});





module.exports = router;