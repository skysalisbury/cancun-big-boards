const mongoose = require("mongoose");
// shortcut variable
const Schema = mongoose.Schema;

const mongoose = require("mongoose");
const user = require("./user");


const boardSchema = new Schema({
  boardPlayers: {
    type: Schema.Types.ObjectId,
    ref: 'Prospect',
  },
  title: {
    type: String
  },
  description: String,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
}, 
  // Mongoose will maintain a createdAt & updatedAt property
  timestamps: true
});

const Board = mongoose.model("Board", boardSchema);
module.exports = Board;




