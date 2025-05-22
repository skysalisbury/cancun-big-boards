require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const ensureLoggedIn = require('./middleware/ensure-logged-in.js');
const addUserToReqAndLocals = require('./middleware/add-user-to-req-and-locals.js');
const Board = require('./models/board');
const Prospect = require('./models/prospect');

const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.static('public'));

app.use(express.urlencoded({ extended: false }));

app.use(methodOverride('_method'));

app.use(morgan('dev'));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(require('./middleware/add-user-to-req-and-locals'));

app.get('/', async (req, res) => {
  const recentBoards = await Board.find({}).limit(3).populate('createdBy');
  const allProspects = await Prospect.find({});
  const shuffled = allProspects.sort(() => 0.5 - Math.random());
  const dailyProspects = shuffled.slice(0, 3);
  res.render('home.ejs', { recentBoards, dailyProspects, user: req.user });
});

app.use('/auth', require('./controllers/auth'));

app.use('/prospects', require('./controllers/prospects'));
app.use('/boards', require('./controllers/boards'));

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
