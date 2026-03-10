import express from 'express';
import {
  getAllGames,
  getGame,
  createGame,
  updateGame,
  deleteGame
} from '../controllers/game.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', getAllGames);
router.get('/:id', getGame);

router.use(protect);

router.post('/', createGame);
router.put('/:id', updateGame);
router.delete('/:id', deleteGame);

export default router;