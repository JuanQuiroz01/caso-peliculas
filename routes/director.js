const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const Director = require('../models/Director');

const router = Router();

// Obtener todos los directores
router.get('/', async (req, res) => {
  try {
    const directores = await Director.find();
    res.json(directores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crear un nuevo director
router.post('/', [
  check('nombres', 'Los nombres son obligatorios y deben ser una cadena de texto').not().isEmpty().isString(),
  check('estado', 'El estado debe ser "Activo" o "Inactivo"').isIn(['Activo', 'Inactivo']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const director = new Director(req.body);
    await director.save();
    res.status(201).json(director);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un director por ID
router.put('/:id', [
  check('nombres', 'Los nombres son obligatorios y deben ser una cadena de texto').optional().isString(),
  check('estado', 'El estado debe ser "Activo" o "Inactivo"').optional().isIn(['Activo', 'Inactivo']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const director = await Director.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!director) {
      return res.status(404).json({ message: 'Director no encontrado' });
    }
    res.json(director);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar un director por ID
router.delete('/:id', async (req, res) => {
  try {
    const director = await Director.findByIdAndDelete(req.params.id);
    if (!director) {
      return res.status(404).json({ message: 'Director no encontrado' });
    }
    res.json({ message: 'Director eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;