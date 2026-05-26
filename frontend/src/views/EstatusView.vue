<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <h2 class="text-3xl font-extrabold text-cerceta mb-10 tracking-tight">Mis Postulaciones</h2>

    <div v-if="cargando" class="text-center py-10 text-cerceta-light animate-pulse font-medium">
      Cargando postulaciones...
    </div>

    <div v-else-if="postulaciones.length === 0" class="bg-white p-10 rounded-2xl text-center border border-dashed border-cerceta/20 shadow-suave">
      <p class="text-cerceta-light mb-4">No tienes postulaciones activas.</p>
      <router-link to="/swipec" class="bg-matcha text-white px-6 py-3 rounded-xl font-bold hover:bg-matcha-dark transition-colors inline-block">
        Explorar Vacantes
      </router-link>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="post in postulaciones" 
        :key="post.id_postulacion" 
        :class="['bg-white p-6 rounded-2xl shadow-suave flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group transition-all', obtenerBordeCard(post.estatus_swipe)]"
      >
        <div>
          <h4 
            :class="['text-lg font-bold', post.estatus_swipe === 'dislike' || post.estatus_swipe === 'rechazado' ? 'text-cerceta/60 line-through decoration-acento-tierra/30' : 'text-cerceta']"
          >
            {{ post.vacantes?.titulo || 'Vacante no disponible' }}
          </h4>
          
          <p class="text-sm text-cerceta-light mt-1">
            {{ post.vacantes?.reclutadores?.nombre_empresa || 'Empresa confidencial' }}
          </p>

          <p v-if="post.estatus_swipe === 'rechazado'" class="text-sm text-acento-morado font-medium mt-2">
            💡 Revisa tu Retroalimentación para ver detalles.
          </p>
        </div>

        <div class="flex flex-row items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0">
          <div class="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              v-if="post.estatus_swipe === 'like'"
              @click="cambiarEstatusCandidato(post, 'dislike')"
              class="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors border-0 cursor-pointer"
            >
              Descartar
            </button>

            <button 
              v-if="post.estatus_swipe === 'dislike'"
              @click="cambiarEstatusCandidato(post, 'like')"
              class="text-xs font-bold text-white bg-matcha hover:bg-matcha-dark px-3 py-1.5 rounded-lg transition-colors border-0 cursor-pointer"
            >
              Postularme de nuevo
            </button>
          </div>

          <div :class="['px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 select-none', obtenerEstiloEstatus(post.estatus_swipe)]">
            <span v-if="post.estatus_swipe === 'like'" class="w-2 h-2 rounded-full bg-current animate-pulse"></span>
            {{ etiquetaEstatus(post.estatus_swipe) }}
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const postulaciones = ref([])
const cargando = ref(true)

const URL_BASE_API = import.meta.env.VITE_API_URL
const candidato_id = localStorage.getItem('usuarioId')

onMounted(async () => {
  if (!candidato_id) {
    cargando.value = false
    return
  }
  await cargarPostulaciones()
})

const cargarPostulaciones = async () => {
  cargando.value = true
  try {
    const resp = await fetch(`${URL_BASE_API}/api/postulaciones/mis-postulaciones/${candidato_id}`)
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    postulaciones.value = await resp.json()
  } catch (e) {
    console.error('Error al cargar postulaciones:', e)
  } finally {
    cargando.value = false
  }
}

const cambiarEstatusCandidato = async (post, nuevoEstado) => {
  try {
    const resp = await fetch(`${URL_BASE_API}/api/interacciones/swipe-candidato`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_candidato: candidato_id,
        id_vacante: post.id_vacante,
        estado: nuevoEstado
      })
    })

    const data = await resp.json()

    if (!resp.ok) {
      alert(data.mensaje || 'No se puede modificar una postulación con match definitivo.')
      await cargarPostulaciones() 
      return
    }

    post.estatus_swipe = nuevoEstado
  } catch (e) {
    console.error('Error al actualizar interacción:', e)
  }
}

const etiquetaEstatus = (estatus) => {
  const mapa = {
    like: 'Revisando',         
    match: 'Match ✓',          
    rechazado: 'Cerrado',      
    dislike: 'Descartada',     
    entrevista: 'Entrevista'
  }
  return mapa[estatus] || estatus || '—'
}

const obtenerEstiloEstatus = (estatus) => {
  const estilos = {
    like: 'bg-cerceta-light/10 text-cerceta', 
    match: 'bg-matcha text-white',            
    rechazado: 'text-acento-tierra bg-transparent', 
    dislike: 'bg-gray-100 text-gray-400 border border-gray-200',
    entrevista: 'bg-matcha text-white'
  }
  return estilos[estatus] || 'bg-fondo text-cerceta-light'
}

const obtenerBordeCard = (estatus) => {
  const bordes = {
    like: 'border border-cerceta/10 hover:border-cerceta-light',
    match: 'border border-matcha/30 opacity-100',
    rechazado: 'border border-gray-100 opacity-70',
    dislike: 'border border-gray-100 opacity-60 bg-gray-50/50',
    entrevista: 'border border-matcha/30 opacity-100'
  }
  return bordes[estatus] || 'border-gray-100 hover:border-gray-200'
}
</script>