const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const { Types } = require('mongoose');
const Genero = require('../models/Genero');
const router = Router();
const { verificarToken, soloAdmin } = require('../middleware/auth');



// Validar que el ID sea un ObjectId válido
const validarId = (id) => {
  return Types.ObjectId.isValid(id);
};

// Obtener todos los géneros
router.get('/', verificarToken, soloAdmin,async (req, res) => {
  try {
    const generos = await Genero.find();
    res.json(generos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crear un nuevo género
router.post('/', [
  check('nombre', 'El nombre es obligatorio y debe ser una cadena de texto').not().isEmpty().isString(),
  check('estado', 'El estado debe ser "Activo" o "Inactivo"').isIn(['Activo', 'Inactivo']),
  check('descripcion', 'La descripción debe ser una cadena de texto').optional().isString(),
], verificarToken, soloAdmin,async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const genero = new Genero(req.body);
    await genero.save();
    res.status(201).json(genero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un género por ID (usando idgenero)
router.put('/:idgenero', [
  check('nombre', 'El nombre es obligatorio y debe ser una cadena de texto').optional().isString(),
  check('estado', 'El estado debe ser "Activo" o "Inactivo"').optional().isIn(['Activo', 'Inactivo']),
  check('descripcion', 'La descripción debe ser una cadena de texto').optional().isString(),
], verificarToken, soloAdmin,async (req, res) => {
  // Validar los datos de entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Validar el ID
  if (!validarId(req.params.idgenero)) {
    return res.status(400).json({ message: 'ID no válido' });
  }

  try {
    const datosActualizados = {
      ...req.body,
      fechaActualizacion: Date.now() // Actualiza la fecha automáticamente
    };

    const genero = await Genero.findByIdAndUpdate(
      req.params.idgenero,
      datosActualizados,
      { new: true, runValidators: true }
    );

    if (!genero) {
      return res.status(404).json({ message: 'Género no encontrado' });
    }

    res.json(genero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar un género por ID (usando idgenero)
router.delete('/:idgenero', verificarToken, soloAdmin,async (req, res) => {
  // Validar el ID
  if (!validarId(req.params.idgenero)) {
    return res.status(400).json({ message: 'ID no válido' });
  }

  try {
    const genero = await Genero.findByIdAndDelete(req.params.idgenero);
    if (!genero) {
      return res.status(404).json({ message: 'Género no encontrado' });
    }
    res.json({ message: 'Género eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;