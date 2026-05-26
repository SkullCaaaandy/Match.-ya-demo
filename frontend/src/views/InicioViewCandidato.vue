<template>
  <div class="max-w-5xl mx-auto space-y-6">

    <!-- Tarjeta de bienvenida + toggle de búsqueda activa -->
    <div class="bg-white rounded-[2rem] p-6 md:p-8 shadow-suave border border-matcha/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-transform hover:-translate-y-1">
      <div>
        <h2 class="text-3xl font-extrabold text-cerceta tracking-tight">
          Hola, {{ cargandoPerfil ? '...' : nombreCandidato }} 👋
        </h2>
        <p class="text-cerceta-light font-medium mt-1">Bienvenido de vuelta</p>
      </div>

      <div class="flex items-center space-x-3 bg-matcha/10 px-4 py-2.5 rounded-xl">
        <span class="text-sm font-semibold text-matcha-dark uppercase tracking-wide">Búsqueda Activa</span>
        <button
          @click="toggleBusquedaActiva"
          :class="busquedaActiva ? 'bg-matcha' : 'bg-gray-300'"
          :disabled="actualizandoToggle"
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50"
        >
          <span
            :class="busquedaActiva ? 'translate-x-6' : 'translate-x-1'"
            class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
          />
        </button>
      </div>
    </div>

    <!-- Botón para explorar vacantes -->
    <div class="bg-white rounded-[2rem] p-6 md:p-8 shadow-suave border border-matcha/5 flex flex-col md:flex-row justify-between items-center gap-6">
      <div class="flex items-center gap-6">
        <div class="w-16 h-16 rounded-full bg-matcha/10 flex items-center justify-center text-matcha text-3xl">
          🔍
        </div>
        <div>
          <h3 class="text-xl font-bold text-cerceta tracking-tight">Explorar Nuevas Vacantes</h3>
          <p class="text-sm text-cerceta-light font-medium mt-1">Encuentra oportunidades que coincidan con tu perfil.</p>
        </div>
      </div>
      <router-link to="/swipec" class="w-full md:w-auto px-8 py-3 bg-matcha text-white font-bold rounded-xl hover:bg-matcha-dark transition-colors text-center flex items-center justify-center gap-2">
        Ir a Explorar
      </router-link>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- Próximas entrevistas -->
      <div class="lg:col-span-1 bg-white rounded-[2rem] p-6 shadow-suave border border-matcha/5 flex flex-col">
        <h3 class="text-lg font-bold text-cerceta mb-4 flex items-center gap-2">
           Próximas Entrevistas
        </h3>

        <div v-if="cargandoEntrevistas" class="flex-grow flex items-center justify-center min-h-[200px]">
          <p class="text-sm text-cerceta-light animate-pulse">Cargando agenda...</p>
        </div>

        <div v-else-if="proximasEntrevistas.length === 0" class="flex-grow flex flex-col items-center justify-center p-6 bg-fondo rounded-2xl border border-dashed border-cerceta-light/30 text-center min-h-[200px]">
          <p class="text-3xl mb-2">🗓️</p>
          <p class="text-sm text-cerceta-light">No tienes entrevistas agendadas por el momento.</p>
        </div>

        <!-- entrevista.postulaciones.vacantes porque la ruta en BD es:
             entrevistas → postulaciones → vacantes → reclutadores -->
        <ul v-else class="space-y-3 flex-grow">
          <li
            v-for="entrevista in proximasEntrevistas"
            :key="entrevista.id_entrevista"
            class="p-3 rounded-xl bg-fondo flex flex-col gap-1"
          >
            <p class="font-bold text-cerceta text-sm">
              {{ entrevista.postulaciones?.vacantes?.titulo || 'Entrevista' }}
            </p>
            <p class="text-xs text-cerceta-light">
              {{ entrevista.postulaciones?.vacantes?.reclutadores?.nombre_empresa }}
            </p>
            <!-- fecha (date) y hora (time) son columnas separadas en la BD -->
            <p class="text-xs font-semibold text-matcha mt-1">
              {{ formatearFechaHora(entrevista.fecha, entrevista.hora) }}
            </p>
            <a
              v-if="entrevista.link_reunion"
              :href="entrevista.link_reunion"
              target="_blank"
              class="text-xs text-matcha hover:underline"
            >
              Unirse a reunión →
            </a>
          </li>
        </ul>
      </div>

      <!-- Actividad Reciente -->
      <div class="lg:col-span-2 bg-white rounded-[2rem] p-6 shadow-suave border border-matcha/5 flex flex-col">
        <div class="flex justify-between items-center mb-4 border-b border-fondo pb-4">
          <h3 class="text-lg font-bold text-cerceta">Actividad Reciente</h3>
          <router-link to="/estatus" class="text-sm font-bold text-matcha hover:text-matcha-dark hover:underline flex items-center gap-1">
            Ver todas las postulaciones →
          </router-link>
        </div>

        <div v-if="cargandoPostulaciones" class="flex-grow flex items-center justify-center min-h-[150px]">
          <p class="text-sm text-cerceta-light animate-pulse">Cargando actividad...</p>
        </div>

        <div v-else-if="postulacionesRecientes.length === 0" class="flex-grow flex flex-col items-center justify-center p-6 bg-fondo rounded-2xl border border-dashed border-cerceta-light/30 text-center min-h-[150px]">
          <p class="text-3xl mb-2">📭</p>
          <p class="text-sm text-cerceta-light">Aún no te has postulado a ninguna vacante.</p>
          <router-link to="/swipec" class="mt-3 text-xs font-bold text-matcha hover:underline">
            Explorar vacantes →
          </router-link>
        </div>

        <!-- estatus_swipe es el nombre real de la columna en postulaciones
             empresa_nombre viene de vacantes → reclutadores (join) -->
        <div v-else class="space-y-3 flex-grow">
          <div
            v-for="postulacion in postulacionesRecientes"
            :key="postulacion.id_postulacion"
            class="flex items-center justify-between p-3 rounded-xl hover:bg-fondo transition-colors group"
          >
            <div class="flex items-center gap-4">
              <div
                :class="obtenerColorIniciales(postulacion.estatus_swipe)"
                class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
              >
                {{ (postulacion.vacantes?.reclutadores?.nombre_empresa || '?')[0].toUpperCase() }}
              </div>
              <div>
                <h4 class="font-bold text-cerceta text-sm group-hover:text-matcha transition-colors">
                  {{ postulacion.vacantes?.titulo || 'Puesto' }}
                </h4>
                <p class="text-xs text-cerceta-light">
                  {{ postulacion.vacantes?.reclutadores?.nombre_empresa }}
                </p>
              </div>
            </div>
            <span
              :class="obtenerEstiloEstatus(postulacion.estatus_swipe)"
              class="px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5"
            >
              <span
                v-if="postulacion.estatus_swipe === 'pendiente'"
                class="w-1.5 h-1.5 rounded-full bg-current animate-pulse"
              ></span>
              {{ etiquetaEstatus(postulacion.estatus_swipe) }}
            </span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Estado reactivo
