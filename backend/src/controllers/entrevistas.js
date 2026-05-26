const { supabase } = require('../config/db');

// Schema real en Supabase:
// entrevistas: id_entrevista (int4), id_postulacion (int4), fecha (date),
//              hora (time), link_reunion (text), confirmada (bool)
// NO existen: candidato_id, reclutador_id, fecha_hora, modalidad
// Para llegar al candidato hay que pasar por postulaciones

// ─── CALENDARIO DEL RECLUTADOR ────────────────────────────────────────────────
// (pendiente de ajustar cuando se trabaje la vista del reclutador)
const obtenerCalendarioReclutador = async (peticionCliente, respuestaServidor) => {
    try {
        const { reclutador_id } = peticionCliente.params;

        // La entrevista llega al reclutador a través de:
        // entrevistas → postulaciones → vacantes → reclutadores
        const { data: entrevistas, error } = await supabase
            .from('entrevistas')
            .select(`
                id_entrevista, fecha, hora, link_reunion, confirmada,
                postulaciones!inner (
                    id_candidato,
                    vacantes!inner (
                        titulo,
                        id_reclutador,
                        reclutadores ( nombre_empresa )
                    ),
                    candidatos ( nombre_completo )
                )
            `)
            .eq('postulaciones.vacantes.id_reclutador', reclutador_id)
            .order('fecha', { ascending: true });

        if (error) throw error;

        return respuestaServidor.status(200).json(entrevistas);
    } catch (excepcionSistema) {
        console.error('Error al obtener el calendario:', excepcionSistema.message);
        return respuestaServidor.status(500).json({ mensaje: 'Error al cargar la agenda de entrevistas.' });
    }
};

// ─── PRÓXIMAS ENTREVISTAS DEL CANDIDATO (panel de Inicio) ────────────────────
// entrevistas no tiene candidato_id directamente.
// Ruta: entrevistas → postulaciones (id_postulacion) → candidatos (id_candidato)
// Usamos !inner para que el filtro en la tabla relacionada funcione en PostgREST.
const obtenerEntrevistasCandidato = async (peticionCliente, respuestaServidor) => {
    try {
        const { candidato_id } = peticionCliente.params;

        // Usamos fecha (date) en lugar de fecha_hora (no existe)
        const hoy = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

        const { data: entrevistas, error } = await supabase
            .from('entrevistas')
            .select(`
                id_entrevista, fecha, hora, link_reunion, confirmada,
                postulaciones!inner (
                    id_candidato,
                    vacantes (
                        titulo,
                        reclutadores ( nombre_empresa )
                    )
                )
            `)
            .eq('postulaciones.id_candidato', candidato_id)
            .gte('fecha', hoy)
            .order('fecha', { ascending: true })
            .limit(5);

        if (error) throw error;

        return respuestaServidor.status(200).json(entrevistas);
    } catch (excepcionSistema) {
        console.error('Error al obtener entrevistas del candidato:', excepcionSistema.message);
        return respuestaServidor.status(500).json({ mensaje: 'Error al cargar tu agenda de entrevistas.' });
    }
};

const guardarOActualizarEntrevista = async (idPostulacion, fecha, hora, linkReunion) => {
    const { data: existente, error: errorBusqueda } = await supabase
        .from('entrevistas')
        .select('*')
        .eq('id_postulacion', idPostulacion)
        .maybeSingle();

    if (errorBusqueda) {
        throw errorBusqueda;
    }

    const payload = {
        fecha,
        hora,
        link_reunion: linkReunion || '',
        confirmada: false
    };

    if (existente) {
        const { data, error } = await supabase
            .from('entrevistas')
            .update(payload)
            .eq('id_postulacion', idPostulacion)
            .select();
        if (error) {
            throw error;
        }
        return data;
    }

    const { data, error } = await supabase
        .from('entrevistas')
        .insert([{ id_postulacion: idPostulacion, ...payload }])
        .select();
    if (error) {
        throw error;
    }
    return data;
};

// ─── AGENDAR UNA NUEVA ENTREVISTA O REAGENDAR ────────────────────────────────
const agendarEntrevista = async (req, res) => {
    try {
        const { id_postulacion, fecha, hora, link_reunion } = req.body;

        if (!id_postulacion || !fecha || !hora) {
            return res.status(400).json({ mensaje: 'Faltan datos obligatorios para agendar' });
        }

        const entrevista = await guardarOActualizarEntrevista(id_postulacion, fecha, hora, link_reunion);

        const { error: errorUpdate } = await supabase
            .from('postulaciones')
            .update({ estatus_swipe: 'entrevista' })
            .eq('id_postulacion', id_postulacion);

        if (errorUpdate) {
            throw errorUpdate;
        }

        return res.status(200).json({ mensaje: 'Entrevista agendada exitosamente', entrevista });
    } catch (error) {
        console.error('Error al agendar entrevista:', error);
        return res.status(500).json({ mensaje: 'Error al guardar en base de datos' });
    }
};

module.exports = { 
    obtenerCalendarioReclutador, 
    obtenerEntrevistasCandidato, 
    agendarEntrevista // <--- ¡Asegúrate de exportarla aquí!
};