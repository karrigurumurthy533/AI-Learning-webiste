const errorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Server Error";

  // 🔹 Mongoose bad ObjectId
  if (err.name === "CastError") {
    message = "Resource Not Found";
    statusCode = 404;
  }

  // 🔹 Mongoose Duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
    statusCode = 400;
  }

  // 🔹 Mongoose validation errors
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map(val => val.message);
    message = errors.join(", ");
    statusCode = 400;
  }

  // 🔹 Multer file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    message = "File size is too large";
    statusCode = 400;
  }

  // 🔹 JWT errors
  if (err.name === "JsonWebTokenError") {
    message = "Invalid token";
    statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    message = "Token expired";
    statusCode = 401;
  }

  // 🔹 Send response
  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;