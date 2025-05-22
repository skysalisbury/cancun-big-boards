const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const prospectSchema = new Schema(
  {
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
      type: String,
    },
    rating: {
      type: Number,
    },
    image: {
      type: String,
      default: 'https://tosomeimage.png',
    },
    stats: {
      type: String,
    },
    description: {
      type: String,
    },
    origin: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Prospect = mongoose.model('Prospect', prospectSchema);
module.exports = Prospect;
