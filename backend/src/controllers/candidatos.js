const { supabase } = require('../config/db');
const multer        = require('multer');

const CODIGO_EXITO          = 200;
const CODIGO_ERROR_CLIENTE  = 400;
const CODIGO_ERROR_SERVIDOR = 500;

// ─── MULTER (memoria, solo PDF, máx 5MB) ─────────────────────────────────────
const subirArchivoMiddleware = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') cb(null, true);
        else cb(new Error('Solo se permiten archivos PDF.'), false);
    },
    limits: { fileSize: 5 * 1024 * 1024 }
}).single('cv');

const procesarArchivo = (req, res) => new Promise((resolve, reject) => {
    subirArchivoMiddleware(req, res, err => err ? reject(err) : resolve());
});

// ─── OBTENER PERFIL COMPLETO ───────────────────────────────────────────────────
    const obtenerPerfilCandidato = async (req, res) => {
    try {

        const { candidato_id } = req.params;
        console.log("[Perfil] candidato:", candidato_id);

        const { data: perfil, error } = await supabase
            .from('candidatos')
            .select('nombre_completo, rol_profesional, ubicacion, descripcion, busqueda_activa, portafolio, cv_url, cv_nombre')
            .eq('id', candidato_id)
            .maybeSingle();

        if (error) throw error;

        if (!perfil) {
            return res.status(404).json({ mensaje: 'Perfil no encontrado' });
        }

        // Habilidades con nombre de etiqueta
        const { data: habilidades, error: errorH } = await supabase
            .from('candidato_habilidades')
            .select('nivel, etiquetas(id_etiqueta, nombre)')
            .eq('id_candidato', candidato_id);

        if (errorH) throw errorH;

        const habilidadesTecnicas    = (habilidades || [])
            .filter(h => h.nivel === 'tecnico')
            .map(h => ({ id: h.etiquetas.id_etiqueta, nombre: h.etiquetas.nombre }));

        const habilidadesAdicionales = (habilidades || [])
            .filter(h => h.nivel === 'adicional')
            .map(h => ({ id: h.etiquetas.id_etiqueta, nombre: h.etiquetas.nombre }));

        return res.status(200).json({
            ...perfil,
            portafolio:              perfil.portafolio              || [],
            habilidades_tecnicas:    habilidadesTecnicas,
            habilidades_adicionales: habilidadesAdicionales
        });

        } catch (error) {
            console.error('[candidatos] obtenerPerfil:', error.message);
            return res.status(500).json({ mensaje: 'Error al cargar perfil' });
        }
    };

// ─── OBTENER PERFIL POR ID DE POSTULACIÓN (para vista del reclutador) ──────
const obtenerPerfilPorPostulacion = async (req, res) => {
    try {
        const { id_postulacion } = req.params;
        console.log("[Perfil por postulación] postulacion:", id_postulacion);

        // Resolver el id_candidato desde la postulación
        const { data: postulacion, error: errorPost } = await supabase
            .from('postulaciones')
            .select('id_candidato')
            .eq('id_postulacion', id_postulacion)
            .maybeSingle();

        if (errorPost) throw errorPost;
        if (!postulacion) {
            return res.status(404).json({ mensaje: 'Postulación no encontrada' });
        }

        const candidato_id = postulacion.id_candidato;

        // Obtener perfil del candidato
        const { data: perfil, error } = await supabase
            .from('candidatos')
            .select('nombre_completo, rol_profesional, ubicacion, descripcion, busqueda_activa, portafolio, cv_url, cv_nombre')
            .eq('id', candidato_id)
            .maybeSingle();

        if (error) throw error;
        if (!perfil) {
            return res.status(404).json({ mensaje: 'Perfil no encontrado' });
        }

        // Habilidades
        const { data: habilidades, error: errorH } = await supabase
            .from('candidato_habilidades')
            .select('nivel, etiquetas(id_etiqueta, nombre)')
            .eq('id_candidato', candidato_id);

        if (errorH) throw errorH;

        const habilidadesTecnicas = (habilidades || [])
            .filter(h => h.nivel === 'tecnico')
            .map(h => ({ id: h.etiquetas.id_etiqueta, nombre: h.etiquetas.nombre }));

        const habilidadesAdicionales = (habilidades || [])
            .filter(h => h.nivel === 'adicional')
            .map(h => ({ id: h.etiquetas.id_etiqueta, nombre: h.etiquetas.nombre }));

        return res.status(200).json({
            ...perfil,
            portafolio:              perfil.portafolio              || [],
            habilidades_tecnicas:    habilidadesTecnicas,
            habilidades_adicionales: habilidadesAdicionales
        });

    } catch (error) {
        console.error('[candidatos] obtenerPerfilPorPostulacion:', error.message);
        return res.status(500).json({ mensaje: 'Error al cargar perfil' });
    }
};

