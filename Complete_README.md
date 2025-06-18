# 💰 Split App Backend

A simple expense splitter backend built using **Node.js**, **Express**, and **MongoDB**.
It supports tracking shared expenses and calculating who owes whom.

---

## 🚀 Setup Instructions

### 🛠 Requirements

- Node.js v16+
- MongoDB Atlas or local MongoDB instance

### 📦 Installation

```bash
git clone https://github.com/yourusername/split-app-backend.git
cd split-app-backend
npm install
```

### 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
```

### ▶️ Run Server

```bash
node server.js
```

Server runs on: `http://localhost:5000`

---

## 📘 API Documentation

| Method | Endpoint                | Description                 |
| ------ | ----------------------- | --------------------------- |
| GET    | `/`                     | Health check                |
| GET    | `/expenses`             | Get all expenses            |
| POST   | `/expenses`             | Add a new expense           |
| PUT    | `/expenses/:id`         | Update an expense           |
| DELETE | `/expenses/:id`         | Delete an expense           |
| GET    | `/settlements`          | Get settlement summary      |
| GET    | `/settlements/balances` | Get net balances per person |
| GET    | `/settlements/people`   | List all involved people    |

---

## 🔄 Settlement Calculation Logic

1. **Input**: Each expense includes:

   - `amount`: total amount
   - `paid_by`: who paid
   - `splits[]`: array of participants and their shares

2. **Balance Map**:

   - Each person’s net balance is calculated:
     - Credit: `paid_by` increases
     - Debt: Each `split.name` decreases

3. **Settlement**:
   - Create two lists: `creditors` (positive balance) and `debtors` (negative)
   - Match debtor to creditor:
     - Transfer: `min(-debtor, creditor)`
     - Continue until all balances ≈ 0

---

## ⚠️ Known Limitations

- Greedy algorithm used; not optimized for fewest transactions
- No user authentication or group feature
- Assumes valid data format
- Names used as unique identifiers
- No currency conversion or tracking

---

## 📁 Folder Structure

```
split-app-backend/
├── routes/
│   ├── expenses.js
│   └── settlements.js
├── models/
│   └── Expense.js
├── .env
├── server.js
├── package.json
└── README.md
```

---

## 🧪 Postman Collection

- Import the provided `Split App Backend.postman_collection.json` into Postman
- Includes:
  - Health Check
  - Add / Get / Update / Delete Expenses
  - Get Settlements / Balances / People
  - Uses `{{base_url}}` and stores `{{expense_id}}` dynamically

---
