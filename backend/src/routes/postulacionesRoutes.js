const express = require('express');
const enrutador = express.Router();
const { obtenerMisPostulaciones, obtenerPostulacionesRecientes } = require('../controllers/postulaciones');

// GET /api/postulaciones/mis-postulaciones/:candidato_id  (todas, para la vista de Estatus)
enrutador.get('/mis-postulaciones/:candidato_id', obtenerMisPostulaciones);

// GET /api/postulaciones/recientes/:candidato_id  (últimas 3, para el panel de Inicio)
enrutador.get('/recientes/:candidato_id', obtenerPostulacionesRecientes);

module.exports = enrutador;