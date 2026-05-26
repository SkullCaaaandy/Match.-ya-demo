const express = require('express');
const enrutador = express.Router();
const { obtenerListasGuardadas } = require('../controllers/listas');

enrutador.get('/guardados/:reclutador_id', obtenerListasGuardadas);

module.exports = enrutador;