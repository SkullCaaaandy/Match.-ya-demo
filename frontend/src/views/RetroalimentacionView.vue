<template>
  <div class="max-w-3xl mx-auto">
    <h2 class="text-3xl font-extrabold text-cerceta mb-2 tracking-tight">Retroalimentación</h2>
    <p class="text-cerceta-light text-sm mb-8">
      Comentarios de los reclutadores sobre tus postulaciones, para que puedas mejorar tu perfil.
    </p>

    <!-- Cargando -->
    <div v-if="cargando" class="space-y-4">
      <div v-for="i in 3" :key="i" class="bg-white p-6 rounded-2xl shadow-suave animate-pulse h-28"></div>
    </div>

    <!-- Sin feedback -->
    <div
      v-else-if="feedbacks.length === 0"
      class="flex flex-col items-center justify-center py-20 text-center"
    >
      <p class="text-5xl mb-4">🌱</p>
      <h3 class="text-xl font-bold text-cerceta mb-2">Todavía no tienes retroalimentación</h3>
      <p class="text-sm text-cerceta-light">
        Cuando un reclutador te deje comentarios, aparecerán aquí.
      </p>
    </div>

    <!-- Lista de feedbacks -->
    <div v-else class="space-y-5">
      <div
        v-for="fb in feedbacks"
        :key="fb.id_feedback"
        class="bg-white rounded-2xl shadow-suave border border-acento-morado/15 hover:border-acento-morado/35 transition-colors p-6"
      >
        <!-- Encabezado: vacante + empresa + fecha -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <div>
            <h4 class="text-base font-bold text-cerceta">
              {{ fb.postulaciones?.vacantes?.titulo || 'Vacante' }}
            </h4>
            <p class="text-sm text-cerceta-light">
              {{ fb.postulaciones?.vacantes?.reclutadores?.nombre_empresa || '—' }}
            </p>
          </div>
          <span class="text-xs text-cerceta-light/60 shrink-0 pt-1">
            {{ formatearFecha(fb.fecha_envio) }}
          </span>
        </div>

        <!-- Comentario general -->
        <div v-if="fb.comentario" class="mb-4">
          <p class="text-xs font-semibold text-cerceta-light uppercase tracking-wide mb-1">
            💬 Comentario del reclutador
          </p>
          <p class="text-sm text-cerceta leading-relaxed bg-fondo rounded-xl px-4 py-3">
            {{ fb.comentario }}
          </p>
        </div>

        <!-- Skills faltantes -->
        <div v-if="parsearSkills(fb.skills_faltantes).length > 0">
          <p class="text-xs font-semibold text-cerceta-light uppercase tracking-wide mb-2">
            🎯 Habilidades a desarrollar
          </p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in parsearSkills(fb.skills_faltantes)"
              :key="skill"
              class="px-3 py-1 bg-acento-morado/10 text-acento-morado text-xs font-semibold rounded-lg border border-acento-morado/20"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const feedbacks    = ref([])
const cargando     = ref(true)

const URL_BASE_API = import.meta.env.VITE_API_URL
const candidato_id = localStorage.getItem('usuarioId')

onMounted(async () => {
  if (!candidato_id) { cargando.value = false; return }
  await cargarFeedbacks()
})

const cargarFeedbacks = async () => {
  cargando.value = true
  try {
    const resp = await fetch(`${URL_BASE_API}/api/retroalimentaciones/candidato/${candidato_id}`)
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    feedbacks.value = await resp.json()
  } catch (e) {
    console.error('Error al cargar retroalimentaciones:', e)
  } finally {
    cargando.value = false
  }
}

const parsearSkills = (texto) => {
  if (!texto) return []
  return texto.split(',').map(s => s.trim()).filter(Boolean)
}

const formatearFecha = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}
</script>
