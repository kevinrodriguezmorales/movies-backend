const express = require('express');
const bodyParser = require('body-parser');
const rutas = require('./modules/routes');

const app = express();

// CORS (manual) - permitir llamadas desde Angular en localhost:4200
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Si tu frontend manda cookies/credenciales, habría que ajustar con Allow-Credentials=true y manejo correspondiente
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Middleware
app.use(bodyParser.json());

// Usar las rutas definidas en routes.js
app.use('/api', rutas);

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
