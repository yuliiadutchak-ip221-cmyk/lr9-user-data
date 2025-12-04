const express = require('express');
const { validateUserData } = require('./validators');
const { logEvent } = require('./logger');
const { buildStats } = require('./stats');

const router = express.Router();

router.post('/submit', (req, res) => {
  const validation = validateUserData(req.body);

  if (!validation.valid) {
    logEvent({
      action: 'form_validation_failed',
      user: req.body?.email || 'anonymous',
      meta: { errors: validation.errors },
    });
    return res.status(400).json({ message: 'Дані містять помилки', errors: validation.errors });
  }

  req.session.user = validation.data;
  logEvent({
    action: 'form_submit',
    user: validation.data.email,
    meta: { name: validation.data.name, age: validation.data.age },
  });

  return res.json({
    message: 'Дані успішно збережені у сесії',
    user: validation.data,
  });
});

router.post('/log', (req, res) => {
  const { action, user, meta = {} } = req.body || {};
  if (!action) {
    return res.status(400).json({ message: 'Поле action є обовʼязковим' });
  }

  logEvent({
    action,
    user: user || req.session?.user?.email || 'anonymous',
    meta,
    userAgent: req.get('user-agent'),
    ip: req.ip,
  });

  return res.json({ message: 'Подію зафіксовано' });
});

router.get('/stats', (req, res) => {
  const stats = buildStats();
  res.json(stats);
});

router.get('/user', (req, res) => {
  res.json(req.session.user || {});
});

module.exports = router;
