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
  console.log(res.render('prospects/index.ejs', { prospects }));
});

//New Action 
// GET /prospects/new
// Example of a protected route
router.get('/new', ensureLoggedIn, async (req, res) => {
  const prospects = await Prospect.find({});
  res.render('prospects/new.ejs', { user: req.currentUser, prospects});
});

//Create Action
//POST /prospects
router.post('/', ensureLoggedIn, async (req, res) => {
  try {
    if (!req.body.imageUrl) {
      delete req.body.imageUrl;
    }
    const newPlayer = new Prospect(req.body);
    await newPlayer.save();
    res.redirect('/prospects');
    // newRecipe. = req.currentUser._id;
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }

});

//Show action
//GET /prospects/:id
router.get('/:prospectId', async (req, res) => {
    const prospect = await Prospect.findById(req.params.prospectId);
    res.render('prospects/show.ejs', { prospect });
  })

  //Delete Action
  //Delete /prospects/:id
  router.delete('/:id', async (req, res) => {
    await Prospect.findByIdAndDelete(req.params.id);
    res.redirect('/prospects');
  });

  //EDIT ACTION
  //GET /prospects/:id/edit
  router.get('/:id/edit', async (req, res) => {
    const prospect = await Prospect.findById(req.params.id);
    res.render('prospects/edit.ejs', { prospect });
  });

  //UPDATE ACTION
  //PUT /prospects/:id
router.put('/:id', async (req, res) => {
  const prospect = await Prospect.findById(req.params.id);
  Object.assign(prospect, req.body);
  await prospect.save();
  res.redirect(`/prospects/${prospect._id}`);
});


  module.exports = router;