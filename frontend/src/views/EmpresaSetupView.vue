<template>
  <div class="min-h-screen bg-fondo flex flex-col items-center justify-center py-12 px-4">

    <!-- Stepper de progreso -->
    <div class="flex items-center gap-3 mb-8">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-matcha/20 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-matcha" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span class="text-sm font-semibold text-matcha hidden sm:inline">Tu cuenta</span>
      </div>
      <div class="w-10 h-0.5 bg-matcha/30 rounded"></div>
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-matcha flex items-center justify-center shadow-md shadow-matcha/30">
          <span class="text-white text-sm font-bold">2</span>
        </div>
        <span class="text-sm font-bold text-cerceta hidden sm:inline">Tu empresa</span>
      </div>
      <div class="w-10 h-0.5 bg-cerceta-light/30 rounded"></div>
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-cerceta-light/20 flex items-center justify-center">
          <span class="text-cerceta-light text-sm font-bold">3</span>
        </div>
        <span class="text-sm font-semibold text-cerceta-light hidden sm:inline">Dashboard</span>
      </div>
    </div>

    <div class="bg-white rounded-[2rem] shadow-suave w-full max-w-xl border border-matcha/5">

      <!-- Header -->
      <div class="px-6 sm:px-10 pt-8 sm:pt-10 pb-6 border-b border-fondo">
        <div class="flex items-center gap-4 mb-2">
          <div class="w-12 h-12 rounded-2xl bg-matcha/10 flex items-center justify-center text-2xl">🏢</div>
          <div>
            <h2 class="text-2xl font-extrabold text-cerceta tracking-tight">Perfil de tu Empresa</h2>
            <p class="text-sm text-cerceta-light mt-0.5">Así los candidatos ideales llegarán a ti</p>
          </div>
        </div>
      </div>

      <form @submit.prevent="guardarEmpresa" class="px-6 sm:px-10 py-6 sm:py-8 space-y-6">

        <!-- Nombre de la empresa -->
        <div>
          <label class="block text-xs font-semibold text-cerceta uppercase tracking-wide mb-1.5">
            Nombre de la Empresa
          </label>
          <input
            v-model="empresa.nombre_empresa"
            type="text"
            placeholder="Ej. Code Divas, Grupo Salinas…"
            class="w-full px-4 py-3 rounded-xl bg-fondo border border-transparent focus:border-matcha-light focus:bg-white focus:ring-4 focus:ring-matcha/10 outline-none transition-all text-cerceta"
            required
          />
        </div>

        <!-- Fila: Tipo de empresa + Alcance -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <!-- Tipo de empresa -->
          <div>
            <label class="block text-xs font-semibold text-cerceta uppercase tracking-wide mb-1.5">
              Tipo de Empresa
            </label>
            <select
              v-model="empresa.tipo_empresa"
              class="w-full px-4 py-3 rounded-xl bg-fondo border border-transparent focus:border-matcha-light focus:bg-white focus:ring-4 focus:ring-matcha/10 outline-none transition-all text-cerceta"
              required
            >
              <option value="" disabled>Selecciona…</option>
              <option>Startup</option>
              <option>Corporativo</option>
              <option>Agencia</option>
              <option>PYME</option>
              <option>Gobierno</option>
            </select>
          </div>

          <!-- Alcance nacional / internacional -->
          <div>
            <label class="block text-xs font-semibold text-cerceta uppercase tracking-wide mb-1.5">
              Alcance
            </label>
            <select
              v-model="empresa.alcance"
              class="w-full px-4 py-3 rounded-xl bg-fondo border border-transparent focus:border-matcha-light focus:bg-white focus:ring-4 focus:ring-matcha/10 outline-none transition-all text-cerceta"
              required
            >
              <option value="" disabled>Selecciona…</option>
              <option>Nacional</option>
              <option>Internacional</option>
            </select>
          </div>

        </div>

        <!-- Rubro / industria -->
        <div>
          <label class="block text-xs font-semibold text-cerceta uppercase tracking-wide mb-1.5">
            Rubro / Industria
          </label>
          <select
            v-model="empresa.rubro"
            class="w-full px-4 py-3 rounded-xl bg-fondo border border-transparent focus:border-matcha-light focus:bg-white focus:ring-4 focus:ring-matcha/10 outline-none transition-all text-cerceta"
            required
          >
            <option value="" disabled>Selecciona la industria…</option>
            <option>Tecnología</option>
            <option>Marketing y Publicidad</option>
            <option>Salud</option>
            <option>Educación</option>
            <option>Finanzas</option>
            <option>Manufactura</option>
            <option>Retail y Comercio</option>
            <option>Logística y Transporte</option>
            <option>Construcción</option>
            <option>Medios y Entretenimiento</option>
            <option>Consultoría</option>
            <option>Otro</option>
          </select>
        </div>

        <!-- Cultura laboral (chips) -->
        <div>
          <label class="block text-xs font-semibold text-cerceta uppercase tracking-wide mb-2">
            Cultura Laboral
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="opcion in opcionesCultura"
              :key="opcion"
              type="button"
              @click="empresa.cultura_laboral = opcion"
              :class="empresa.cultura_laboral === opcion
                ? 'bg-matcha text-white shadow-md shadow-matcha/30'
                : 'bg-fondo text-cerceta hover:bg-matcha/10 hover:text-matcha'"
              class="px-4 py-2 rounded-xl text-sm font-semibold transition-all border border-transparent"
            >
              {{ opcion }}
            </button>
          </div>
          <p v-if="intentoGuardar && !empresa.cultura_laboral" class="text-red-400 text-xs mt-1.5">
            Selecciona una cultura laboral
          </p>
        </div>

        <!-- Botón guardar -->
        <button
          type="submit"
          :disabled="cargando"
          class="w-full py-3.5 mt-2 bg-matcha text-white rounded-xl font-bold text-lg shadow-lg shadow-matcha/30 hover:bg-matcha-dark hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg v-if="cargando" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <span>{{ cargando ? 'Guardando…' : 'Completar Registro →' }}</span>
        </button>

        <p v-if="errorMensaje" class="text-red-400 text-sm text-center">{{ errorMensaje }}</p>

      </form>
    </div>

    <!-- Toast -->
    <div
      v-if="toast.show"
      class="fixed bottom-8 right-8 bg-cerceta text-white px-6 py-3 rounded-xl shadow-lg text-sm font-medium transition-all"
    >
      {{ toast.message }}
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const opcionesCultura = ['Relajada', 'Alta exigencia', 'Trabajo en equipo', 'Autónomo']

