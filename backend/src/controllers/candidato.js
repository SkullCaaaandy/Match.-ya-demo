/* 
const { supabase } = require('../config/db');
const matchingService = require('../../Services/matchingCandidatoService');

class CandidatosController {

  async obtenerPorVacante(req, res) {

    try {

      const idVacante = req.params.idVacante;

      // 🔥 SKILLS DE LA VACANTE (esto sí está bien)
      const { data: skillsVacante } = await supabase
        .from('vacante_etiquetas')
        .select('id_etiqueta')
        .eq('id_vacante', idVacante);

      // 🔥 POSTULACIONES + CANDIDATOS (AQUÍ ESTÁ EL FIX)
      const { data: postulaciones, error } = await supabase
        .from('postulaciones')
        .select(`
          id_postulacion,
          id_vacante,
          id_candidato,
          candidatos (
            id,
            nombre_completo,
            rol_profesional,
            ubicacion,
            descripcion
          )
        `)
        .eq('id_vacante', idVacante);

      if (error) throw error;

      // 🔥 habilidades (igual que antes)
      const { data: habilidades } = await supabase
        .from('candidato_habilidades')
        .select('*');

      // 🔥 aplanar estructura para el frontend + matching
      const candidatos = postulaciones.map(p => ({
        id_postulacion: p.id_postulacion,
        ...p.candidatos
      }));

      const resultado = matchingService.procesar(
        skillsVacante || [],
        candidatos || [],
        habilidades || []
      );

      return res.status(200).json(resultado);

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        mensaje: 'Error interno'
      });
    }
  }
}

module.exports = new CandidatosController(); */

const matchingCandidatoService = require('../services/matchingCandidatoService');

class CandidatosController {
    async obtenerPorVacante(req, res) {
        try {
            const idVacante = req.params.idVacante;
            
            // Le pasamos la estafeta directamente a nuestro algoritmo
            const resultado = await matchingCandidatoService.procesar(idVacante);
            
            return res.status(200).json(resultado);
        } catch (error) {
            console.error("Error al hacer match de candidatos:", error);
            return res.status(500).json({ mensaje: 'Error interno del algoritmo' });
        }
    }
}

module.exports = new CandidatosController();