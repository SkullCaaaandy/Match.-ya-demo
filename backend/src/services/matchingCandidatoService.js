/* Algortimo de Dulce

class MatchingService {

 procesar(skillsVacante, candidatos, habilidades, postulados) {

   let listaPrincipal = [];
   let listaSecundaria = [];

   postulados.forEach(post => {

     const candidato = candidatos.find(
       c => c.id === post.id_candidato
     );

     if (!candidato) return;

     const skillsCandidato = habilidades.filter(
       h => h.id_candidato === candidato.id
     );

     const score = this.calcularScore(
       skillsVacante,
       skillsCandidato
     );

     const candidatoFinal = {
       ...candidato,
       id_postulacion: post.id_postulacion,
       score
     };

     if (score >= 60) {
       listaPrincipal.push(candidatoFinal);
     } else {
       listaSecundaria.push(candidatoFinal);
     }

   });

   listaPrincipal.sort((a, b) => b.score - a.score);
   listaSecundaria.sort((a, b) => b.score - a.score);

   return {
     principal: listaPrincipal,
     secundaria: listaSecundaria
   };
 }

  calcularScore(skillsVacante, skillsCandidato) {

    if (!skillsVacante.length) return 0;

    let coincidencias = 0;

    skillsVacante.forEach(req => {
      const tiene = skillsCandidato.find(
        hab => hab.id_etiqueta === req.id_etiqueta
      );

      if (tiene) coincidencias++;
    });

    let score = (coincidencias / skillsVacante.length) * 100;

    // Bonus si cumple todas
    if (coincidencias === skillsVacante.length) {
      score += 10;
    }

    if (score > 100) score = 100;

    return Math.round(score);
  }
}
module.exports = new MatchingService(); */

/*Algoritmo de Neyzer*/

const { supabase } = require('../config/db');

class MatchingCandidatoService {
    async obtenerSkillsVacante(idVacante) {
        const { data } = await supabase
            .from('vacante_etiquetas')
            .select('etiquetas(nombre)')
            .eq('id_vacante', idVacante);
        return data ? data.map(v => v.etiquetas.nombre.toLowerCase()) : [];
    }

    async obtenerPostulaciones(idVacante) {
        const { data } = await supabase
            .from('postulaciones')
            .select(`
                id_postulacion,
                estatus_swipe,
                candidatos (
                    id, nombre_completo, rol_profesional, ubicacion, descripcion, busqueda_activa,
                    candidato_habilidades(etiquetas(nombre), nivel)
                ),
                retroalimentaciones(comentario),
                entrevistas(fecha, hora, link_reunion)
            `)
            .eq('id_vacante', idVacante)
            .in('estatus_swipe', ['like', 'match', 'rechazado', 'entrevista']);
        return data || [];
    }

    calcularScore(todasMisSkills, requeridos) {
        if (requeridos.length === 0) {
            return 85;
        }
        const coincidentes = requeridos.filter(req => todasMisSkills.includes(req));
        return Math.round((coincidentes.length / requeridos.length) * 100);
    }

    formatearCandidato(post, score) {
        const candidato = post.candidatos;
        const habilidades = candidato.candidato_habilidades || [];
        const skills = habilidades.filter(h => h.nivel === 'tecnico' && h.etiquetas).map(h => h.etiquetas.nombre);
        const extras = habilidades.filter(h => h.nivel === 'adicional' && h.etiquetas).map(h => h.etiquetas.nombre);
        const entrevistaInfo = post.entrevistas?.[0] || null;

        return {
            id_postulacion: post.id_postulacion,
            nombreCompleto: candidato.nombre_completo,
            perfilProfesional: candidato.rol_profesional,
            ubicacion: candidato.ubicacion,
            descripcion: candidato.descripcion,
            skills,
            extras,
            score,
            estatus_swipe: post.estatus_swipe,
            motivoRechazo: post.retroalimentaciones?.[0]?.comentario || "Sin motivo especificado",
            entrevista: entrevistaInfo ? {
                fecha: entrevistaInfo.fecha,
                hora: entrevistaInfo.hora,
                link: entrevistaInfo.link_reunion
            } : null
        };
    }

