const express = require('express');
const router = express.Router();

const { Request, Client, Project, User } = require('../models');

// List requests
router.get('/', async (req, res, next) => {
  try {
    const requests = await Request.findAll({
      include: [
        { model: Client, as: 'client' },
        { model: Project, as: 'project' },
        { model: User, as: 'responsible' }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.render('requests/index', { title: 'Requests', requests });
  } catch (err) {
    next(err);
  }
});

// New request form
router.get('/new', async (req, res, next) => {
  try {
    const clients = await Client.findAll({ order: [['name', 'ASC']] });
    const projects = await Project.findAll({ order: [['name', 'ASC']] });
    res.render('requests/new', { title: 'New Request', clients, projects });
  } catch (err) {
    next(err);
  }
});

// Create request
router.post('/', async (req, res, next) => {
  try {
    const {
      title,
      description,
      status,
      clientId,
      projectId,
      responsibleUserId,
      dueDate
    } = req.body;

    await Request.create({
      title,
      description,
      status: status || 'open',
      clientId,
      projectId: projectId || null,
      responsibleUserId: responsibleUserId || null,
      dueDate: dueDate || null
    });

    res.redirect('/requests');
  } catch (err) {
    next(err);
  }
});

// Update status (approve / reject / close)
router.post('/:id/status', async (req, res, next) => {
  try {
    const request = await Request.findByPk(req.params.id);
    if (!request) {
      return res.status(404).render('404', { title: 'Request Not Found' });
    }
    await request.update({ status: req.body.status });
    res.redirect('/requests');
  } catch (err) {
    next(err);
  }
});

module.exports = router;