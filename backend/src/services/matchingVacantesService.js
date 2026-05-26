/* Algortimo de Dulce

const { supabase } = require("../src/config/db");

class MatchingVacantesService {

  normalizar(texto) {
    return texto
      ? texto.toString()
          .trim()
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
      : "";
  }

  async procesar(id_candidato) {
    try {

      // 1. Obtener filtros
      const { data: filtros, error: errorFiltros } = await supabase
        .from("filtros_busqueda")
        .select("*")
        .eq("id_candidato", id_candidato)
        .single();

      if (errorFiltros || !filtros) {
        return {
          principal: [],
          secundaria: []
        };
      }

      const preferencias = filtros;

      // 2. Obtener vacantes
      const { data: vacantes, error: errorVacantes } = await supabase
        .from("vacantes")
        .select("*")
        .eq("estatus", "Activa");

      if (errorVacantes) throw errorVacantes;

      let principal = [];
      let secundaria = [];

      for (const vacante of vacantes) {

        const score = this.calcularScore(vacante, preferencias);

        vacante.score = score;
        vacante.match = score + "%";

        if (score >= 50) {
          principal.push(vacante);
        } else {
          secundaria.push(vacante);
        }
      }

      principal.sort((a,b)=>b.score-a.score);
      secundaria.sort((a,b)=>b.score-a.score);

      return {
        principal,
        secundaria
      };

    } catch (error) {
      console.log("Error Matching:", error);
      throw error;
    }
  }

  calcularScore(vacante, preferencias) {

  let score = 0;

  // Puesto
  if (
    this.normalizar(preferencias.puesto) &&
    this.normalizar(vacante.titulo).includes(
      this.normalizar(preferencias.puesto)
    )
  ) score += 40;

  // Ubicación flexible
  if (
    this.normalizar(preferencias.ubicacion) &&
    this.normalizar(vacante.ubicacion).includes(
      this.normalizar(preferencias.ubicacion)
    )
  ) score += 20;

  // Modalidad
  if (
    this.normalizar(preferencias.modalidad) &&
    this.normalizar(vacante.modalidad) ===
    this.normalizar(preferencias.modalidad)
  ) score += 20;

  // Sueldo
  if (
    preferencias.salario_minimo &&
    Number(vacante.sueldo) >= Number(preferencias.salario_minimo)
  ) score += 20;

  if (score > 100) score = 100;

  return score;
}
}

module.exports = new MatchingVacantesService(); */

/* Algoritmo de Neyzer*/

const { supabase } = require('../config/db');

