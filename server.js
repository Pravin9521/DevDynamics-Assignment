require('dotenv').config(); // load .env file
const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');

const expenseRoutes = require('./routes/expenses');
const settlementRoutes = require('./routes/settlements');


const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => {
  console.error('MongoDB Connection Error:', err);
  // Optionally, add more detailed error handling or alerts here
});

app.use('/expenses', expenseRoutes);
app.use('/settlements', settlementRoutes);

app.get('/', (req, res) => {
  res.send('Split App Backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
