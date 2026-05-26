const { supabase } = require('../config/db');

// Schema real en Supabase:
// postulaciones: id_postulacion (int4 PK), id_candidato (uuid), id_vacante (int4),
//                estatus_swipe (varchar), tipo_lista (varchar), fecha (timestamptz)
// vacantes:      id_vacante, id_reclutador, titulo, descripcion, sueldo, estatus, fecha_creacion
// reclutadores:  id (uuid), nombre_empresa (varchar), fecha_registro

// Incluye retroalimentaciones para mostrar el feedback inline en cada tarjeta.
const obtenerMisPostulaciones = async (peticionCliente, respuestaServidor) => {
    try {
        const { candidato_id } = peticionCliente.params;

        // CORRECCIÓN: Agregado 'id_vacante' al select de Supabase para que el Frontend
        // pueda enviar el ID correcto en las interacciones/swipes.
        const { data: postulaciones, error } = await supabase
            .from('postulaciones')
            .select(`
                id_postulacion, 
                id_vacante, 
                estatus_swipe, 
                tipo_lista, 
                fecha,
                vacantes (
                    titulo, descripcion, sueldo,
                    reclutadores ( nombre_empresa )
                )
            `)
            .eq('id_candidato', candidato_id)
            .order('fecha', { ascending: false });

        if (error) throw error;

        return respuestaServidor.status(200).json(postulaciones);
    } catch (excepcionSistema) {
        console.error('[postulaciones] Error al obtener postulaciones:', excepcionSistema.message);
        return respuestaServidor.status(500).json({ mensaje: 'Error al cargar el estatus de tus procesos.' });
    }
};

//  ÚLTIMAS 3 POSTULACIONES (panel de Inicio del Candidato) 
const obtenerPostulacionesRecientes = async (peticionCliente, respuestaServidor) => {
    try {
        const { candidato_id } = peticionCliente.params;

        const { data: postulaciones, error } = await supabase
            .from('postulaciones')
            .select(`
                id_postulacion, estatus_swipe, tipo_lista, fecha,
                vacantes (
                    titulo,
                    reclutadores ( nombre_empresa )
                ),
                retroalimentaciones ( comentario, skills_faltantes )
            `)
            .eq('id_candidato', candidato_id)
            .order('fecha', { ascending: false })
            .limit(3);

        if (error) throw error;

        return respuestaServidor.status(200).json(postulaciones);
    } catch (excepcionSistema) {
        console.error('[postulaciones] Error al obtener postulaciones recientes:', excepcionSistema.message);
        return respuestaServidor.status(500).json({ mensaje: 'Error al cargar tu actividad reciente.' });
    }
};

module.exports = { obtenerMisPostulaciones, obtenerPostulacionesRecientes };