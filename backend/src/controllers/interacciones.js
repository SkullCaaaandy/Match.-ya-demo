/* const { supabase } = require('../config/db');

class InteraccionesController {

  async actualizarSwipe(req, res) {
    try {
      const { id_postulacion, estado } = req.body;

      let tipoLista = "pendientes";

      if (estado === "match") tipoLista = "matches";
      if (estado === "rechazado") tipoLista = "descartados";

      const { error } = await supabase
        .from("postulaciones")
        .update({
          estatus_swipe: estado,
          tipo_lista: tipoLista
        })
        .eq("id_postulacion", id_postulacion);

      if (error) throw error;

      res.json({
        ok: true,
        mensaje: "Swipe guardado"
      });

    } catch (error) {
      res.status(500).json({
        ok: false,
        error: error.message
      });
    }
  }


  async guardarDecision(req, res) {
    try {
      const { idReclutador, idCandidato, idVacante, estado } = req.body;

      const { error } = await supabase
        .from("interacciones")
        .insert([
          {
            id_reclutador: idReclutador,
            id_candidato: idCandidato,
            id_vacante: idVacante,
            estado: estado
          }
        ]);

      if (error) throw error;

      res.status(201).json({
        mensaje: "Interacción guardada"
      });

    } catch (error) {
      res.status(500).json({
        mensaje: "Error guardando interacción"
      });
    }
  }


  async obtenerMatches(req, res) {
    try {
      const { idReclutador } = req.params;

      const { data, error } = await supabase
        .from("interacciones")
        .select(`
          *,
          candidatos(*)
        `)
        .eq("id_reclutador", idReclutador)
        .eq("estado", "match");

      if (error) throw error;

      res.json(data);

    } catch (error) {
      res.status(500).json({
        mensaje: "Error cargando matches"
      });
    }
  }

}

module.exports = new InteraccionesController(); */

const { supabase } = require('../config/db');

// ─── SWIPE DEL CANDIDATO ────────────────────────────
const registrarSwipeCandidato = async (req, res) => {
    try {
        const { id_candidato, id_vacante, estado } = req.body;
        if (!id_candidato || !id_vacante || !estado) {
            return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
        }

        let tipoLista = "pendientes";
        if (estado === "match" || estado === "entrevista") tipoLista = "matches";
        if (estado === "rechazado" || estado === "dislike") tipoLista = "descartados";

        const { data, error } = await supabase
            .from('postulaciones')
            .upsert({
                id_candidato: id_candidato,
                id_vacante: id_vacante,
                estatus_swipe: estado,
                tipo_lista: tipoLista
            }, {
                onConflict: 'id_candidato, id_vacante'
            })
            .select();

        if (error) throw error;
        res.status(200).json({ mensaje: 'Interacción guardada con éxito', data });
    } catch (error) {
        console.error('Error al registrar swipe candidato:', error);
        res.status(500).json({ mensaje: 'Error al guardar en base de datos' });
    }
};

// ─── SWIPE DEL RECLUTADOR ───────────────────────────
const registrarSwipeReclutador = async (req, res) => {
    try {
        const { id_postulacion, estado, comentario } = req.body;
        if (!id_postulacion || !estado) {
            return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
        }

        let tipoLista = "pendientes";
        if (estado === "match" || estado === "entrevista") tipoLista = "matches";
        if (estado === "rechazado") tipoLista = "descartados";

        // 1. Actualizar estatus y tipo_lista
        const { error: errorUpdate } = await supabase
            .from('postulaciones')
            .update({ 
                estatus_swipe: estado,
                tipo_lista: tipoLista
            }) 
            .eq('id_postulacion', id_postulacion);

        if (errorUpdate) throw errorUpdate;

        // Limpieza de retroalimentación previa para evitar errores de clave duplicada
        await supabase
            .from('retroalimentaciones')
            .delete()
            .eq('id_postulacion', id_postulacion);

        // 2. Si pasa a Wait List, registrar el feedback
        if (estado === 'rechazado') {
            const { error: errorFeedback } = await supabase
                .from('retroalimentaciones')
                .insert([{
                    id_postulacion: id_postulacion,
                    comentario: comentario || "Reconsiderado para lista de espera"
                }]);

            if (errorFeedback) console.error('Aviso: Error al guardar feedback', errorFeedback);
        }

        res.status(200).json({ mensaje: 'Decisión del reclutador guardada con éxito' });
    } catch (error) {
        console.error('Error al registrar swipe reclutador:', error);
        res.status(500).json({ mensaje: 'Error al guardar en base de datos' });
    }
};

module.exports = { registrarSwipeCandidato, registrarSwipeReclutador };