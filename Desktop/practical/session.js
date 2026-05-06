
const express = require('express');
const session = require('express-session');

const app = express();

// Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

// Dummy user
const USER = {
    username: 'admin',
    password: 1234
};

function authMiddleware(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send('Access denied. Please log in.');
    }
}

// Routes
// login - post
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === USER.username && password === USER.password) {
        req.session.user = username;
        res.send('Login Successful');
    } else {
        res.status(401).send('Invalid Credentials');
    }
});

// dashboard - get (to check user)
app.get('/dashboard', authMiddleware, (req, res) => {
    res.send(`Welcome ${req.session.user}, this is your dashboard.`);
});

// logout - get
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send('Error logging out.');
        res.send('Logged out successfully');
    });
});

// Start server
app.listen(3000, () => console.log('Server running on 3000'));
