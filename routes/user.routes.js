import express from 'express';
import {
  getAllUsers,
  getUser,
  updateUser,
  updateUserRole,
  updatePassword,
  deleteUser
} from '../controllers/user.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas para todos los usuarios autenticados
router.get('/:id', getUser);                    // Ver su propio perfil o admin ve cualquiera
router.put('/:id', updateUser);                 // Actualizar su propio perfil o admin actualiza cualquiera
router.patch('/:id/password', updatePassword);  // Cambiar su propia contraseña

// Rutas solo para admin
router.get('/', restrictTo('admin'), getAllUsers);            // Listar todos los usuarios
router.patch('/:id/role', restrictTo('admin'), updateUserRole); // Cambiar rol
router.delete('/:id', restrictTo('admin'), deleteUser);       // Eliminar usuario

export default router;