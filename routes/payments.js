const express = require('express');
const router = express.Router();

const { Payment, Client } = require('../models');

// List payments
router.get('/', async (req, res, next) => {
  try {
    const payments = await Payment.findAll({
      include: [{ model: Client, as: 'client' }],
      order: [['dueDate', 'ASC']]
    });
    res.render('payments/index', { title: 'Payments', payments });
  } catch (err) {
    next(err);
  }
});

// New payment form
router.get('/new', async (req, res, next) => {
  try {
    const clients = await Client.findAll({ order: [['name', 'ASC']] });
    res.render('payments/new', { title: 'New Payment', clients });
  } catch (err) {
    next(err);
  }
});

// Create payment
router.post('/', async (req, res, next) => {
  try {
    const { clientId, amount, currency, status, dueDate, reference } = req.body;
    await Payment.create({
      clientId,
      amount,
      currency: currency || 'USD',
      status: status || 'pending',
      dueDate: dueDate || null,
      reference: reference || null
    });
    res.redirect('/payments');
  } catch (err) {
    next(err);
  }
});

// Mark as paid
router.post('/:id/mark-paid', async (req, res, next) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) {
      return res.status(404).render('404', { title: 'Payment Not Found' });
    }
    await payment.update({ status: 'paid', paidAt: new Date() });
    res.redirect('/payments');
  } catch (err) {
    next(err);
  }
});

module.exports = router;