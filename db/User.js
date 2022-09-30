const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  name: {
    type: String,
    required: true
  },
  xbox: {
    type: String,
  },
  ps: {
    type: String,
  },
  note: {
    type: String,
  },
  answers: {
    type: [Number],
    required: true,
    min: 10,
    max: 10
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  ip: {
    type: String,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = mongoose.model("User", User);
module.exports = UserModel;