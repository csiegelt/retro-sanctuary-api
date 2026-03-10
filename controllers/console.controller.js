import { Console } from '../models/Console.js';
import { Game } from '../models/Game.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getAllConsoles = catchAsync(async (req, res) => {
  const consoles = await Console.find();
  
  res.status(200).json({
    status: 'success',
    results: consoles.length,
    data: { consoles }
  });
});

export const getConsole = catchAsync(async (req, res, next) => {
  const console = await Console.findById(req.params.id);
  
  if (!console) {
    throw new AppError('Consola no encontrada', 404);
  }
  
  res.status(200).json({
    status: 'success',
    data: { console }
  });
});

export const createConsole = catchAsync(async (req, res) => {
  const newConsole = await Console.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: { console: newConsole }
  });
});

export const updateConsole = catchAsync(async (req, res, next) => {
  const console = await Console.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!console) {
    throw new AppError('Consola no encontrada', 404);
  }
  
  res.status(200).json({
    status: 'success',
    data: { console }
  });
});

export const deleteConsole = catchAsync(async (req, res, next) => {
  const console = await Console.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true },
    { new: true }
  );
  
  if (!console) {
    throw new AppError('Consola no encontrada', 404);
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

export const getConsolesWithGames = catchAsync(async (req, res) => {
  const consoles = await Console.find();
  
  const consolesWithGames = await Promise.all(
    consoles.map(async (console) => {
      const games = await Game.find({ console: console._id })
        .select('titulo genero precioEstimado fechaLanzamiento')
        .populate('user', 'nombre email');
      
      return {
        _id: console._id,
        nombre: console.nombre,
        fabricante: console.fabricante,
        añoLanzamiento: console.añoLanzamiento,
        cantidadJuegos: games.length,
        games: games
      };
    })
  );
  
  res.status(200).json({
    status: 'success',
    results: consolesWithGames.length,
    data: { consoles: consolesWithGames }
  });
});