// ─── BUSCAR ETIQUETAS ─────────────────────────────────────────────────────────
const buscarEtiquetas = async (peticionCliente, respuestaServidor) => {
    try {
        const texto = (peticionCliente.query.q || '').trim();
        if (!texto) return respuestaServidor.status(CODIGO_EXITO).json([]);

        const { data, error } = await supabase
            .from('etiquetas')
            .select('id_etiqueta, nombre')
            .ilike('nombre', `%${texto}%`)
            .order('nombre', { ascending: true })
            .limit(8);

        if (error) throw error;
        return respuestaServidor.status(CODIGO_EXITO).json(data || []);

    } catch (ex) {
        console.error('[candidatos] buscarEtiquetas:', ex.message);
        return respuestaServidor.status(CODIGO_ERROR_SERVIDOR).json({
            mensaje: 'Error al buscar habilidades.'
        });
    }
};

// ─── OBTENER O CREAR ETIQUETA ─────────────────────────────────────────────────
const obtenerOCrearEtiqueta = async (nombre) => {
    const nombreLimpio = nombre.trim();
    const { data: existentes } = await supabase
        .from('etiquetas')
        .select('id_etiqueta')
        .ilike('nombre', nombreLimpio)
        .limit(1);

    if (existentes?.length) return existentes[0].id_etiqueta;

    const { data: nueva, error } = await supabase
        .from('etiquetas')
        .insert([{ nombre: nombreLimpio }])
        .select('id_etiqueta')
        .single();

    if (error) throw error;
    return nueva.id_etiqueta;
};

// ─── ACTUALIZAR HABILIDADES ───────────────────────────────────────────────────
const actualizarHabilidades = async (peticionCliente, respuestaServidor) => {
    try {
        const { candidato_id } = peticionCliente.params;
        const { tecnicas, adicionales } = peticionCliente.body;

        if (!Array.isArray(tecnicas) || !Array.isArray(adicionales)) {
            return respuestaServidor.status(CODIGO_ERROR_CLIENTE).json({
                mensaje: 'Las habilidades deben enviarse como arreglos.'
            });
        }

        // Eliminar todas las actuales
        const { error: errorEliminar } = await supabase
            .from('candidato_habilidades')
            .delete()
            .eq('id_candidato', candidato_id);

        if (errorEliminar) throw errorEliminar;

        // Resolver IDs (puede ser nueva etiqueta)
        const resolverIds = async (lista, nivel) => {
            const registros = [];
            for (const item of lista) {
                const nombre       = typeof item === 'string' ? item : item.nombre;
                const idExistente  = typeof item === 'object' && item.id_etiqueta ? item.id_etiqueta : null;
                const idEtiqueta   = idExistente || await obtenerOCrearEtiqueta(nombre);
                registros.push({ id_candidato: candidato_id, id_etiqueta: idEtiqueta, nivel });
            }
            return registros;
        };

        const registros = [
            ...await resolverIds(tecnicas,    'tecnico'),
            ...await resolverIds(adicionales, 'adicional')
        ];

        if (registros.length) {
            const { error: errorInsertar } = await supabase
                .from('candidato_habilidades')
                .insert(registros);
            if (errorInsertar) throw errorInsertar;
        }

        return respuestaServidor.status(CODIGO_EXITO).json({
            mensaje: 'Habilidades actualizadas correctamente.'
        });

    } catch (ex) {
        console.error('[candidatos] actualizarHabilidades:', ex.message);
        return respuestaServidor.status(CODIGO_ERROR_SERVIDOR).json({
            mensaje: 'Error al guardar las habilidades.'
        });
    }
};

