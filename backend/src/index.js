const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Crear app
const APLICACION_EXPRESS = express();

// Importación de rutas
const rutasAutenticacion = require('./routes/authRoutes');
const rutasVacantes = require('./routes/vacantesRoutes');
const rutasPostulaciones = require('./routes/postulacionesRoutes');
const rutasEntrevistas = require('./routes/entrevistasRoutes');
const rutasListas = require('./routes/listasRoutes');
const rutasCandidatos = require('./routes/candidatosReviewRoutes');
const rutasFiltros = require('./routes/filtrosRoutes');
const rutasInteracciones = require('./routes/interaccionesRoutes');
const rutasMatching = require('./routes/matchRoutes');
const rutasPerfil = require('./routes/candidatosRoutes');
const rutasRetroalimentaciones = require('./routes/retroalimentacionesRoutes');
const rutasReclutadores = require('./routes/reclutadoresRoutes');

// Puerto del servidor
const PUERTO_SERVIDOR = process.env.PORT || 3000;

// Middlewares globales
APLICACION_EXPRESS.use(cors());
APLICACION_EXPRESS.use(express.json());

// Declaración de rutas
APLICACION_EXPRESS.get('/', (req, res) => {
  res.send('Servidor Match-Ya activo');
});
APLICACION_EXPRESS.use('/api/auth', rutasAutenticacion);

APLICACION_EXPRESS.use('/api/vacantes', rutasVacantes);
APLICACION_EXPRESS.use('/api/postulaciones', rutasPostulaciones);
APLICACION_EXPRESS.use('/api/entrevistas', rutasEntrevistas);
APLICACION_EXPRESS.use('/api/listas', rutasListas);
APLICACION_EXPRESS.use('/api/candidatos', rutasCandidatos);
APLICACION_EXPRESS.use('/api/filtros', rutasFiltros);
APLICACION_EXPRESS.use('/api/interacciones', rutasInteracciones);
APLICACION_EXPRESS.use('/api/matching', rutasMatching);
APLICACION_EXPRESS.use('/api/perfil', rutasPerfil);
APLICACION_EXPRESS.use('/api/retroalimentaciones', rutasRetroalimentaciones);
APLICACION_EXPRESS.use('/api/reclutadores', rutasReclutadores);

// Iniciar servidor
APLICACION_EXPRESS.listen(PUERTO_SERVIDOR, () => {
  console.log(`Servidor Match-Ya en ejecución por el puerto ${PUERTO_SERVIDOR}`);
});