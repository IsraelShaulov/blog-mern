const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'something went wrong, try again later';
  res
    .status(statusCode)
    .json({ success: false, message: message, statusCode: statusCode });
};

export default errorHandlerMiddleware;
