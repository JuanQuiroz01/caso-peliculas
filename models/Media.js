const { Schema, model } = require('mongoose');

const MediaSchema = Schema({
  serial: { type: String, required: true, unique: true },
  titulo: { type: String, required: true },
  sinopsis: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  imagenPortada: { type: String, required: true },
  fechaCreacion: { type: Date, default: Date.now },
  fechaActualizacion: { type: Date, default: Date.now },
  añoEstreno: { type: Number, required: true },
  generoPrincipal: { type: Schema.Types.ObjectId, ref: 'Genero', required: true },
  directorPrincipal: { type: Schema.Types.ObjectId, ref: 'Director', required: true },
  productora: { type: Schema.Types.ObjectId, ref: 'Productora', required: true },
  tipo: { type: Schema.Types.ObjectId, ref: 'Tipo', required: true }
});

module.exports = model('Media', MediaSchema);