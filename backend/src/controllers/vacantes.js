const { supabase } = require('../config/db');
const matchingVacantesService = require('../services/matchingVacantesService');  //Algoritmo Neyzer
//const matchingVacantesService = require('../../Services/matchingVacantesService');

const CODIGO_EXITO          = 200;
const CODIGO_CREADO         = 201;
const CODIGO_ERROR_CLIENTE  = 400;
const CODIGO_ERROR_SERVIDOR = 500;

// ─── HELPER: sincronizar etiquetas de la vacante ──────────────────────────────
const sincronizarEtiquetas = async (idVacante, etiquetas) => {
    // Eliminar las anteriores
    await supabase.from('vacante_etiquetas').delete().eq('id_vacante', idVacante);

    if (!etiquetas || etiquetas.length === 0) return;

    // Resolver IDs de etiquetas (buscar o crear)
    const registros = [];
    for (const nombre of etiquetas) {
        const { data: existentes } = await supabase
            .from('etiquetas')
            .select('id_etiqueta')
            .ilike('nombre', nombre.trim())
            .limit(1);

        let idEtiqueta;
        if (existentes?.length) {
            idEtiqueta = existentes[0].id_etiqueta;
        } else {
            const { data: nueva } = await supabase
                .from('etiquetas')
                .insert([{ nombre: nombre.trim() }])
                .select('id_etiqueta')
                .single();
            idEtiqueta = nueva?.id_etiqueta;
        }

        if (idEtiqueta) {
            registros.push({ id_vacante: idVacante, id_etiqueta: idEtiqueta });
        }
    }

    if (registros.length > 0) {
        await supabase.from('vacante_etiquetas').insert(registros);
    }
};

// ─── CREAR VACANTE ────────────────────────────────────────────────────────────
const crearVacante = async (peticionCliente, respuestaServidor) => {
    try {
        const { titulo, descripcion, habilidadesRequeridas, salario, reclutador_id, modalidad, ubicacion } = peticionCliente.body;

        if (!titulo || !descripcion || !reclutador_id) {
            return respuestaServidor.status(CODIGO_ERROR_CLIENTE).json({
                mensaje: 'Faltan campos obligatorios: título, descripción y reclutador.'
            });
        }

        if (!habilidadesRequeridas || habilidadesRequeridas.length === 0) {
            return respuestaServidor.status(CODIGO_ERROR_CLIENTE).json({
                mensaje: 'Debes agregar al menos una habilidad requerida.'
            });
        }

        if (habilidadesRequeridas.length > 5) {
            return respuestaServidor.status(CODIGO_ERROR_CLIENTE).json({
                mensaje: 'El máximo de habilidades requeridas es 5 para un mejor resultado del algoritmo.'
            });
        }

        // Verificar que el reclutador exista
        const { error: errorReclutador } = await supabase
            .from('reclutadores')
            .upsert({ id: reclutador_id, nombre_empresa: 'Empresa Registrada' }, { onConflict: 'id', ignoreDuplicates: true });

        if (errorReclutador) {
            console.log('Aviso reclutador:', errorReclutador.message);
        }

        // Insertar la vacante
        const { data: nuevaVacante, error } = await supabase
            .from('vacantes')
            .insert([{
                titulo,
                descripcion,
                habilidades_requeridas: habilidadesRequeridas,
                sueldo:       salario,
                id_reclutador: reclutador_id,
                modalidad,
                ubicacion,
                estatus: 'activa'
            }])
            .select();

        if (error) throw error;

        // Sincronizar etiquetas para el algoritmo de matching
        await sincronizarEtiquetas(nuevaVacante[0].id_vacante, habilidadesRequeridas);

        // Guardamos habilidades en vacante_etiquetas

        const idVacante = nuevaVacante[0].id_vacante;

        if (habilidadesRequeridas && habilidadesRequeridas.length > 0) {

            for (const skill of habilidadesRequeridas) {

                const nombreSkill = skill.trim();

                // Buscar si ya existe la etiqueta
                let { data: etiquetaExistente } = await supabase
                    .from('etiquetas')
                    .select('*')
                    .ilike('nombre', nombreSkill)
                    .maybeSingle();

                // Si no existe, la creamos
                if (!etiquetaExistente) {

                    const { data: nuevaEtiqueta, error: errorNuevaEtiqueta } = await supabase
                        .from('etiquetas')
                        .insert([{
                            nombre: nombreSkill
                        }])
                        .select()
                        .single();

                    if (errorNuevaEtiqueta) {
                        throw errorNuevaEtiqueta;
                    }

                    etiquetaExistente = nuevaEtiqueta;
                }

                // Relacionamos vacante con etiqueta
                const { error: errorRelacion } = await supabase
                    .from('vacante_etiquetas')
                    .insert([{
                        id_vacante: idVacante,
                        id_etiqueta: etiquetaExistente.id_etiqueta
                    }]);

                if (errorRelacion) {
                    console.log('Aviso al relacionar skill:', errorRelacion.message);
                }
            }
        }

        return respuestaServidor.status(201).json({
            mensaje: '¡Vacante publicada con éxito!',
            vacante: nuevaVacante[0]
        });

    } catch (ex) {
        console.error('Error al crear vacante:', ex.message);
        return respuestaServidor.status(CODIGO_ERROR_SERVIDOR).json({ mensaje: 'Error interno al guardar la vacante.' });
    }
};

