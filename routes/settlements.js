const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Utility to calculate net balances
function calculateBalances(expenses) {
  const balanceMap = {};
  for (const exp of expenses) {
    balanceMap[exp.paid_by] = (balanceMap[exp.paid_by] || 0) + exp.amount;
    if (exp.splits) {
      for (const s of exp.splits) {
        balanceMap[s.name] = (balanceMap[s.name] || 0) - s.amount;
      }
    }
  }
  return balanceMap;
}

// GET /settlements
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find();
    console.log("Fetched expenses:", expenses);
    const balances = calculateBalances(expenses);
    console.log("Calculated balances:", balances);

    // Simplified settlement logic
    const creditors = [], debtors = [];
    for (const [person, balance] of Object.entries(balances)) {
      if (balance > 0) creditors.push({ person, balance });
      else if (balance < 0) debtors.push({ person, balance });
    }
    const settlements = [];
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i], creditor = creditors[j];
      const amount = Math.min(-debtor.balance, creditor.balance);
      settlements.push({ from: debtor.person, to: creditor.person, amount: +amount.toFixed(2) });
      debtor.balance += amount;
      creditor.balance -= amount;
      if (Math.abs(debtor.balance) < 0.01) i++;
      if (Math.abs(creditor.balance) < 0.01) j++;
    }
    res.json({ success: true, data: settlements });
  } catch (err) {
    console.error('MongoDB Error in /settlements:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /settlements/balances
router.get('/balances', async (req, res) => {
  try {
    const expenses = await Expense.find();
    const balances = calculateBalances(expenses);
    res.json({ success: true, data: balances });
  } catch (err) {
    console.error('MongoDB Error in /settlements/balances:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /settlements/people
router.get('/people', async (req, res) => {
  try {
    const expenses = await Expense.find();
    const people = new Set();
    for (const exp of expenses) {
      people.add(exp.paid_by);
      if (Array.isArray(exp.splits)) {
        exp.splits.forEach(s => people.add(s.name));
      }
    }
    res.json({ success: true, data: Array.from(people) });
  } catch (err) {
    console.error('MongoDB Error in /settlements/people:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
