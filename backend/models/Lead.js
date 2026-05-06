const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    default: "New",
  },

  notes: {
    type: String,
    default: "",
  },

}, { timestamps: true });

module.exports = mongoose.model("Lead", leadSchema);