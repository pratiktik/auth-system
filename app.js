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

app.listen(3000, () => {
  console.log('Server running on port 3000');
});