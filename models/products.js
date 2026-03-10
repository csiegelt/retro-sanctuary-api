import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  reviewerName: {
    type: String,
    required: true
  },
  reviewerEmail: {
    type: String,
    required: true
  }
}, { _id: false });

const dimensionsSchema = new mongoose.Schema({
  width: {
    type: Number,
    required: true,
    min: 0
  },
  height: {
    type: Number,
    required: true,
    min: 0
  },
  depth: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const metaSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  barcode: String,
  qrCode: String
}, { _id: false });

const productSchema = new mongoose.Schema({
  // Campos principales
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    maxlength: [200, 'El título no puede exceder 200 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'La marca es obligatoria'],
    trim: true
  },
  
  // Precios y descuentos
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  discountPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Stock y disponibilidad
  stock: {
    type: Number,
    required: [true, 'El stock es obligatorio'],
    min: [0, 'El stock no puede ser negativo'],
    default: 0
  },
  availabilityStatus: {
    type: String,
    enum: ['In Stock', 'Low Stock', 'Out of Stock'],
    default: 'In Stock'
  },
  minimumOrderQuantity: {
    type: Number,
    default: 1,
    min: 1
  },
  
  // Información del producto
  sku: {
    type: String,
    required: [true, 'El SKU es obligatorio'],
    unique: true,
    trim: true
  },
  weight: {
    type: Number,
    required: [true, 'El peso es obligatorio'],
    min: 0
  },
  dimensions: {
    type: dimensionsSchema,
    required: [true, 'Las dimensiones son obligatorias']
  },
  
  // Volúmenes calculados (virtuales o calculados)
  volumenCm3: {
    type: Number
  },
  volumen: {
    type: String
  },
  
  // Calificación
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  
  // Imágenes
  thumbnail: {
    type: String,
    required: [true, 'La imagen principal es obligatoria']
  },
  images: {
    type: [String],
    default: []
  },
  
  // Información adicional
  tags: {
    type: [String],
    default: []
  },
  warrantyInformation: {
    type: String,
    default: 'Sin garantía'
  },
  shippingInformation: {
    type: String,
    default: 'Envío estándar'
  },
  returnPolicy: {
    type: String,
    default: '30 días de devolución'
  },
  
  // Reviews
  reviews: {
    type: [reviewSchema],
    default: []
  },
  
  // Metadata
  meta: {
    type: metaSchema,
    default: () => ({})
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual para calcular volumen en cm³
productSchema.virtual('calculatedVolumenCm3').get(function() {
  if (this.dimensions) {
    return (this.dimensions.width * this.dimensions.height * this.dimensions.depth).toFixed(2);
  }
  return 0;
});

// Virtual para calcular volumen en m³
productSchema.virtual('calculatedVolumen').get(function() {
  if (this.dimensions) {
    const volCm3 = this.dimensions.width * this.dimensions.height * this.dimensions.depth;
    return `${(volCm3 / 1000000).toFixed(4)} m³`;
  }
  return 'N/A';
});

// Virtual para calcular precio con descuento
productSchema.virtual('finalPrice').get(function() {
  if (this.discountPercentage > 0) {
    return (this.price - (this.price * this.discountPercentage / 100)).toFixed(2);
  }
  return this.price;
});

// Middleware para actualizar volúmenes antes de guardar
productSchema.pre('save', function(next) {
  if (this.dimensions) {
    const volCm3 = this.dimensions.width * this.dimensions.height * this.dimensions.depth;
    this.volumenCm3 = parseFloat(volCm3.toFixed(2));
    this.volumen = `${(volCm3 / 1000000).toFixed(4)} m³`;
  }
  
  // Actualizar availabilityStatus según stock
  if (this.stock === 0) {
    this.availabilityStatus = 'Out of Stock';
  } else if (this.stock < 10) {
    this.availabilityStatus = 'Low Stock';
  } else {
    this.availabilityStatus = 'In Stock';
  }
  
  next();
});

// Índices para mejorar búsquedas
productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ category: 1, brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

// Método para obtener datos formateados para el frontend
productSchema.methods.toFrontend = function() {
  return {
    id: this._id,
    titulo: this.title,
    descripcion: this.description,
    precio: this.price,
    categoria: this.category,
    marca: this.brand,
    stock: this.stock,
    imagen_src: this.thumbnail,
    images: this.images,
    volumen: this.volumen,
    volumenCm3: `${this.volumenCm3} cm³`,
    sku: this.sku,
    peso: this.weight,
    garantia: this.warrantyInformation,
    dimensiones: this.dimensions,
    descuento: this.discountPercentage,
    rating: this.rating,
    precioFinal: this.finalPrice,
    disponibilidad: this.availabilityStatus
  };
};

const Product = mongoose.model('Product', productSchema);

export default Product;