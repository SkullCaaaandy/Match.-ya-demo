const express = require('express');
const { actualizarReclutador, obtenerReclutador } = require('../controllers/reclutadores');

const enrutadorReclutadores = express.Router();

// Obtener perfil de un reclutador
enrutadorReclutadores.get('/:id', obtenerReclutador);

// Actualizar perfil de un reclutador (datos de empresa)
enrutadorReclutadores.put('/:id', actualizarReclutador);

module.exports = enrutadorReclutadores;
