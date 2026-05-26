const express = require('express');
const router  = express.Router();

const {
    obtenerPerfilCandidato,
    buscarEtiquetas,
    actualizarPerfil,
    actualizarHabilidades,
    subirCV,
    actualizarPortafolio,
    actualizarBusquedaActiva
} = require('../controllers/candidatos');

// GET   /api/perfil/etiquetas/buscar?q=python  → sugerencias mientras escribe
router.get('/etiquetas/buscar', buscarEtiquetas);

// GET   /api/perfil/:candidato_id              → perfil completo + habilidades + portafolio
router.get('/:candidato_id', obtenerPerfilCandidato);

// PATCH /api/perfil/:candidato_id              → editar nombre, rol, ubicación, descripción
router.patch('/:candidato_id', actualizarPerfil);

// PATCH /api/perfil/:candidato_id/habilidades  → reemplazar habilidades
router.patch('/:candidato_id/habilidades', actualizarHabilidades);

// POST  /api/perfil/:candidato_id/cv           → subir CV en PDF
router.post('/:candidato_id/cv', subirCV);

// PATCH /api/perfil/:candidato_id/portafolio   → actualizar proyectos
router.patch('/:candidato_id/portafolio', actualizarPortafolio);

// PATCH /api/perfil/:candidato_id/busqueda     → toggle búsqueda activa
router.patch('/:candidato_id/busqueda', actualizarBusquedaActiva);

module.exports = router;