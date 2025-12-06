require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');

const { sequelize, Request, Payment } = require('./models');

const clientRoutes = require('./routes/clients');
const projectRoutes = require('./routes/projects');
const requestRoutes = require('./routes/requests');
const paymentRoutes = require('./routes/payments');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

const { requireAuth } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Sessions
app.use(session({
  secret: process.env.SESSION_SECRET || 'clientflow-secret',
  resave: false,
  saveUninitialized: false
}));

// Expose user to views
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

// Simple home page (requires login)
app.get('/', requireAuth, async (req, res, next) => {
  try {
    const { Client, Project } = require('./models');
    const now = new Date();
    const soon = new Date();
    soon.setDate(soon.getDate() + 7);

    const [
      clientCount,
      projectCount,
      openRequests,
      pendingPayments,
      overduePayments,
      upcomingRequests
    ] = await Promise.all([
      Client.count(),
      Project.count(),
      Request.count({ where: { status: 'open' } }),
      Payment.count({ where: { status: 'pending' } }),
      Payment.count({
        where: {
          status: 'pending',
          dueDate: { [require('sequelize').Op.lt]: now }
        }
      }),
      Request.count({
        where: {
          status: 'open',
          dueDate: { [require('sequelize').Op.between]: [now, soon] }
        }
      })
    ]);

    res.render('dashboard', {
      title: 'ClientFlow Dashboard',
      stats: {
        clientCount,
        projectCount,
        openRequests,
        pendingPayments,
        overduePayments,
        upcomingRequests
      }
    });
  } catch (err) {
    next(err);
  }
});

// Auth routes
app.use('/auth', authRoutes);

// Resource routes (protected)
app.use('/clients', requireAuth, clientRoutes);
app.use('/projects', requireAuth, projectRoutes);
app.use('/requests', requireAuth, requestRoutes);
app.use('/payments', requireAuth, paymentRoutes);

// JSON API
app.use('/api', requireAuth, apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Not Found' });
});

// Start server after DB connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established.');
    app.listen(PORT, () => {
      console.log(`ClientFlow listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  });