const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Allow requests from your React dev server
app.use(cors({
    origin: "http://127.0.0.1:3000", // or "http://localhost:3000"
    credentials: true
}));

app.use(express.json());

// Example route
app.get("/api/auth/me", (req, res) => {
    res.json({ user: "test-user" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
