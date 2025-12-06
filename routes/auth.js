const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

const { User, Client } = require('../models');

// Render login form
router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('auth/login', { title: 'Login', error: null });
});

// Handle login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email },
      include: [{ model: Client, as: 'clientProfile' }]
    });
    if (!user) {
      return res.status(401).render('auth/login', { title: 'Login', error: 'Invalid credentials' });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).render('auth/login', { title: 'Login', error: 'Invalid credentials' });
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      clientId: user.clientId || null
    };

    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

// Handle logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

module.exports = router;