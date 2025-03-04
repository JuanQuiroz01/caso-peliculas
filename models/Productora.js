const { Schema, model } = require('mongoose');

const ProductoraSchema = Schema({
  nombre: { type: String, required: true, unique: true },
  estado: { type: String, enum: ['Activo', 'Inactivo'], default: 'Activo' },
  fechaCreacion: { type: Date, default: Date.now },
  fechaActualizacion: { type: Date, default: Date.now },
  descripcion: { type: String }
});

module.exports = model('Productora', ProductoraSchema);