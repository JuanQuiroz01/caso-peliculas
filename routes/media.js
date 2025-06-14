const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const { Types } = require('mongoose');
const Media = require('../models/Media');
const { verificarToken, soloAdmin } = require('../middleware/auth');
const router = Router();

// Validar que el ID sea un ObjectId válido
const validarId = (id) => {
  return Types.ObjectId.isValid(id);
};

// Obtener todas las películas/series con datos poblados
router.get('/', verificarToken,  async (req, res) => {
  try {
    const media = await Media.find()
      .populate('generoPrincipal', 'nombre')
      .populate('directorPrincipal', 'nombres')
      .populate('productora', 'nombre')
      .populate('tipo', 'nombre');
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener una película/serie por ID
router.get('/:id',verificarToken, async (req, res) => {
  if (!validarId(req.params.id)) {
    return res.status(400).json({ message: 'ID no válido' });
  }

  try {
    const media = await Media.findById(req.params.id)
      .populate('generoPrincipal', 'nombre')
      .populate('directorPrincipal', 'nombres')
      .populate('productora', 'nombre')
      .populate('tipo', 'nombre');

    if (!media) {
      return res.status(404).json({ message: 'Película/Serie no encontrada' });
    }
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crear una nueva película/serie
router.post('/', [
  check('titulo', 'El título es obligatorio').not().isEmpty(),
  check('sinopsis', 'La sinopsis es obligatoria').not().isEmpty(),
  check('url', 'La URL es obligatoria').not().isEmpty(),
  check('imagenPortada', 'La imagen de portada es obligatoria').not().isEmpty(),
  check('añoEstreno', 'El año de estreno es obligatorio').isInt({ min: 1900, max: new Date().getFullYear() }),
  check('generoPrincipal', 'El género principal es obligatorio').isMongoId(),
  check('directorPrincipal', 'El director principal es obligatorio').isMongoId(),
  check('productora', 'La productora es obligatoria').isMongoId(),
  check('tipo', 'El tipo es obligatorio').isMongoId(),
], verificarToken, soloAdmin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Verificar si el serial ya existe
    const existingMedia = await Media.findOne({ serial: req.body.serial });
    if (existingMedia) {
      return res.status(400).json({ message: 'El serial ya está en uso' });
    }

    const media = new Media(req.body);
    await media.save();
    res.status(201).json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar una película/serie por ID
router.put('/:id', [
  check('titulo', 'El título es obligatorio').optional().not().isEmpty(),
  check('sinopsis', 'La sinopsis es obligatoria').optional().not().isEmpty(),
  check('url', 'La URL es obligatoria').optional().not().isEmpty(),
  check('imagenPortada', 'La imagen de portada es obligatoria').optional().not().isEmpty(),
  check('añoEstreno', 'El año de estreno es obligatorio').optional().isInt({ min: 1900, max: new Date().getFullYear() }),
  check('generoPrincipal', 'El género principal es obligatorio').optional().isMongoId(),
  check('directorPrincipal', 'El director principal es obligatorio').optional().isMongoId(),
  check('productora', 'La productora es obligatoria').optional().isMongoId(),
  check('tipo', 'El tipo es obligatorio').optional().isMongoId(),
],verificarToken, soloAdmin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const datosActualizados = {
      ...req.body,
      fechaActualizacion: Date.now()
    };

    const media = await Media.findByIdAndUpdate(
      req.params.id,
      datosActualizados,
      { new: true, runValidators: true }
    );

    if (!media) {
      return res.status(404).json({ message: 'Película/Serie no encontrada' });
    }
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar una película/serie por ID
router.delete('/:id', verificarToken, soloAdmin,async (req, res) => {
  if (!validarId(req.params.id)) {
    return res.status(400).json({ message: 'ID no válido' });
  }

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