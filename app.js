const jwt = require('jsonwebtoken');
const SECRET = "mysecretkey";

const express = require('express');
const app = express();


app.use(express.json());

const users = [];

app.get('/', (req, res) => {
  res.send('Auth server running');
});

// 👇 SIGNUP HERE
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const hashedPassword = await require('bcrypt').hash(password, 10);

  users.push({
    email,
    password: hashedPassword
  });

  res.json({ message: 'User created successfully' });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  // Compare password
  const isMatch = await require('bcrypt').compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  // Generate token
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

app.listen(3000, () => {
  console.log('Server running on port 3000');
});