const express = require('express');
const router = express.Router();

const { Client, Project, Request, Payment } = require('../models');

// Simple JSON helpers
router.get('/clients', async (req, res, next) => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (err) {
    next(err);
  }
});

router.get('/clients/:id', async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ error: 'Not found' });
    res.json(client);
  } catch (err) {
    next(err);
  }
});

router.get('/projects', async (req, res, next) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

router.get('/requests', async (req, res, next) => {
  try {
    const requests = await Request.findAll();
    res.json(requests);
  } catch (err) {
    next(err);
  }
});

router.get('/payments', async (req, res, next) => {
  try {
    const payments = await Payment.findAll();
    res.json(payments);
  } catch (err) {
    next(err);
  }
});

module.exports = router;