import { User } from '../models/Users.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

// GET /api/users - Listar todos los usuarios (solo admin)
export const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find().select('-password');
  
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users }
  });
});

// GET /api/users/:id - Obtener un usuario (admin o el propio usuario)
export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }
  
  // Solo admin o el propio usuario pueden ver los detalles
  if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
    throw new AppError('No tienes permisos para ver este usuario', 403);
  }
  
  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

// PUT /api/users/:id - Actualizar un usuario (admin o el propio usuario)
export const updateUser = catchAsync(async (req, res, next) => {
  const { nombre, email } = req.body;
  
  // Buscar usuario
  const user = await User.findById(req.params.id);
  
  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }
  
  // Solo admin o el propio usuario pueden actualizar
  if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
    throw new AppError('No tienes permisos para actualizar este usuario', 403);
  }
  
  // Actualizar campos permitidos
  if (nombre) user.nombre = nombre;
  if (email) user.email = email;
  
  await user.save();
  
  // No devolver password
  user.password = undefined;
  
  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

// PATCH /api/users/:id/role - Cambiar rol de usuario (solo admin)
export const updateUserRole = catchAsync(async (req, res, next) => {
  const { role } = req.body;
  
  if (!role || !['user', 'admin'].includes(role)) {
    throw new AppError('Rol inválido. Debe ser "user" o "admin"', 400);
  }
  
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  ).select('-password');
  
  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }
  
  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

// PATCH /api/users/:id/password - Cambiar contraseña (el propio usuario)
export const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    throw new AppError('Proporciona la contraseña actual y la nueva', 400);
  }
  
  // Solo el propio usuario puede cambiar su contraseña
  if (req.user._id.toString() !== req.params.id) {
    throw new AppError('Solo puedes cambiar tu propia contraseña', 403);
  }
  
  // Obtener usuario con password
  const user = await User.findById(req.params.id).select('+password');
  
  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }
  
  // Verificar contraseña actual
  const isPasswordCorrect = await user.comparePassword(currentPassword);
  
  if (!isPasswordCorrect) {
    throw new AppError('Contraseña actual incorrecta', 401);
  }
  
  // Actualizar contraseña
  user.password = newPassword;
  await user.save();
  
  user.password = undefined;
  
  res.status(200).json({
    status: 'success',
    message: 'Contraseña actualizada correctamente',
    data: { user }
  });
});

// DELETE /api/users/:id - Eliminar usuario (solo admin)
export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  
  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});