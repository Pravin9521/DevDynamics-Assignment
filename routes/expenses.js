const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// GET /expenses
router.get('/', async (req, res) => {
  const expenses = await Expense.find().sort({ created_at: -1 });
  res.json({ success: true, data: expenses });
});

// POST /expenses
router.post('/', async (req, res) => {
  try {
    const { amount, description, paid_by, splits } = req.body;
    console.log("📥 Incoming expense:", req.body); // 👈 log it

    if (!amount || amount <= 0 || !description || !paid_by) {
      return res.status(400).json({ success: false, message: 'Invalid input' });
    }

    const expense = new Expense({ amount, description, paid_by, splits });
    const saved = await expense.save();

    console.log("✅ Saved to DB:", saved); // 👈 log result

    res.status(201).json({ success: true, data: saved, message: 'Expense added successfully' });
  } catch (err) {
    console.error("❌ Error saving:", err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// PUT /expenses/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Expense not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /expenses/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Expense not found' });
    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;