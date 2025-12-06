const express = require('express');
const router = express.Router();

const { Project, Client, User } = require('../models');

// List projects
router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.findAll({
      include: [
        { model: Client, as: 'client' },
        { model: User, as: 'responsible' }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.render('projects/index', { title: 'Projects', projects });
  } catch (err) {
    next(err);
  }
});

// New project form
router.get('/new', async (req, res, next) => {
  try {
    const clients = await Client.findAll({ order: [['name', 'ASC']] });
    res.render('projects/new', { title: 'New Project', clients });
  } catch (err) {
    next(err);
  }
});

// Create project
router.post('/', async (req, res, next) => {
  try {
    const { name, description, status, clientId, responsibleUserId, dueDate } = req.body;
    await Project.create({
      name,
      description,
      status: status || 'planned',
      clientId,
      responsibleUserId: responsibleUserId || null,
      dueDate: dueDate || null
    });
    res.redirect('/projects');
  } catch (err) {
    next(err);
  }
});

// Project detail
router.get('/:id', async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [{ model: Client, as: 'client' }, { model: User, as: 'responsible' }]
    });
    if (!project) {
      return res.status(404).render('404', { title: 'Project Not Found' });
    }
    res.render('projects/show', { title: `Project: ${project.name}`, project });
  } catch (err) {
    next(err);
  }
});

// Update status
router.post('/:id/status', async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).render('404', { title: 'Project Not Found' });
    }
    await project.update({ status: req.body.status });
    res.redirect(`/projects/${project.id}`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;