const empresa = ref({
  nombre_empresa:  localStorage.getItem('nombreEmpresa') || '',
  tipo_empresa:    '',
  alcance:         '',
  rubro:           '',
  cultura_laboral: ''
})

const cargando       = ref(false)
const intentoGuardar = ref(false)
const errorMensaje   = ref('')
const toast          = ref({ show: false, message: '' })

const mostrarToast = (msg) => {
  toast.value = { show: true, message: msg }
  setTimeout(() => { toast.value.show = false }, 2500)
}

const guardarEmpresa = async () => {
  intentoGuardar.value = true
  errorMensaje.value   = ''

  if (!empresa.value.cultura_laboral) return

  const idReclutador = localStorage.getItem('usuarioId')
  if (!idReclutador) { router.push('/login'); return }

  cargando.value = true
  try {
    const URL_BASE_API = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const respuesta = await fetch(`${URL_BASE_API}/api/reclutadores/${idReclutador}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(empresa.value)
    })

    const datos = await respuesta.json()
    if (!respuesta.ok) {
      errorMensaje.value = datos.mensaje || 'Error al guardar el perfil.'
      return
    }

    localStorage.setItem('nombreEmpresa', empresa.value.nombre_empresa)
    localStorage.setItem('empresa_configurada', 'si')

    mostrarToast('¡Empresa registrada! Bienvenido a Match-Ya ✨')
    setTimeout(() => { router.push('/reclutador') }, 1800)

  } catch (e) {
    console.error(e)
    errorMensaje.value = 'Error de conexión con el servidor.'
  } finally {
    cargando.value = false
  }
}
</script>