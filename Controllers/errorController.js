const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateFieldDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
  const message = `Duplicate field value at ${value}. Use another value`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Input Data ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    messages: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  // operational, trusted error: send message to client
  if (isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      messages: err.message,
    });
  } else {
    // programming or other unknown error: don't leak error details
    // 1. log errors
    console.error('ERROR 💥', err);
    res.status(err.statusCode).json({
      status: 'error',
      messages: 'SOMETHING WENT WRONG',
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'internal error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldDB(error);
    if ((error.name = 'ValidationError'))
      error = handleValidationErrorDB(error);
    sendErrorProd(err, res);
  }
  res.status(err.statusCode).json({ status: err.status, message: err.message });
};
