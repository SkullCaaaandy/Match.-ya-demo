const express = require('express');
const enrutador = express.Router();
const {
    obtenerFeedbackDePostulacion,
    obtenerTodoElFeedbackDelCandidato
} = require('../controllers/retroalimentaciones');

// GET /api/retroalimentaciones/candidato/:candidato_id
// Devuelve TODAS las retroalimentaciones del candidato (vista Retroalimentación)
enrutador.get('/candidato/:candidato_id', obtenerTodoElFeedbackDelCandidato);

// GET /api/retroalimentaciones/postulacion/:id_postulacion?candidato_id=xxx
// Devuelve el feedback de una postulación específica (para abrir el detalle)
enrutador.get('/postulacion/:id_postulacion', obtenerFeedbackDePostulacion);

module.exports = enrutador;
