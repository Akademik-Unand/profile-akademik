function success(res, { message, data = null, statusCode = 200 }) {
  return res.status(statusCode).json({
    success: true,
    message,
    statusCode,
    data,
  });
}

function error(res, { message, statusCode = 500, errors }) {
  const body = {
    success: false,
    message,
    statusCode,
  };
  if (errors) {
    body.errors = errors;
  }
  return res.status(statusCode).json(body);
}

module.exports = { success, error };
