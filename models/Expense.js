const mongoose = require('mongoose');

const splitSchema = new mongoose.Schema({
  name: String,
  amount: Number
}, { _id: false });

const expenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  paid_by: {
    type: String,
    required: true
  },
  splits: [splitSchema],
  category: {
    type: String,
    default: 'General'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Expense', expenseSchema);