import mongoose from "mongoose";

const consoleSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la consola es obligatorio'],
    unique: true,
    trim: true,
    minlength: [3, 'El nombre de la consola debe tener al menos 3 caracteres'],
    maxlength: [30, 'El nombre de la consola no puede exceder 30 caracteres']
  },
  fabricante: {
    type: String,
    required: [true, 'El fabricante es obligatorio'],
    trim: true
  },
  añoLanzamiento: {  
    type: Number,     
    required: [true, 'El año de lanzamiento es obligatorio'],
    min: [1970, 'El año debe ser mayor a 1970'],
    max: [new Date().getFullYear() + 1, 'El año no puede ser futuro']
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true, versionKey: false });

export const Console = mongoose.model('Console', consoleSchema);
