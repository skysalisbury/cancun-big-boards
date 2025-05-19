const express = require('express');
const router = express.Router();
const Board = require('../models/board');
const Prospect = require('../models/prospect');
// Middleware used to protect routes that need a logged in user
const ensureLoggedIn = require('../middleware/ensure-logged-in');

// This is how we can more easily protect ALL routes for this router
// router.use(ensureLoggedIn);

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
 const board = await Board.findById(req.params.boardId).populate('prospects.prospect').populate('createdBy');
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
    const { prospectId } = req.body;
    const board = await Board.findById(req.params.boardId);
    const alreadyAdded = board.prospects.some(p => p.prospect.toString() === prospectId);
    if (!alreadyAdded) {
      board.prospects.push({ prospect: prospectId });
      await board.save();
    }
    res.redirect(`/boards/${board._id}`);
  } catch (err) {
    console.error(err);
    res.redirect('/prospects');
  }
});

//POST Action
//Adding and Saving evaluations of Prospects
router.post('/:boardId/prospects/:prospectId/evaluation', async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);
    const evalEntry = board.prospects.find(p => p.prospect.toString() === req.params.prospectId);
    if (evalEntry) {
      evalEntry.evaluation = req.body.evaluation;
      await board.save();
    }
    res.redirect(`/boards/${req.params.boardId}`);
  } catch (err) {
    console.log(err);
    res.redirect('/boards');
  }
});

//DELETE Action
//DELETE /boards/:id
router.delete('/:id', async (req, res) => {
  await Board.findByIdAndDelete(req.params.id);
  res.redirect('/boards');
});

//Remove prospect from your board via show page, however I want to have multiple ways to add prospects and remove them from the boards.
// DELETE /boards/:boardId/prospects/:prospectId
router.delete('/:boardId/prospects/:prospectId', ensureLoggedIn, async (req, res) => {
  const board = await Board.findById(req.params.boardId);
  board.prospects.pull(req.params.prospectId); // Mongoose way to remove from array
  await board.save();

  res.redirect(`/boards/${board._id}`);
});

//EDIT Action
//GET /boards/:boardId/edit
router.get('/:boardId/edit', ensureLoggedIn, async (req, res) => {
  const board = await Board.findById(req.params.boardId).populate('prospects.prospect');
  const prospects = await Prospect.find({});
  console.log(board.prospects);
  console.log(prospects);
  res.render('boards/edit.ejs', { board, prospects, user: req.user });
});

//UPDATE Action
//PUT /boards/:boardId
router.put('/:boardId', async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);
    board.title = req.body.title;
    board.evaluation = req.body.evaluation;
    for (let prospectId in req.body.prospectEvaluations) {
      const evaluation = req.body.prospectEvaluations[prospectId];
      const evalEntry = board.prospects.find(p => p.prospect.toString() === prospectId);
      if (evalEntry) {
        evalEntry.evaluation = evaluation;
      }
    }
    if (req.body.newProspect) {
      const newProspectId = req.body.newProspect;
      const alreadyAdded = board.prospects.some(p => p.prospect.toString() === newProspectId);
      if (!alreadyAdded) {
        board.prospects.push({ prospect: newProspectId });
      }
    }
    await board.save();
    res.redirect(`/boards/${board._id}`);
  } catch (err) {
    console.error(err);
    res.redirect('/boards');
  }
});





module.exports = router;