db = db.getSiblingDB("expenseiq");

db.createCollection("users");
db.createCollection("expenses");
db.createCollection("budgets");
db.createCollection("alerts");

db.users.createIndex({ email: 1 }, { unique: true });
db.expenses.createIndex({ user_id: 1, spent_on: -1 });
db.budgets.createIndex({ user_id: 1, month: 1, category: 1 }, { unique: true });
db.alerts.createIndex({ user_id: 1, created_at: -1 });
