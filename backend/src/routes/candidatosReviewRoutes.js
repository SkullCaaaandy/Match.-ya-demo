const express = require('express');
const router = express.Router();

const controlador = require('../controllers/candidato');
const { obtenerPerfilCandidato, obtenerPerfilPorPostulacion, actualizarBusquedaActiva } = require('../controllers/candidatos');

// Ruta original
router.get('/vacante/:idVacante', controlador.obtenerPorVacante);

// NUEVAS RUTAS: Pantalla de Inicio del Candidato
router.get('/perfil/:candidato_id', obtenerPerfilCandidato);
router.patch('/busqueda-activa/:candidato_id', actualizarBusquedaActiva);
router.get('/perfil-postulacion/:id_postulacion', obtenerPerfilPorPostulacion);

module.exports = router;