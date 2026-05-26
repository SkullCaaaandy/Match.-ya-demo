//Código Preeliminar

const express = require('express');
const enrutador = express.Router();

const { 
  guardarFiltrosBusqueda,
  verificarFiltrosBusqueda,
  obtenerFiltrosBusqueda
} = require('../controllers/filtrosController');

// Ruta para guardar filtros de búsqueda (POST)
enrutador.post('/guardar', guardarFiltrosBusqueda);

// Ruta para verificar si ya tiene filtros configurados (GET)
enrutador.get('/existe/:id', verificarFiltrosBusqueda);

// Ruta para obtener los filtros configurados (GET)
enrutador.get('/obtener/:id', obtenerFiltrosBusqueda);

module.exports = enrutador;