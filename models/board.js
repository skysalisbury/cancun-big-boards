const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const User = require('../models/user');

const boardSchema = new Schema({
  prospects: [{
    prospect: { type: Schema.Types.ObjectId, ref: 'Prospect'},
    evaluation: String,
    tierColor: { type: String, default: '#ffffff' },
  }],
  title: {
    type: String
  },
  description: String,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  evaluation: {
    type: String,
  },
  tierColor: { 
    type: String, 
    default: '#ffffff' },
}, {
  timestamps: true
});

const Board = mongoose.model("Board", boardSchema);
module.exports = Board;




