function notFound(req, res, next) {
  const error = new Error(`Маршрут ${req.method} ${req.originalUrl} не найден`);
  error.status = 404;
  next(error);
}

function errorHandler(err, req, res, next) {
  const status = Number(err.status) || 500;
  const payload = {
    error: err.message || 'Внутренняя ошибка сервера',
  };

  if (process.env.NODE_ENV !== 'production' && status === 500) {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
}

module.exports = {
  notFound,
  errorHandler,
};
