const express = require('express');
const router = express.Router();

const { Request, Client, Project, User, RequestComment, RequestHistory, RequestAttachment } = require('../models');

// List requests
router.get('/', async (req, res, next) => {
  try {
    const where = {};
    if (req.session.user && req.session.user.role === 'client' && req.session.user.clientId) {
      where.clientId = req.session.user.clientId;
    }

    const requests = await Request.findAll({
      where,
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
      dueDate,
      priority
    } = req.body;

    await Request.create({
      title,
      description,
      status: status || 'open',
      clientId: clientId || (req.session.user && req.session.user.clientId) || null,
      projectId: projectId || null,
      responsibleUserId: responsibleUserId || null,
      dueDate: dueDate || null,
      priority: priority || 'medium'
    });

    res.redirect('/requests');
  } catch (err) {
    next(err);
  }
});

// Request detail with comments, history, attachments
router.get('/:id', async (req, res, next) => {
  try {
    const request = await Request.findByPk(req.params.id, {
      include: [
        { model: Client, as: 'client' },
        { model: Project, as: 'project' },
        {
          model: RequestComment,
          as: 'comments',
          include: [{ model: User, as: 'author' }],
          order: [['createdAt', 'ASC']]
        },
        {
          model: RequestHistory,
          as: 'history',
          include: [{ model: User, as: 'changedBy' }],
          order: [['createdAt', 'ASC']]
        },
        {
          model: RequestAttachment,
          as: 'attachments'
        }
      ]
    });

    if (!request) {
      return res.status(404).render('404', { title: 'Request Not Found' });
    }

    if (req.session.user && req.session.user.role === 'client' && req.session.user.clientId && request.clientId !== req.session.user.clientId) {
      return res.status(403).render('404', { title: 'Forbidden' });
    }

    res.render('requests/show', { title: `Request: ${request.title}`, request });
  } catch (err) {
    next(err);
  }
});

// Add comment
router.post('/:id/comments', async (req, res, next) => {
  try {
    const request = await Request.findByPk(req.params.id);
    if (!request) {
      return res.status(404).render('404', { title: 'Request Not Found' });
    }

    await RequestComment.create({
      requestId: request.id,
      body: req.body.body,
      authorUserId: req.session.user ? req.session.user.id : null
    });

    res.redirect(`/requests/${request.id}`);
  } catch (err) {
    next(err);
  }
});

// Update status (approve / reject / close) with history note
router.post('/:id/status', async (req, res, next) => {
  try {
    const request = await Request.findByPk(req.params.id);
    if (!request) {
      return res.status(404).render('404', { title: 'Request Not Found' });
    }

    const oldStatus = request.status;
    const newStatus = req.body.status;
    const note = req.body.note || null;

    await request.update({ status: newStatus });

    await RequestHistory.create({
      requestId: request.id,
      oldStatus,
      newStatus,
      note,
      changedByUserId: req.session.user ? req.session.user.id : null
    });

    res.redirect(`/requests/${request.id}`);
  } catch (err) {
    next(err);
  }
});

// Add attachment (metadata only)
router.post('/:id/attachments', async (req, res, next) => {
  try {
    const request = await Request.findByPk(req.params.id);
    if (!request) {
      return res.status(404).render('404', { title: 'Request Not Found' });
    }

    const { filename, url } = req.body;
    if (filename && url) {
      await RequestAttachment.create({
        requestId: request.id,
        filename,
        url
      });
    }

    res.redirect(`/requests/${request.id}`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;