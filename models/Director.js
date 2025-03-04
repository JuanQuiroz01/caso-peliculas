const { Schema, model } = require('mongoose');

const DirectorSchema = Schema({
  nombres: { type: String, required: true },
  estado: { type: String, enum: ['Activo', 'Inactivo'], default: 'Activo' },
  fechaCreacion: { type: Date, default: Date.now },
  fechaActualizacion: { type: Date, default: Date.now }
});

module.exports = model('Director', DirectorSchema);