// ─── ACTUALIZAR VACANTE ───────────────────────────────────────────────────────
const actualizarVacante = async (peticionCliente, respuestaServidor) => {
    try {
        const { id_vacante } = peticionCliente.params;
        const { titulo, descripcion, habilidadesRequeridas, salario, modalidad, ubicacion } = peticionCliente.body;

        if (!titulo || !descripcion) {
            return respuestaServidor.status(CODIGO_ERROR_CLIENTE).json({
                mensaje: 'El título y la descripción son obligatorios.'
            });
        }

        if (habilidadesRequeridas && habilidadesRequeridas.length > 5) {
            return respuestaServidor.status(CODIGO_ERROR_CLIENTE).json({
                mensaje: 'El máximo de habilidades requeridas es 5.'
            });
        }

        const { error } = await supabase
            .from('vacantes')
            .update({
                titulo,
                descripcion,
                habilidades_requeridas: habilidadesRequeridas || [],
                sueldo:    salario,
                modalidad,
                ubicacion
            })
            .eq('id_vacante', id_vacante);

        if (error) throw error;

        // Re-sincronizar etiquetas
        await sincronizarEtiquetas(parseInt(id_vacante), habilidadesRequeridas || []);

        return respuestaServidor.status(CODIGO_EXITO).json({ mensaje: 'Vacante actualizada correctamente.' });

    } catch (ex) {
        console.error('Error al actualizar vacante:', ex.message);
        return respuestaServidor.status(CODIGO_ERROR_SERVIDOR).json({ mensaje: 'Error al actualizar la vacante.' });
    }
};

// ─── CAMBIAR ESTATUS (activa / inactiva) ─────────────────────────────────────
const cambiarEstatusVacante = async (peticionCliente, respuestaServidor) => {
    try {
        const { id_vacante } = peticionCliente.params;
        const { estatus } = peticionCliente.body;

        if (!['activa', 'inactiva'].includes(estatus)) {
            return respuestaServidor.status(CODIGO_ERROR_CLIENTE).json({
                mensaje: 'El estatus debe ser "activa" o "inactiva".'
            });
        }

        const { error } = await supabase
            .from('vacantes')
            .update({ estatus })
            .eq('id_vacante', id_vacante);

        if (error) throw error;

        return respuestaServidor.status(CODIGO_EXITO).json({
            mensaje: `Vacante ${estatus === 'activa' ? 'activada' : 'desactivada'} correctamente.`,
            estatus
        });

    } catch (ex) {
        console.error('Error al cambiar estatus:', ex.message);
        return respuestaServidor.status(CODIGO_ERROR_SERVIDOR).json({ mensaje: 'Error al cambiar el estatus.' });
    }
};

