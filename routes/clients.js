const express = require('express');
const router = express.Router();

const { Client, Project, Request, Payment } = require('../models');

// List clients
router.get('/', async (req, res, next) => {
  try {
    const clients = await Client.findAll({ order: [['name', 'ASC']] });
    res.render('clients/index', { title: 'Clients', clients });
  } catch (err) {
    next(err);
  }
});

// New client form
router.get('/new', (req, res) => {
  res.render('clients/new', { title: 'New Client' });
});

// Create client
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, company, notes } = req.body;
    await Client.create({ name, email, phone, company, notes });
    res.redirect('/clients');
  } catch (err) {
    next(err);
  }
});

// Client detail
router.get('/:id', async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id, {
      include: [
        { model: Project, as: 'projects' },
        { model: Request, as: 'requests' },
        { model: Payment, as: 'payments' }
      ]
    });
    if (!client) {
      return res.status(404).render('404', { title: 'Client Not Found' });
    }
    res.render('clients/show', { title: `Client: ${client.name}`, client });
  } catch (err) {
    next(err);
  }
});

// Edit client form
router.get('/:id/edit', async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).render('404', { title: 'Client Not Found' });
    }
    res.render('clients/edit', { title: `Edit ${client.name}`, client });
  } catch (err) {
    next(err);
  }
});

// Update client
router.post('/:id', async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).render('404', { title: 'Client Not Found' });
    }
    const { name, email, phone, company, notes } = req.body;
    await client.update({ name, email, phone, company, notes });
    res.redirect(`/clients/${client.id}`);
  } catch (err) {
    next(err);
  }
});

// Simple delete
router.post('/:id/delete', async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (client) {
      await client.destroy();
    }
    res.redirect('/clients');
  } catch (err) {
    next(err);
  }
});

module.exports = router;