    clasificarCandidato(post, score, buckets) {
        const candidatoFormateado = this.formatearCandidato(post, score);
        if (post.estatus_swipe === 'like') {
            buckets.pendientes.push(candidatoFormateado);
        } else if (post.estatus_swipe === 'match' || post.estatus_swipe === 'entrevista') {
            buckets.aceptados.push(candidatoFormateado);
        } else if (post.estatus_swipe === 'rechazado') {
            buckets.rechazados.push(candidatoFormateado);
        }
    }

    async migrarAWaitlistPorDesactivacion(idPostulacion) {
        try {
            const { error: errorUpdate } = await supabase
                .from('postulaciones')
                .update({ 
                    estatus_swipe: 'rechazado',
                    tipo_lista: 'descartados'
                }) 
                .eq('id_postulacion', idPostulacion);

            if (errorUpdate) {
                console.error('[matchingCandidato] Error al actualizar:', errorUpdate.message);
                return;
            }

            await supabase
                .from('retroalimentaciones')
                .delete()
                .eq('id_postulacion', idPostulacion);

            const { error: errorFeedback } = await supabase
                .from('retroalimentaciones')
                .insert([{
                    id_postulacion: idPostulacion,
                    comentario: 'Dejó de Buscar Matches'
                }]);

            if (errorFeedback) {
                console.error('[matchingCandidato] Error al insertar feedback:', errorFeedback.message);
            }
        } catch (excepcion) {
            console.error('[matchingCandidato] Error inesperado:', excepcion);
        }
    }

    async restaurarAMatchPorActivacion(idPostulacion) {
        try {
            const { error: errorUpdate } = await supabase
                .from('postulaciones')
                .update({ 
                    estatus_swipe: 'match',
                    tipo_lista: 'matches'
                }) 
                .eq('id_postulacion', idPostulacion);

            if (errorUpdate) {
                console.error('[matchingCandidato] Error al restaurar match:', errorUpdate.message);
                return;
            }

            await supabase
                .from('retroalimentaciones')
                .delete()
                .eq('id_postulacion', idPostulacion);
        } catch (excepcion) {
            console.error('[matchingCandidato] Error inesperado al restaurar match:', excepcion);
        }
    }

    async procesar(idVacante) {
        const requeridos = await this.obtenerSkillsVacante(idVacante);
        const postulaciones = await this.obtenerPostulaciones(idVacante);
        const buckets = { pendientes: [], aceptados: [], rechazados: [] };

        for (const post of postulaciones) {
            if (!post.candidatos) {
                continue;
            }

            const busquedaActiva = post.candidatos.busqueda_activa !== false;

            if (!busquedaActiva) {
                if (post.estatus_swipe === 'like') {
                    continue;
                }
                if (post.estatus_swipe === 'match' || post.estatus_swipe === 'entrevista') {
                    await this.migrarAWaitlistPorDesactivacion(post.id_postulacion);
                    post.estatus_swipe = 'rechazado';
                    post.retroalimentaciones = [{ comentario: 'Dejó de Buscar Matches' }];
                }
            } else {
                const fueDesactivadoPreviamente = post.estatus_swipe === 'rechazado' && 
                    post.retroalimentaciones?.[0]?.comentario === 'Dejó de Buscar Matches';
                
                if (fueDesactivadoPreviamente) {
                    await this.restaurarAMatchPorActivacion(post.id_postulacion);
                    post.estatus_swipe = 'match';
                    post.retroalimentaciones = [];
                }
            }

            const habilidades = post.candidatos.candidato_habilidades || [];
            const todasMisSkills = habilidades.filter(h => h.etiquetas).map(h => h.etiquetas.nombre.toLowerCase());
            const score = this.calcularScore(todasMisSkills, requeridos);

            if (score >= 50) {
                this.clasificarCandidato(post, score, buckets);
            }
        }

        const ordenarPorScore = (a, b) => { return b.score - a.score; };
        buckets.pendientes.sort(ordenarPorScore);
        buckets.aceptados.sort(ordenarPorScore);
        buckets.rechazados.sort(ordenarPorScore);

        return buckets;
    }
}

module.exports = new MatchingCandidatoService();