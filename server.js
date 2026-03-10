import 'dotenv/config';
import express from 'express';
import connectDB from './config/database.js';
import { router as productosRouter } from './routes/productos.router.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
connectDB();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Backend funcionando correctamente' });
});

app.use('/api/products', productosRouter);

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📦 API disponible en http://localhost:${PORT}/api/products`);
});