const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const { Types } = require('mongoose');
const Tipo = require('../models/Tipo');

const router = Router();

// Validar que el ID sea un ObjectId válido
const validarId = (id) => {
  return Types.ObjectId.isValid(id);
};

// Obtener todos los tipos
router.get('/', async (req, res) => {
  try {
    const tipos = await Tipo.find();
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crear un nuevo tipo
router.post('/', [
  check('nombre', 'El nombre es obligatorio y debe ser una cadena de texto').not().isEmpty().isString(),
  check('descripcion', 'La descripción debe ser una cadena de texto').optional().isString(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const tipo = new Tipo(req.body);
    await tipo.save();
    res.status(201).json(tipo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un tipo por ID
router.put('/:idtipo', [
  check('nombre', 'El nombre es obligatorio y debe ser una cadena de texto').optional().isString(),
  check('descripcion', 'La descripción debe ser una cadena de texto').optional().isString(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const datosActualizados = {
      ...req.body,
      fechaActualizacion: Date.now() // Actualiza la fecha automáticamente
    };

    const tipo = await Tipo.findByIdAndUpdate(
      req.params.idtipo, // Corregido a idtipo
      datosActualizados,
      { new: true, runValidators: true }
    );

    if (!tipo) {
      return res.status(404).json({ message: 'Tipo no encontrado' });
    }
    res.json(tipo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar un tipo por ID
router.delete('/:idtipo', async (req, res) => {
  // Validar el ID
  if (!validarId(req.params.idtipo)) {
    return res.status(400).json({ message: 'ID no válido' });
  }

  try {
    const tipo = await Tipo.findByIdAndDelete(req.params.idtipo); // Corregido a idtipo
    if (!tipo) {
      return res.status(404).json({ message: 'Tipo no encontrado' });
    }
    res.json({ message: 'Tipo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;