const express = require('express');
const router = express.Router();
const Board = require('../models/board');

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
  res.render('boards/new.ejs', { user: req.user, boards});
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




module.exports = router;