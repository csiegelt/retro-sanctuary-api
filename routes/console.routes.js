import express from 'express';
import {
  getAllConsoles,
  getConsole,
  getConsolesWithGames,  // AGREGAR
  createConsole,
  updateConsole,
  deleteConsole
} from '../controllers/console.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/with-games', getConsolesWithGames);  // AGREGAR ESTA LÍNEA
router.get('/', getAllConsoles);
router.get('/:id', getConsole);

router.use(protect, restrictTo('admin'));

router.post('/', createConsole);
router.put('/:id', updateConsole);
router.delete('/:id', deleteConsole);

export default router;