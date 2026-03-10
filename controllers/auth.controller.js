import jwt from 'jsonwebtoken';
import { User } from '../models/Users.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

export const register = catchAsync(async (req, res) => {
  const { nombre, email, password, role } = req.body;
  
  const newUser = await User.create({
    nombre,
    email,
    password,
    //role: role === 'admin' ? 'user' : role
    role: role || 'user'
  });
  
  const token = signToken(newUser._id);
  newUser.password = undefined;
  
  res.status(201).json({
    status: 'success',
    token,
    data: { user: newUser }
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    throw new AppError('Por favor proporciona email y contraseña', 400);
  }
  
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Email o contraseña incorrectos', 401);
  }
  
  const token = signToken(user._id);
  user.password = undefined;
  
  res.status(200).json({
    status: 'success',
    token,
    data: { user }
  });
});