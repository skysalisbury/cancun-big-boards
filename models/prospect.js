const mongoose = require("mongoose");
// shortcut variable
const Schema = mongoose.Schema;

const prospectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  height: {
    type: String
  },
  age: {
    type: Number,
    required: true,
  },
  wingspan: {
    type: String,
  },
  team: {
    type: String,
    required: true,
  },
  position: {
    type: String, //Might come back and change this to something I can 
    // reference for a search feature.
    required: true,
  },
  weight: {
    type: Number,
  },
  rating: {
    type: Number, //Might come back and change to Int
  },
  imageURL: {
    type: String,
  },
  stats: {
    type: String,
  },
  description: {
    type: String,
  },
  boards: {
    type: Schema.Types.ObjectId,
    ref: 'Board'
  },
}, {
  // Mongoose will maintain a createdAt & updatedAt property
  timestamps: true
});

const Prospect = mongoose.model("Prospect", prospectSchema);
module.exports = Prospect;
