const express = require('express');
const enrutador = express.Router();
const { obtenerCalendarioReclutador, obtenerEntrevistasCandidato, agendarEntrevista } = require('../controllers/entrevistas');

// GET /api/entrevistas/calendario/:reclutador_id
enrutador.get('/calendario/:reclutador_id', obtenerCalendarioReclutador);

// GET /api/entrevistas/candidato/:candidato_id
enrutador.get('/candidato/:candidato_id', obtenerEntrevistasCandidato);

// POST /api/entrevistas/agendar (NUEVA RUTA)
enrutador.post('/agendar', agendarEntrevista);

module.exports = enrutador;