class MatchingVacantesService {
    async procesar(idCandidato) {
        // 1. Obtener filtros y habilidades del candidato
        const { data: filtros } = await supabase.from('filtros_busqueda').select('*').eq('id_candidato', idCandidato).single();
        const { data: habilidadesPerfil } = await supabase.from('candidato_habilidades').select('etiquetas(nombre)').eq('id_candidato', idCandidato);
        
        const misSkills = habilidadesPerfil ? habilidadesPerfil.map(h => h.etiquetas.nombre.toLowerCase()) : [];
        const salarioEsperado = filtros?.salario_minimo || 0;
        const modalidadEsperada = filtros?.modalidad?.toLowerCase() || '';
        const puestoEsperado = filtros?.puesto?.toLowerCase() || '';
        const ubicacionEsperada = filtros?.ubicacion?.toLowerCase() || '';
        const horarioEsperado = filtros?.horario?.toLowerCase() || '';
        const nivelEsperado = filtros?.nivel_puesto?.toLowerCase() || '';
        const idiomaEsperado = filtros?.idioma?.toLowerCase() || '';
        const tipoEmpresaEsperado = filtros?.tipo_empresa?.toLowerCase() || '';
        const culturaEsperada = filtros?.cultura_laboral?.toLowerCase() || '';

        // 2. Obtener vacantes activas y las que el candidato YA deslizó
        const { data: postulacionesPrevias } = await supabase.from('postulaciones').select('id_vacante').eq('id_candidato', idCandidato);
        const vacantesIgnoradas = postulacionesPrevias ? postulacionesPrevias.map(p => p.id_vacante) : [];

        let query = supabase.from('vacantes').select(`
            *,
            reclutadores(nombre_empresa, tipo_empresa, cultura_laboral),
            vacante_etiquetas(etiquetas(nombre))
        `).eq('estatus', 'activa');

        const { data: vacantes } = await query;

        // 3. Filtrar y Calificar
        let recomendaciones = [];

        for (let vacante of vacantes) {
            // Si ya la deslizó, saltarla
            if (vacantesIgnoradas.includes(vacante.id_vacante)) {
                continue;
            }

            let score = 0;
            const skillsVacante = vacante.vacante_etiquetas ? vacante.vacante_etiquetas.map(v => v.etiquetas.nombre.toLowerCase()) : [];

            // Evaluador de Habilidades (35 pts)
            if (skillsVacante.length > 0) {
                const coincidencias = skillsVacante.filter(skill => misSkills.includes(skill));
                score += (coincidencias.length / skillsVacante.length) * 35;
            } else {
                score += 35;
            }

            // Evaluador de Salario (15 pts)
            if (vacante.sueldo && vacante.sueldo >= salarioEsperado) {
                score += 15;
            }

            // Evaluador de Modalidad (10 pts)
            if (vacante.modalidad && modalidadEsperada && vacante.modalidad.toLowerCase() === modalidadEsperada) {
                score += 10;
            }

            // Evaluador de Puesto (10 pts)
            if (vacante.titulo && puestoEsperado && (vacante.titulo.toLowerCase().includes(puestoEsperado) || puestoEsperado.includes(vacante.titulo.toLowerCase()))) {
                score += 10;
            }

            // Evaluador de Nivel de Puesto (10 pts)
            if (vacante.nivel_puesto && nivelEsperado && vacante.nivel_puesto.toLowerCase() === nivelEsperado) {
                score += 10;
            }

            // Evaluador de Tipo de Contratación / Horario (5 pts)
            if (vacante.horario && horarioEsperado && vacante.horario.toLowerCase() === horarioEsperado) {
                score += 5;
            }

            // Evaluador de Idioma (5 pts)
            if (vacante.idioma && idiomaEsperado) {
                const vacLanguage = vacante.idioma.toLowerCase();
                if (vacLanguage === idiomaEsperado || idiomaEsperado === 'ambos' || vacLanguage === 'ambos') {
                    score += 5;
                }
            }

            // Evaluador de Ubicación (4 pts)
            if (vacante.ubicacion && ubicacionEsperada && (vacante.ubicacion.toLowerCase().includes(ubicacionEsperada) || ubicacionEsperada.includes(vacante.ubicacion.toLowerCase()))) {
                score += 4;
            }

            // Evaluador de Cultura Laboral (3 pts)
            const culturaEmpresa = vacante.reclutadores?.cultura_laboral?.toLowerCase() || '';
            if (culturaEmpresa && culturaEsperada && culturaEmpresa === culturaEsperada) {
                score += 3;
            }

            // Evaluador de Tipo de Empresa (3 pts)
            const tipoEmpresa = vacante.reclutadores?.tipo_empresa?.toLowerCase() || '';
            if (tipoEmpresa && tipoEmpresaEsperado && tipoEmpresa === tipoEmpresaEsperado) {
                score += 3;
            }

            const scoreRedondeado = Math.round(score);

            // Filtrar estricto: Solo incluir si el match es del 50% para arriba
            if (scoreRedondeado >= 50) {
                recomendaciones.push({
                    ...vacante,
                    empresa: vacante.reclutadores?.nombre_empresa,
                    skills: skillsVacante,
                    score: scoreRedondeado
                });
            }
        }

        // Ordenar de mayor a menor score y devolver las mejores 20
        return { principal: recomendaciones.sort((a, b) => b.score - a.score).slice(0, 20) };
    }
}

module.exports = new MatchingVacantesService();