const nombreCandidato        = ref('')
const busquedaActiva         = ref(true)
const postulacionesRecientes = ref([])
const proximasEntrevistas    = ref([])

const cargandoPerfil         = ref(true)
const cargandoPostulaciones  = ref(true)
const cargandoEntrevistas    = ref(true)
const actualizandoToggle     = ref(false)

// Configuración
const URL_BASE_API = import.meta.env.VITE_API_URL
const candidato_id = localStorage.getItem('usuarioId')

// ── onMounted ─────────────────────────────────────────────────────────────────
// IMPORTANTE: si no hay candidato_id (sesión vieja o acceso directo) hay que
// apagar los estados de carga manualmente, o quedan en "Cargando..." para siempre.
onMounted(async () => {
  if (!candidato_id) {
    nombreCandidato.value      = localStorage.getItem('nombreUsuario') || 'Candidato'
    cargandoPerfil.value       = false
    cargandoPostulaciones.value = false
    cargandoEntrevistas.value  = false
    return
  }
  await Promise.all([
    cargarPerfil(),
    cargarPostulacionesRecientes(),
    cargarEntrevistas()
  ])
})

// ── Llamadas a la API ─────────────────────────────────────────────────────────

const cargarPerfil = async () => {
  cargandoPerfil.value = true
  try {
    const resp = await fetch(`${URL_BASE_API}/api/candidatos/perfil/${candidato_id}`)
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const datos = await resp.json()
    // La tabla candidatos NO tiene titulo_profesional, solo nombre_completo y busqueda_activa
    nombreCandidato.value = datos.nombre_completo || localStorage.getItem('nombreUsuario') || 'Candidato'
    busquedaActiva.value  = datos.busqueda_activa ?? true
  } catch (e) {
    nombreCandidato.value = localStorage.getItem('nombreUsuario') || 'Candidato'
    console.error('Error al cargar perfil:', e)
  } finally {
    cargandoPerfil.value = false
  }
}

