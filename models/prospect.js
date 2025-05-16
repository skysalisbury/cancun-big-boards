const mongoose = require("mongoose");
// shortcut variable
const Schema = mongoose.Schema;

const prospectSchema = new Schema({
  //For player object make sure it is specific to the player: Name, age, wingspan, height, etc)
  name: {
      type: String,
  },  
  age: {  
      type: Number,
  },
  height: {    
      type: String,
  },
  wingspan: {    
      type: String,
  },
  weight: {
      type: Number, 
  },
  team: {
    type: String,
  },
  position: {
    type: String, //Might come back and learn how to tag.
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
  }, //This logic should be inverse for boardSchema - don't forget
}, {
  // Mongoose will maintain a createdAt & updatedAt property
  timestamps: true
});

const Prospect = mongoose.model("Prospect", prospectSchema);
module.exports = Prospect;
