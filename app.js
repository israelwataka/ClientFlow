require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');

const { sequelize } = require('./models');

const clientRoutes = require('./routes/clients');
const projectRoutes = require('./routes/projects');
const requestRoutes = require('./routes/requests');
const paymentRoutes = require('./routes/payments');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Simple home page
app.get('/', async (req, res) => {
  const { Client, Project, Request, Payment } = require('./models');

  const [clientCount, projectCount, openRequests, pendingPayments] =
    await Promise.all([
      Client.count(),
      Project.count(),
      Request.count({ where: { status: 'open' } }),
      Payment.count({ where: { status: 'pending' } })
    ]);

  res.render('dashboard', {
    title: 'ClientFlow Dashboard',
    stats: { clientCount, projectCount, openRequests, pendingPayments }
  });
});

// Resource routes
app.use('/clients', clientRoutes);
app.use('/projects', projectRoutes);
app.use('/requests', requestRoutes);
app.use('/payments', paymentRoutes);

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