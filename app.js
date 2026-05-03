const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// In-memory user storage
const users = [];

// Secret key for JWT
const SECRET = "mysecretkey";

// Home route
app.get('/', (req, res) => {
  res.send('Auth server running');
});

// Signup
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({
    email,
    password: hashedPassword
  });

  res.json({ message: 'User created successfully' });
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { email: user.email },
    SECRET,
    { expiresIn: '1h' }
  );

  res.json({
    message: 'Login successful',
    token: token
  });
});

// Middleware to verify token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const user = jwt.verify(token, SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}

// Protected route
app.get('/profile', authenticateToken, (req, res) => {
  res.json({
    message: 'Protected data',
    user: req.user
  });
});

// Start server
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});