import mongoose from 'mongoose';
import 'dotenv/config';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado exitosamente');
    
    // Sincronizar índices
    await mongoose.connection.db.collection('games').dropIndexes();
    await mongoose.model('Game').syncIndexes();
    console.log('Indices sincronizados');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;
