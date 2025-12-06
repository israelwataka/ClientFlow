require('dotenv').config();
const { sequelize } = require('../models');

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database schema synced.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
    process.exit(1);
  });