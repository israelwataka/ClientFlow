function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
}

function requireRole(roles) {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    if (!req.session || !req.session.user || !allowed.includes(req.session.user.role)) {
      return res.status(403).render('404', { title: 'Forbidden' });
    }
    next();
  };
}

module.exports = {
  requireAuth,
  requireRole
};