// ─── SUBIR CV ─────────────────────────────────────────────────────────────────
const subirCV = async (peticionCliente, respuestaServidor) => {
    try {
        // Procesar el archivo con multer
        await procesarArchivo(peticionCliente, respuestaServidor);

        const { candidato_id } = peticionCliente.params;

        if (!peticionCliente.file) {
            return respuestaServidor.status(CODIGO_ERROR_CLIENTE).json({
                mensaje: 'No se recibió ningún archivo. Asegúrate de subir un PDF.'
            });
        }

        const archivo     = peticionCliente.file;
        const rutaStorage = `${candidato_id}/cv.pdf`;

        // Subir a Supabase Storage
        const { error: errorStorage } = await supabase.storage
            .from('cvs')
            .upload(rutaStorage, archivo.buffer, {
                contentType: 'application/pdf',
                upsert: true
            });

        if (errorStorage) {
            console.error('[candidatos] Error Storage:', errorStorage);
            throw new Error(errorStorage.message || 'Error al subir el archivo al servidor.');
        }

        // Obtener URL — intenta pública primero, si falla usa signed URL (60 min)
        let urlCV = '';
        try {
            const { data: urlPublica } = supabase.storage
                .from('cvs')
                .getPublicUrl(rutaStorage);
            urlCV = urlPublica?.publicUrl || '';
        } catch {
            const { data: urlFirmada } = await supabase.storage
                .from('cvs')
                .createSignedUrl(rutaStorage, 3600);
            urlCV = urlFirmada?.signedUrl || rutaStorage;
        }

        // Guardar en la tabla candidatos
        const { error: errorUpdate } = await supabase
            .from('candidatos')
            .update({ cv_url: urlCV, cv_nombre: archivo.originalname })
            .eq('id', candidato_id);

        if (errorUpdate) throw errorUpdate;

        return respuestaServidor.status(CODIGO_EXITO).json({
            mensaje:   'CV subido correctamente.',
            cv_url:    urlCV,
            cv_nombre: archivo.originalname
        });

    } catch (ex) {
        console.error('[candidatos] subirCV:', ex.message);

        if (ex.message?.includes('Solo se permiten')) {
            return respuestaServidor.status(CODIGO_ERROR_CLIENTE).json({ mensaje: ex.message });
        }
        if (ex.code === 'LIMIT_FILE_SIZE') {
            return respuestaServidor.status(CODIGO_ERROR_CLIENTE).json({
                mensaje: 'El archivo supera el límite de 5 MB.'
            });
        }

        return respuestaServidor.status(CODIGO_ERROR_SERVIDOR).json({
            mensaje: ex.message || 'Error al subir el CV. Intenta de nuevo.'
        });
    }
};

