const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const Productora = require('../models/Productora');

const router = Router();

// Obtener todas las productoras
router.get('/', async (req, res) => {
  try {
    const productoras = await Productora.find();
    res.json(productoras);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crear una nueva productora
router.post('/', [
  check('nombre', 'El nombre es obligatorio y debe ser una cadena de texto').not().isEmpty().isString(),
  check('estado', 'El estado debe ser "Activo" o "Inactivo"').isIn(['Activo', 'Inactivo']),
  check('slogan', 'El slogan debe ser una cadena de texto').optional().isString(),
  check('descripcion', 'La descripción debe ser una cadena de texto').optional().isString(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const productora = new Productora(req.body);
    await productora.save();
    res.status(201).json(productora);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar una productora por ID
router.put('/:id', [
  check('nombre', 'El nombre es obligatorio y debe ser una cadena de texto').optional().isString(),
  check('estado', 'El estado debe ser "Activo" o "Inactivo"').optional().isIn(['Activo', 'Inactivo']),
  check('slogan', 'El slogan debe ser una cadena de texto').optional().isString(),
  check('descripcion', 'La descripción debe ser una cadena de texto').optional().isString(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const productora = await Productora.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!productora) {
      return res.status(404).json({ message: 'Productora no encontrada' });
    }
    res.json(productora);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar una productora por ID
router.delete('/:id', async (req, res) => {
  try {
    const productora = await Productora.findByIdAndDelete(req.params.id);
    if (!productora) {
      return res.status(404).json({ message: 'Productora no encontrada' });
    }
    res.json({ message: 'Productora eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;