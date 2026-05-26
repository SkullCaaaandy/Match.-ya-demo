const express = require('express');
const enrutador = express.Router();

const {
    crearVacante,
    actualizarVacante,
    cambiarEstatusVacante,
    eliminarVacante,
    obtenerVacantes,
    obtenerVacantesRecientesReclutador,
    obtenerTodasMisVacantes,
    obtenerVacantesPersonalizadas //Algoritmo de Neyzer
} = require('../controllers/vacantes');

// POST   /api/vacantes/crear            publicar nueva vacante
enrutador.post('/crear', crearVacante);

// GET    /api/vacantes         todas las vacantes del sistema
enrutador.get('/', obtenerVacantes);

// GET /api/vacantes/personalizadas/:id_candidato
enrutador.get('/personalizadas/:id_candidato', obtenerVacantesPersonalizadas); //Algoritmo de Neyzer

// GET    /api/vacantes/recientes/:reclutador_id    5 más recientes del reclutador
enrutador.get('/recientes/:reclutador_id', obtenerVacantesRecientesReclutador);

// GET    /api/vacantes/reclutador/:reclutador_id   todas las del reclutador
enrutador.get('/reclutador/:reclutador_id', obtenerTodasMisVacantes);


// PATCH  /api/vacantes/:id_vacante/estatus    activar o desactivar
enrutador.patch('/:id_vacante/estatus', cambiarEstatusVacante);

// PATCH  /api/vacantes/:id_vacante       actualizar datos de la vacante
enrutador.patch('/:id_vacante', actualizarVacante);

// DELETE /api/vacantes/:id_vacante     eliminar permanentemente
enrutador.delete('/:id_vacante', eliminarVacante);

module.exports = enrutador;