import { Game } from '../models/Game.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getAllGames = catchAsync(async (req, res) => {
  const games = await Game.find({ isDeleted: false })
    .populate('console', 'nombre fabricante añoLanzamiento')
    .populate('user', 'nombre email');
  
  res.status(200).json({
    status: 'success',
    results: games.length,
    data: { games }
  });
});

export const getGame = catchAsync(async (req, res, next) => {
  const game = await Game.findOne({ _id: req.params.id, isDeleted: false })
    .populate('console', 'nombre fabricante añoLanzamiento')
    .populate('user', 'nombre email');
  
  if (!game) {
    throw new AppError('Videojuego no encontrado', 404);
  }
  
  res.status(200).json({
    status: 'success',
    data: { game }
  });
});

export const createGame = catchAsync(async (req, res) => {
  const newGame = await Game.create({
    ...req.body,
    user: req.user._id
  });
  
  await newGame.populate('console', 'nombre fabricante');
  await newGame.populate('user', 'nombre email');
  
  res.status(201).json({
    status: 'success',
    data: { game: newGame }
  });
});

export const updateGame = catchAsync(async (req, res, next) => {
  const game = await Game.findById(req.params.id);
  
  if (!game) {
    throw new AppError('Videojuego no encontrado', 404);
  }
  
  if (game.user.toString() !== req.user._id.toString()) {
    throw new AppError('Solo puedes editar tus propios videojuegos', 403);
  }
  
  Object.assign(game, req.body);
  await game.save();
  
  await game.populate('console', 'nombre fabricante');
  await game.populate('user', 'nombre email');
  
  res.status(200).json({
    status: 'success',
    data: { game }
  });
});

export const deleteGame = catchAsync(async (req, res, next) => {
  const game = await Game.findById(req.params.id);
  
  if (!game) {
    throw new AppError('Videojuego no encontrado', 404);
  }
  
  if (game.user.toString() !== req.user._id.toString()) {
    throw new AppError('Solo puedes eliminar tus propios videojuegos', 403);
  }
  
  game.isDeleted = true;
  await game.save();
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});