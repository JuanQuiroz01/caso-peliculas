// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Verifica si el token es válido
const verificarToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // Guarda los datos del token en req.usuario
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};

// Middleware para permitir solo administradores
const soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'administrador') {
    return res.status(403).json({ mensaje: 'Acceso denegado: solo administradores' });
  }
  next();
};

// Middleware para permitir solo visitantes
const soloVisitante = (req, res, next) => {
  if (req.usuario.rol !== 'visitante') {
    return res.status(403).json({ mensaje: 'Acceso denegado: solo visitantes' });
  }
  next();
};

module.exports = {
  verificarToken,
  soloAdmin,
  soloVisitante
};

