const express = require('express');
const { getConnection } = require('./db/connect-mongo'); // Importar la función de conexión
const cors = require('cors');
// Para variables de entorno
require('dotenv').config()


const app = express();
const port = process.env.PORT;
app.use(cors());


// Conexión a MongoDB
getConnection();

// Middleware para parsear JSON
app.use(express.json());

// Usar las rutas
app.use('/generos', require('./routes/genero')); // Ruta para Género
app.use('/directores', require('./routes/director')); // Ruta para Director
app.use('/productoras', require('./routes/productora')); // Ruta para Productora
app.use('/tipos', require('./routes/tipo')); // Ruta para Tipo
app.use('/media', require('./routes/media')); // Ruta para Media

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});