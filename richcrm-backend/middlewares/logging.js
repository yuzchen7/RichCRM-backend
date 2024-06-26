
const crmLogger = function (req, res, next) {
    if (req.path === '/favicon.ico') {
      return res.status(204).end();
    }
    if (req.method !== 'GET' && req.path !== '/') {
      console.log(`[REQUEST][${req.method}] Path: ${req.path}, Origin: ${req.headers.origin}`);
    }
    next();
};

module.exports = crmLogger;