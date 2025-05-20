const mongoose = require("mongoose");
// shortcut variable
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
  // Mongoose will maintain a createdAt & updatedAt property
  timestamps: true
});


const Board = mongoose.model("Board", boardSchema);
module.exports = Board;




