const { supabase } = require('../config/db');

// Schema real en Supabase:
// retroalimentaciones: id_feedback (int4 PK), id_postulacion (int4 FK),
//                      comentario (text), skills_faltantes (text), fecha_envio (timestamptz)

// OBTENER FEEDBACK DE UNA POSTULACIÓN 
// El candidato consulta la retroalimentación de una postulación específica.
// Se verifica que la postulación realmente pertenezca al candidato que la pide.
const obtenerFeedbackDePostulacion = async (peticionCliente, respuestaServidor) => {
    try {
        const { id_postulacion } = peticionCliente.params;
        const { candidato_id }   = peticionCliente.query; // ?candidato_id=xxx

        // Validación de seguridad: confirmar que la postulacion es del candidato
        if (candidato_id) {
            const { data: postulacion, error: errorVerificacion } = await supabase
                .from('postulaciones')
                .select('id_postulacion')
                .eq('id_postulacion', id_postulacion)
                .eq('id_candidato', candidato_id)
                .single();

            if (errorVerificacion || !postulacion) {
                return respuestaServidor.status(403).json({
                    mensaje: 'No tienes permiso para ver este feedback.'
                });
            }
        }

        const { data: feedback, error } = await supabase
            .from('retroalimentaciones')
            .select('id_feedback, comentario, skills_faltantes, fecha_envio')
            .eq('id_postulacion', id_postulacion)
            .single();

        // PGRST116 = no se encontró fila → esta postulación aún no tiene feedback
        if (error && error.code === 'PGRST116') {
            return respuestaServidor.status(200).json(null);
        }

        if (error) throw error;

        return respuestaServidor.status(200).json(feedback);

    } catch (excepcionSistema) {
        console.error('[retroalimentaciones] Error al obtener feedback:', excepcionSistema.message);
        return respuestaServidor.status(500).json({
            mensaje: 'Error al cargar la retroalimentación.'
        });
    }
};

// OBTENER TODO EL FEEDBACK DEL CANDIDATO 
// Devuelve todas las retroalimentaciones del candidato para la vista dedicada.
// Hace el join: retroalimentaciones → postulaciones → vacantes → reclutadores
const obtenerTodoElFeedbackDelCandidato = async (peticionCliente, respuestaServidor) => {
    try {
        const { candidato_id } = peticionCliente.params;

        const { data: feedbacks, error } = await supabase
            .from('retroalimentaciones')
            .select(`
                id_feedback, comentario, skills_faltantes, fecha_envio,
                postulaciones!inner (
                    id_postulacion,
                    id_candidato,
                    estatus_swipe,
                    vacantes (
                        titulo,
                        reclutadores ( nombre_empresa )
                    )
                )
            `)
            .eq('postulaciones.id_candidato', candidato_id)
            .order('fecha_envio', { ascending: false });

        if (error) throw error;

        return respuestaServidor.status(200).json(feedbacks);

    } catch (excepcionSistema) {
        console.error('[retroalimentaciones] Error al obtener feedbacks del candidato:', excepcionSistema.message);
        return respuestaServidor.status(500).json({
            mensaje: 'Error al cargar tus retroalimentaciones.'
        });
    }
};

module.exports = { obtenerFeedbackDePostulacion, obtenerTodoElFeedbackDelCandidato };
