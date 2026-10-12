export function notFound(req, _res, next) {
  if (!req.path.startsWith('/api')) return next();
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;
  if (statusCode >= 500) console.error('[SkillFinder Error]', error);
  const message = error.expose || process.env.NODE_ENV !== 'production' ? error.message : (statusCode >= 500 ? 'Internal server error' : error.message);
  res.status(statusCode).json({ error: { message, statusCode, ...(error.fields ? { fields: error.fields } : {}) } });
}
