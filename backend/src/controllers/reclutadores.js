const { supabase } = require('../config/db');

const CODIGO_EXITO          = 200;
const CODIGO_ERROR_CLIENTE  = 400;
const CODIGO_ERROR_SERVIDOR = 500;

// ─── ACTUALIZAR PERFIL DE RECLUTADOR ─────────────────────────────────────────
const actualizarReclutador = async (peticionCliente, respuestaServidor) => {
    try {
        const { id } = peticionCliente.params;
        const {
            nombre_empresa,
            ubicacion,
            tipo_empresa,
            modalidad,
            horario,
            nivel_puesto,
            idioma,
            cultura_laboral,
            alcance,
            rubro
        } = peticionCliente.body;

        if (!id) {
            return respuestaServidor.status(CODIGO_ERROR_CLIENTE).json({
                mensaje: 'El ID del reclutador es obligatorio.'
            });
        }

        const camposActualizar = {};
        if (nombre_empresa)  camposActualizar.nombre_empresa  = nombre_empresa.trim();
        if (ubicacion)        camposActualizar.ubicacion        = ubicacion.trim();
        if (tipo_empresa)     camposActualizar.tipo_empresa     = tipo_empresa;
        if (modalidad)        camposActualizar.modalidad        = modalidad;
        if (horario)          camposActualizar.horario          = horario;
        if (nivel_puesto)     camposActualizar.nivel_puesto     = nivel_puesto;
        if (idioma)           camposActualizar.idioma           = idioma;
        if (cultura_laboral)  camposActualizar.cultura_laboral  = cultura_laboral;
        if (alcance)          camposActualizar.alcance          = alcance;
        if (rubro)            camposActualizar.rubro            = rubro;

        const { data, error } = await supabase
            .from('reclutadores')
            .update(camposActualizar)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('[reclutadores] Error al actualizar:', error.message);
            return respuestaServidor.status(CODIGO_ERROR_SERVIDOR).json({
                mensaje: 'No se pudo actualizar el perfil del reclutador.'
            });
        }

        return respuestaServidor.status(CODIGO_EXITO).json({
            ok: true,
            mensaje: 'Perfil del reclutador actualizado correctamente.',
            reclutador: data
        });

    } catch (excepcion) {
        console.error('[reclutadores] Error inesperado:', excepcion);
        return respuestaServidor.status(CODIGO_ERROR_SERVIDOR).json({
            mensaje: 'Error interno del servidor.'
        });
    }
};

// ─── OBTENER PERFIL DE RECLUTADOR ────────────────────────────────────────────
const obtenerReclutador = async (peticionCliente, respuestaServidor) => {
    try {
        const { id } = peticionCliente.params;

        const { data, error } = await supabase
            .from('reclutadores')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return respuestaServidor.status(CODIGO_ERROR_CLIENTE).json({
                mensaje: 'Reclutador no encontrado.'
            });
        }

        return respuestaServidor.status(CODIGO_EXITO).json({
            ok: true,
            reclutador: data
        });

    } catch (excepcion) {
        console.error('[reclutadores] Error al obtener:', excepcion);
        return respuestaServidor.status(CODIGO_ERROR_SERVIDOR).json({
            mensaje: 'Error interno del servidor.'
        });
    }
};

module.exports = { actualizarReclutador, obtenerReclutador };
