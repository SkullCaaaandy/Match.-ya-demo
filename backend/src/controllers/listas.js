const { supabase } = require('../config/db');

const obtenerListasGuardadas = async (peticionCliente, respuestaServidor) => {
    try {
        const { reclutador_id } = peticionCliente.params;

        const { data: listas, error } = await supabase
            .from('listas_guardadas')
            .select(`
                id, notas_reclutador, fecha_guardado,
                candidatos ( nombre_completo, habilidades, experiencia )
            `)
            .eq('reclutador_id', reclutador_id);

        if (error) throw error;

        return respuestaServidor.status(200).json(listas);
    } catch (excepcionSistema) {
        console.error('Error al obtener listas:', excepcionSistema.message);
        return respuestaServidor.status(500).json({ mensaje: 'Error al cargar las listas de candidatos.' });
    }
};

module.exports = { obtenerListasGuardadas };