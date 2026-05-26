/*const express = require("express");
const controller = require("../controllers/interacciones");

const router = express.Router();

router.post("/guardar", controller.guardarDecision);
router.get("/matches/:idReclutador", controller.obtenerMatches);
router.put("/swipe", controller.actualizarSwipe);

module.exports = router; */

const express = require('express');
const router = express.Router();
const interaccionesController = require('../controllers/interacciones');

// Túnel del Candidato
router.put('/swipe-candidato', interaccionesController.registrarSwipeCandidato);

// Túnel del Reclutador
router.put('/swipe-reclutador', interaccionesController.registrarSwipeReclutador);

module.exports = router;