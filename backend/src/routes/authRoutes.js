const express = require('express');
const controladorAutenticacion = require('../controllers/auth');

const enrutadorAuth = express.Router();

// Rutas de autenticación
enrutadorAuth.post('/registro', controladorAutenticacion.registrarUsuario);
enrutadorAuth.post('/login', controladorAutenticacion.iniciarSesion);

module.exports = enrutadorAuth;