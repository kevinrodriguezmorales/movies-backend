const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db', 'base_datos.json');
let db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// Ruta para obtener recomendaciones
router.get('/recomendaciones/:idUsuario', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const idUsuario = parseInt(req.params.idUsuario);
  const usuario = db.usuarios.find(u => u.id === idUsuario);

  if (!usuario) return res.status(404).send('Usuario no encontrado.');

  // Películas vistas por el usuario
  const peliculasVistas = usuario.peliculas_vistas;

  // Buscar recomendaciones basadas en relaciones
  const recomendaciones = [];
  peliculasVistas.forEach(idPelicula => {
    const pelicula = db.peliculas.find(p => p.id === idPelicula);
    pelicula.relaciones.forEach(rel => {
      if (!peliculasVistas.includes(rel.id)) {
        const peliculaRelacionada = db.peliculas.find(p => p.id === rel.id);
        recomendaciones.push(peliculaRelacionada);
      }
    });
  });

  res.json(recomendaciones);
});

// Ruta para agregar una película al historial
router.post('/ver', (req, res) => {
  const { idUsuario, idPelicula } = req.body;

  const usuario = db.usuarios.find(u => u.id === idUsuario);
  if (!usuario) return res.status(404).send('Usuario no encontrado.');

  if (!usuario.peliculas_vistas.includes(idPelicula)) {
    usuario.peliculas_vistas.push(idPelicula);
    fs.writeFileSync('./db/base_datos.json', JSON.stringify(db, null, 2));
  }

  res.send('Película agregada al historial.');
});

module.exports = router;
