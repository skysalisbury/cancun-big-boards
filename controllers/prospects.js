const express = require('express');
const router = express.Router();
const Prospect = require('../models/prospect');

// Middleware used to protect routes that need a logged in user
const ensureLoggedIn = require('../middleware/ensure-logged-in');

// This is how we can more easily protect ALL routes for this router
// router.use(ensureLoggedIn);

// router.use(async (req,res,next) => {
//   const currentUser = await User.findById(req.session.user._id);
//   req.currentUser = currentUser;
//   next();
// })

// ALL paths start with '/unicorns'

// index action
// GET /prospects
// Example of a non-protected route
router.get('/', async (req, res) => {
  const prospects = await Prospect.find({});
  res.render('prospects/index.ejs', { prospects });
});

// GET /prospects/new
// Example of a protected route
router.get('/new', ensureLoggedIn, async (req, res) => {
  const prospects = await Prospect.find({});
  res.render('prospects/new.ejs', { user: req.currentUser, prospects});
});

//POST /prospects
router.post('/', async (req, res) => {
  try {
    const newPlayer = new Prospect(req.body);
    await newPlayer.save();
    res.redirect('/prospects');
    // newRecipe. = req.currentUser._id;
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }

});

module.exports = router;