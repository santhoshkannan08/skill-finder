import crypto from 'node:crypto';

export function requireAuth(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: { message: 'Authentication required', statusCode: 401 } });
  req.user = req.session.user;
  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ error: { message: 'Insufficient permissions', statusCode: 403 } });
    next();
  };
}

export function issueCsrfToken(req, res) {
  if (!req.session.csrfToken) req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  res.json({ csrfToken: req.session.csrfToken });
}

export function csrfProtection(req, res, next) {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return next();
  if (!req.session.csrfToken || req.get('x-csrf-token') !== req.session.csrfToken) return res.status(403).json({ error: { message: 'Invalid CSRF token', statusCode: 403 } });
  next();
}