// ─── ACTUALIZAR PORTAFOLIO ────────────────────────────────────────────────────
const actualizarPortafolio = async (peticionCliente, respuestaServidor) => {
    try {
        const { candidato_id } = peticionCliente.params;
        const { portafolio }   = peticionCliente.body;

        if (!Array.isArray(portafolio)) {
            return respuestaServidor.status(CODIGO_ERROR_CLIENTE).json({
                mensaje: 'El portafolio debe enviarse como arreglo.'
            });
        }

        for (const p of portafolio) {
            if (!p.titulo?.trim()) {
                return respuestaServidor.status(CODIGO_ERROR_CLIENTE).json({
                    mensaje: 'Cada proyecto debe tener un título.'
                });
            }
            if (p.descripcion && p.descripcion.length > 300) {
                return respuestaServidor.status(CODIGO_ERROR_CLIENTE).json({
                    mensaje: `La descripción del proyecto "${p.titulo}" no puede superar 300 caracteres.`
                });
            }
        }

        const { error } = await supabase
            .from('candidatos')
            .update({ portafolio })
            .eq('id', candidato_id);

        if (error) throw error;

        return respuestaServidor.status(CODIGO_EXITO).json({
            mensaje: 'Portafolio actualizado correctamente.',
            portafolio
        });

    } catch (ex) {
        console.error('[candidatos] actualizarPortafolio:', ex.message);
        return respuestaServidor.status(CODIGO_ERROR_SERVIDOR).json({
            mensaje: 'Error al guardar el portafolio.'
        });
    }
};

// ─── ACTUALIZAR PERFIL BÁSICO ─────────────────────────────────────────────────
const actualizarPerfil = async (peticionCliente, respuestaServidor) => {
    try {
        const { candidato_id } = peticionCliente.params;
        const { nombre_completo, rol_profesional, ubicacion, descripcion } = peticionCliente.body;

        if (!nombre_completo?.trim()) {
            return respuestaServidor.status(CODIGO_ERROR_CLIENTE).json({
                mensaje: 'El nombre completo no puede estar vacío.'
            });
        }
        if (nombre_completo.trim().length > 150) {
            return respuestaServidor.status(CODIGO_ERROR_CLIENTE).json({
                mensaje: 'El nombre no puede superar 150 caracteres.'
            });
        }

        const { error } = await supabase
            .from('candidatos')
            .update({
                nombre_completo: nombre_completo.trim(),
                rol_profesional: rol_profesional?.trim() || null,
                ubicacion:       ubicacion?.trim()        || null,
                descripcion:     descripcion?.trim()      || null
            })
            .eq('id', candidato_id);

        if (error) throw error;

        return respuestaServidor.status(CODIGO_EXITO).json({
            mensaje: 'Perfil actualizado correctamente.'
        });

    } catch (ex) {
        console.error('[candidatos] actualizarPerfil:', ex.message);
        return respuestaServidor.status(CODIGO_ERROR_SERVIDOR).json({
            mensaje: 'Error al guardar los cambios del perfil.'
        });
    }
};

// ─── ACTUALIZAR BÚSQUEDA ACTIVA ───────────────────────────────────────────────
const actualizarBusquedaActiva = async (peticionCliente, respuestaServidor) => {
    try {
        const { candidato_id } = peticionCliente.params;
        const { busqueda_activa } = peticionCliente.body;

        if (typeof busqueda_activa !== 'boolean') {
            return respuestaServidor.status(CODIGO_ERROR_CLIENTE).json({
                mensaje: 'El campo busqueda_activa debe ser un valor booleano (true/false).'
            });
        }

        const { error } = await supabase
            .from('candidatos')
            .update({ busqueda_activa })
            .eq('id', candidato_id);

        if (error) throw error;

        return respuestaServidor.status(CODIGO_EXITO).json({
            mensaje: `Búsqueda activa actualizada a: ${busqueda_activa}`,
            busqueda_activa
        });

    } catch (ex) {
        console.error('[candidatos] actualizarBusquedaActiva:', ex.message);
        return respuestaServidor.status(CODIGO_ERROR_SERVIDOR).json({
            mensaje: 'Error al actualizar el estado de búsqueda.'
        });
    }
};

module.exports = {
    obtenerPerfilCandidato,
    obtenerPerfilPorPostulacion,
    buscarEtiquetas,
    actualizarPerfil,
    actualizarHabilidades,
    subirCV,
    actualizarPortafolio,
    actualizarBusquedaActiva
};