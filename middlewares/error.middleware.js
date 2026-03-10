import { AppError } from '../utils/AppError.js';

const handleCastErrorDB = (err) => {
  const message = `ID no válido: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyPattern)[0];
  const message = `El ${field} ya está registrado. Por favor usa otro`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Datos inválidos: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => 
  new AppError('Token inválido. Por favor inicia sesión nuevamente', 401);

const handleJWTExpiredError = () => 
  new AppError('Tu sesión ha expirado. Por favor inicia sesión nuevamente', 401);

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  
  let error = { ...err };
  error.message = err.message;
  
  if (err.name === 'CastError') error = handleCastErrorDB(err);
  if (err.code === 11000) error = handleDuplicateFieldsDB(err);
  if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
  
  res.status(error.statusCode || 500).json({
    status: error.status || 'error',
    message: error.message || 'Error en el servidor'
  });
};

