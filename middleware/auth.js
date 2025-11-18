// middleware/auth.js
const verificarToken = (req, res, next) => {
  next(); // deja pasar todo
};

const soloAdmin = (req, res, next) => {
  next(); // todo pasa como admin
};

const soloVisitante = (req, res, next) => {
  next(); // todo pasa como visitante
};

module.exports = { verificarToken, soloAdmin, soloVisitante };


