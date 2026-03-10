import 'dotenv/config';
import express from 'express';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import consoleRoutes from './routes/console.routes.js';
import gameRoutes from './routes/game.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'Retro Sanctuary API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      consoles: '/api/consoles',
      games: '/api/games'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/consoles', consoleRoutes);
app.use('/api/games', gameRoutes);

app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `No se encuentra la ruta ${req.originalUrl}`
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`API lista`);
});