// ─── ELIMINAR VACANTE ─────────────────────────────────────────────────────────
const eliminarVacante = async (peticionCliente, respuestaServidor) => {
    try {
        const { id_vacante } = peticionCliente.params;

        // Eliminar etiquetas relacionadas primero
        await supabase.from('vacante_etiquetas').delete().eq('id_vacante', id_vacante);

        // Eliminar la vacante
        const { error } = await supabase
            .from('vacantes')
            .delete()
            .eq('id_vacante', id_vacante);

        if (error) throw error;

        return respuestaServidor.status(CODIGO_EXITO).json({ mensaje: 'Vacante eliminada correctamente.' });

    } catch (ex) {
        console.error('Error al eliminar vacante:', ex.message);
        return respuestaServidor.status(CODIGO_ERROR_SERVIDOR).json({ mensaje: 'Error al eliminar la vacante.' });
    }
};

// ─── OBTENER VACANTES RECIENTES DEL RECLUTADOR ───────────────────────────────
const obtenerVacantesRecientesReclutador = async (peticionCliente, respuestaServidor) => {
    try {
        const { reclutador_id } = peticionCliente.params;

        const { data: vacantes, error } = await supabase
            .from('vacantes')
            .select('*')
            .eq('id_reclutador', reclutador_id)
            .order('id_vacante', { ascending: false })
            .limit(5);

        if (error) throw error;

        return respuestaServidor.status(CODIGO_EXITO).json(vacantes);

    } catch (ex) {
        console.error('Error al obtener vacantes recientes:', ex.message);
        return respuestaServidor.status(CODIGO_ERROR_SERVIDOR).json({ mensaje: 'Error al obtener recientes.' });
    }
};

// ─── OBTENER TODAS LAS VACANTES DEL RECLUTADOR ───────────────────────────────
const obtenerTodasMisVacantes = async (peticionCliente, respuestaServidor) => {
    try {
        const { reclutador_id } = peticionCliente.params;

        const { data: vacantes, error } = await supabase
            .from('vacantes')
            .select('*')
            .eq('id_reclutador', reclutador_id)
            .order('id_vacante', { ascending: false });

        if (error) throw error;

        return respuestaServidor.status(CODIGO_EXITO).json(vacantes);

    } catch (ex) {
        console.error('Error al obtener vacantes:', ex.message);
        return respuestaServidor.status(CODIGO_ERROR_SERVIDOR).json({ mensaje: 'Error al obtener vacantes.' });
    }
};

// ─── OBTENER TODAS LAS VACANTES DEL SISTEMA ──────────────────────────────────
const obtenerVacantes = async (peticionCliente, respuestaServidor) => {
    try {
        const { data: listaVacantes, error } = await supabase
            .from('vacantes')
            .select('*')
            .order('id_vacante', { ascending: false });

        if (error) throw error;

        return respuestaServidor.status(CODIGO_EXITO).json(listaVacantes);

    } catch (ex) {
        console.error('Error al cargar vacantes:', ex.message);
        return respuestaServidor.status(CODIGO_ERROR_SERVIDOR).json({ mensaje: 'Error al cargar.' });
    }
};

/*Algoritmo de Neyzer*/
// ─── ALGORITMO: OBTENER VACANTES PERSONALIZADAS ──────────────────────────────
const obtenerVacantesPersonalizadas = async (peticionCliente, respuestaServidor) => {
    try {
        const { id_candidato } = peticionCliente.params;
        const resultado = await matchingVacantesService.procesar(id_candidato);
        respuestaServidor.status(200).json(resultado);
    } catch (error) {
        console.error('Error al generar recomendaciones:', error);
        respuestaServidor.status(500).json({ mensaje: 'Error al generar recomendaciones' });
    }
};
/*Hasta Aquí*/

module.exports = {
    crearVacante,
    actualizarVacante,
    cambiarEstatusVacante,
    eliminarVacante,
    obtenerVacantes,
    obtenerVacantesRecientesReclutador,
    obtenerTodasMisVacantes,
    obtenerVacantesPersonalizadas //Algoritmo de Neyzer
};