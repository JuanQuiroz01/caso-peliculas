const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const Media = require('../models/Media');

const router = Router();

// Obtener todas las películas/series
router.get('/', async (req, res) => {
  try {
    const media = await Media.find()
      .populate('generoPrincipal', 'nombre estado -_id') // Solo 'nombre' y 'estado'
      .populate('directorPrincipal', 'nombres estado -_id') // Solo 'nombres' y 'estado'
      .populate('productora', 'nombre estado -_id') // Solo 'nombre' y 'estado','
      .populate('tipo', 'nombre -_id'); // Solo 'nombre'

    res.json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crear una nueva película/serie
router.post('/', [
  check('titulo', 'El título es obligatorio y debe ser una cadena de texto').not().isEmpty().isString(),
  check('sinopsis', 'La sinopsis es obligatoria y debe ser una cadena de texto').not().isEmpty().isString(),
  check('url', 'La URL es obligatoria y debe ser una cadena de texto').not().isEmpty().isString(),
  check('imagenPortada', 'La imagen de portada es obligatoria y debe ser una cadena de texto').not().isEmpty().isString(),
  check('añoEstreno', 'El año de estreno es obligatorio y debe ser un número').not().isEmpty().isNumeric(),
  check('generoPrincipal', 'El género principal es obligatorio').not().isEmpty(),
  check('directorPrincipal', 'El director principal es obligatorio').not().isEmpty(),
  check('productora', 'La productora es obligatoria').not().isEmpty(),
  check('tipo', 'El tipo es obligatorio').not().isEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const media = new Media(req.body);
    await media.save();
    res.status(201).json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar una película/serie por ID
router.put('/:id', [
  check('titulo', 'El título es obligatorio y debe ser una cadena de texto').optional().isString(),
  check('sinopsis', 'La sinopsis es obligatoria y debe ser una cadena de texto').optional().isString(),
  check('url', 'La URL es obligatoria y debe ser una cadena de texto').optional().isString(),
  check('imagenPortada', 'La imagen de portada es obligatoria y debe ser una cadena de texto').optional().isString(),
  check('añoEstreno', 'El año de estreno es obligatorio y debe ser un número').optional().isNumeric(),
  check('generoPrincipal', 'El género principal es obligatorio').optional().not().isEmpty(),
  check('directorPrincipal', 'El director principal es obligatorio').optional().not().isEmpty(),
  check('productora', 'La productora es obligatoria').optional().not().isEmpty(),
  check('tipo', 'El tipo es obligatorio').optional().not().isEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const media = await Media.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!media) {
      return res.status(404).json({ message: 'Película/Serie no encontrada' });
    }
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar una película/serie por ID
router.delete('/:id', async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    if (!media) {
      return res.status(404).json({ message: 'Película/Serie no encontrada' });
    }
    res.json({ message: 'Película/Serie eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;