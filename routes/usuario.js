// routes/usuario.js
const { Router } = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const router = Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config(); // Para acceder a JWT_SECRET
// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Validar que no exista el usuario
    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: hashedPassword,
      rol: rol || 'visitante'
    });

    await nuevoUsuario.save();
    res.status(201).json({ mensaje: 'Usuario creado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});


// Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por correo
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Usuario no encontrado' });
    }

    // Verificar contraseña
    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) {
      return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Crear token
    const token = jwt.sign(
      {
        uid: usuario._id,
        rol: usuario.rol,
        nombre: usuario.nombre,
        email: usuario.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ mensaje: 'Login exitoso', token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
});

module.exports = router;

