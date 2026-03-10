import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, "El título del juego es obligatorio"],
    trim: true,
    minlength: [3, "El título del juego debe tener al menos 3 caracteres"],
    maxlength: [100, "El título del juego no puede exceder 100 caracteres"],
  },
  genero: {
    type: String,
    required: [true, "El género es obligatorio"],
    trim: true,
    enum: {
      values: [
        "Acción",
        "Aventura",
        "RPG",
        "Deportes",
        "Puzzle",
        "Estrategia",
        "Plataformas",
        "Carreras",
        "Lucha",
        "Otro",
      ],
      message: "Género no válido",
    },
  },
  precioEstimado: {
    type: Number,
    required: [true, "El precio estimado es obligatorio"],
    min: [0, "El precio no puede ser negativo"],
  },
  console: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Console",
    required: [true, "La consola es obligatoria"],
  },
  descripcion: {
    type: String,
    required: [true, "La descripción del juego es obligatoria"],
    trim: true,
    minlength: [10, "La descripción del juego debe tener al menos 10 caracteres"],
    maxlength: [500, "La descripción del juego no puede exceder 500 caracteres"],
  },
  fechaLanzamiento: {
    type: Date,
    required: [true, "La fecha de lanzamiento es obligatoria"],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "El usuario es obligatorio"],
  },
}, { timestamps: true, versionKey: false });

// Evitar duplicados: mismo título en la misma consola
gameSchema.index({ titulo: 1, console: 1 }, { unique: true });

export const Game = mongoose.model("Game", gameSchema);