const cargarPostulacionesRecientes = async () => {
  cargandoPostulaciones.value = true
  try {
    const resp = await fetch(`${URL_BASE_API}/api/postulaciones/recientes/${candidato_id}`)
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    postulacionesRecientes.value = await resp.json()
  } catch (e) {
    console.error('Error al cargar postulaciones:', e)
  } finally {
    cargandoPostulaciones.value = false
  }
}

const cargarEntrevistas = async () => {
  cargandoEntrevistas.value = true
  try {
    const resp = await fetch(`${URL_BASE_API}/api/entrevistas/candidato/${candidato_id}`)
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    proximasEntrevistas.value = await resp.json()
  } catch (e) {
    console.error('Error al cargar entrevistas:', e)
  } finally {
    cargandoEntrevistas.value = false
  }
}

const toggleBusquedaActiva = async () => {
  if (actualizandoToggle.value) return
  actualizandoToggle.value = true
  const nuevoEstado = !busquedaActiva.value
  try {
    const resp = await fetch(`${URL_BASE_API}/api/candidatos/busqueda-activa/${candidato_id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ busqueda_activa: nuevoEstado })
    })
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const datos = await resp.json()
    busquedaActiva.value = datos.busqueda_activa
  } catch (e) {
    console.error('Error al actualizar búsqueda activa:', e)
    busquedaActiva.value = !nuevoEstado  // revertir cambio visual si falla
  } finally {
    actualizandoToggle.value = false
  }
}

// ── Helpers de presentación ───────────────────────────────────────────────────

// La BD guarda fecha (date "YYYY-MM-DD") y hora (time "HH:MM:SS") por separado
const formatearFechaHora = (fecha, hora) => {
  if (!fecha) return ''
  const cadena = hora ? `${fecha}T${hora}` : fecha
  return new Date(cadena).toLocaleString('es-MX', {
    weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit'
  })
}

// estatus_swipe es el nombre real de la columna (no "estatus")
const etiquetaEstatus = (estatus) => {
  const mapa = {
    like:      'Interesado',
    dislike:   'Rechazado',
    pendiente: 'Pendiente',
    aceptado:  'Aceptado',
    entrevista:'Entrevista'
  }
  return mapa[estatus] || estatus || '—'
}

const obtenerEstiloEstatus = (estatus) => {
  const estilos = {
    like:       'bg-matcha text-white',
    aceptado:   'bg-green-100 text-green-700',
    entrevista: 'bg-matcha text-white',
    pendiente:  'bg-cerceta-light/10 text-cerceta',
    dislike:    'text-acento-tierra'
  }
  return estilos[estatus] || 'bg-fondo text-cerceta-light'
}

const obtenerColorIniciales = (estatus) => {
  const colores = {
    like:       'bg-matcha/10 text-matcha',
    aceptado:   'bg-green-100 text-green-700',
    entrevista: 'bg-matcha/10 text-matcha',
    pendiente:  'bg-cerceta/10 text-cerceta',
    dislike:    'bg-gray-100 text-gray-400'
  }
  return colores[estatus] || 'bg-matcha/10 text-matcha'
}
</script>