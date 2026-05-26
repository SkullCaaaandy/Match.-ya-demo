const { supabase } = require("../config/db");
const matchingVacantes = require("../services/matchingVacantesService"); //Algoritmo Neyzer
//const matchingVacantes = require("../../Services/matchingVacantesService");

const guardarFiltrosBusqueda = async (req, res) => {
    try {

        const {
            id_candidato,
            puesto,
            ubicacion,
            modalidad,
            salario_minimo,
            horario,
            tipo_empresa,
            nivel_puesto,
            cultura_laboral,
            idioma,
            prioridad
        } = req.body;

        const { data, error } = await supabase
            .from("filtros_busqueda")
            .upsert([
                {
                    id_candidato,
                    puesto,
                    ubicacion,
                    modalidad,
                    salario_minimo,
                    horario,
                    tipo_empresa,
                    nivel_puesto,
                    cultura_laboral,
                    idioma,
                    prioridad,
                    fecha_actualizacion: new Date()
                }
            ], {
                onConflict: "id_candidato"
            });

        if (error) throw error;

        const vacantes = await matchingVacantes.procesar(id_candidato);

        res.json({
            ok: true,
            mensaje: "Filtros guardados correctamente",
            vacantes
        });

    } catch (error) {

        console.log("ERROR:", error);

        res.status(500).json({
            ok: false,
            mensaje: "Error al guardar filtros"
        });
    }
};


// Verificar si candidato ya configuró filtros
const verificarFiltrosBusqueda = async (req, res) => {
    try {

        const { id } = req.params;

        const { data, error } = await supabase
            .from("filtros_busqueda")
            .select("id_candidato")
            .eq("id_candidato", id)
            .maybeSingle();

        if (error) throw error;

        res.json({
            tieneFiltros: !!data
        });

    } catch (error) {

        console.log("ERROR:", error);

        res.status(500).json({
            tieneFiltros: false
        });
    }
};


// Obtener filtros de búsqueda de un candidato
const obtenerFiltrosBusqueda = async (req, res) => {
    try {

        const { id } = req.params;

        const { data, error } = await supabase
            .from("filtros_busqueda")
            .select("*")
            .eq("id_candidato", id)
            .maybeSingle();

        if (error) throw error;

        res.json({
            ok: true,
            filtros: data
        });

    } catch (error) {

        console.log("ERROR:", error);

        res.status(500).json({
            ok: false,
            mensaje: "Error al obtener filtros"
        });
    }
};


module.exports = {
    guardarFiltrosBusqueda,
    verificarFiltrosBusqueda,
    obtenerFiltrosBusqueda
};