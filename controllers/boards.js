const express = require('express');
const router = express.Router();
const Board = require('../models/board');
const Prospect = require('../models/prospect');
const ensureLoggedIn = require('../middleware/ensure-logged-in');

router.get('/', async (req, res) => {
  let boards;
  let viewingUserBoards = false;

  if (
    req.query.user &&
    req.user &&
    req.user._id.toString() === req.query.user
  ) {
    boards = await Board.find({ createdBy: req.user._id });
    viewingUserBoards = true;
  } else {
    boards = await Board.find({}).populate('createdBy');
  }
  res.render('boards/index.ejs', { boards, user: req.user, viewingUserBoards });
});

router.get('/new', ensureLoggedIn, async (req, res) => {
  const boards = await Board.find({});
  res.render('boards/new.ejs', { user: req.user, boards });
});

router.post('/', async (req, res) => {
  req.body.createdBy = req.user._id;
  const newBoard = new Board(req.body);
  await newBoard.save();
  res.redirect('/boards');
});

router.get('/:boardId', async (req, res) => {
  const board = await Board.findById(req.params.boardId)
    .populate('prospects.prospect')
    .populate('createdBy');
  const prospects = await Prospect.find({});
  res.render('boards/show.ejs', { board, prospects, user: req.user });
});

router.post('/:boardId/prospects', ensureLoggedIn, async (req, res) => {
  const { prospectId } = req.body;
  const board = await Board.findById(req.params.boardId);
  const alreadyAdded = board.prospects.some(
    (p) => p.prospect.toString() === prospectId
  );
  if (!alreadyAdded) {
    board.prospects.push({ prospect: prospectId });
    await board.save();
  }
  res.redirect(`/boards/${board._id}`);
});

router.post('/:boardId/prospects/:prospectId/evaluation', async (req, res) => {
  const board = await Board.findById(req.params.boardId);
  const evalEntry = board.prospects.find(
    (p) => p.prospect.toString() === req.params.prospectId
  );
  if (evalEntry) {
    evalEntry.evaluation = req.body.evaluation;
    await board.save();
  }
  res.redirect(`/boards/${req.params.boardId}`);
});

router.delete('/:id', async (req, res) => {
  await Board.findByIdAndDelete(req.params.id);
  res.redirect('/boards');
});

router.delete(
  '/:boardId/prospects/:prospectId',
  ensureLoggedIn,
  async (req, res) => {
    const board = await Board.findById(req.params.boardId);
    board.prospects = board.prospects.filter((item) => {
      return item.prospect.toString() !== req.params.prospectId;
    });
    await board.save();
    res.redirect(`/boards/${board._id}`);
  }
);

router.get('/:boardId/edit', ensureLoggedIn, async (req, res) => {
  const board = await Board.findById(req.params.boardId).populate(
    'prospects.prospect'
  );
  const prospects = await Prospect.find({});
  res.render('boards/edit.ejs', { board, prospects, user: req.user });
});

router.put('/:boardId', async (req, res) => {
  const board = await Board.findById(req.params.boardId);
  board.title = req.body.title;
  board.evaluation = req.body.evaluation;
  for (let prospectId in req.body.prospectEvaluations) {
    const evaluation = req.body.prospectEvaluations[prospectId];
    const evalEntry = board.prospects.find(
      (p) => p.prospect.toString() === prospectId
    );
    if (evalEntry) {
      evalEntry.evaluation = evaluation;
    }
  }
  if (req.body.newProspect) {
    const newProspectId = req.body.newProspect;
    const alreadyAdded = board.prospects.some(
      (p) => p.prospect.toString() === newProspectId
    );
    if (!alreadyAdded) {
      board.prospects.push({ prospect: newProspectId });
    }
  }
  await board.save();
  res.redirect(`/boards/${board._id}`);
});

router.get(
  '/:boardId/prospects/:prospectId/evaluations/edit',
  ensureLoggedIn,
  async (req, res) => {
    const board = await Board.findById(req.params.boardId);
    const item = board.prospects.find(
      (p) => p.prospect.toString() === req.params.prospectId
    );
    if (!item) {
      return res.redirect(`/boards/${board._id}`);
    }
    const foundProspect = await Prospect.findById(req.params.prospectId);
    res.render('boards/evaluations/edit.ejs', {
      boardId: req.params.boardId,
      prospectId: req.params.prospectId,
      evaluation: item.evaluation,
      prospect: foundProspect,
    });
  }
);

router.put('/:boardId/prospects/:prospectId/evaluations', ensureLoggedIn, async (req, res) => {
  const board = await Board.findById(req.params.boardId);
  const item = board.prospects.find(
    (p) => p.prospect.toString() === req.params.prospectId
  );

  if (item) {
    item.evaluation = req.body.evaluation;
    await board.save();
  }

  res.redirect(`/boards/${board._id}`);
});


router.patch(
  '/:boardId/prospects/:prospectId',
  ensureLoggedIn,
  async (req, res) => {
    const board = await Board.findById(req.params.boardId);
    const item = board.prospects.find(
      (p) => p.prospect.toString() === req.params.prospectId
    );
    if (!item) return res.redirect(`/boards/${board._id}`);
    if (req.body.tierColor) item.tierColor = req.body.tierColor;
    await board.save();
    res.redirect(`/boards/${board._id}`);
  }
);

module.exports = router;
