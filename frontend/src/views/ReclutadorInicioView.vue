<template>
  <div class="max-w-6xl mx-auto py-8 px-4">
    <div class="flex justify-between items-end mb-10">
      <div>
        <h2 class="text-3xl font-extrabold text-cerceta tracking-tight">Panel de Reclutador</h2>
        <p class="text-cerceta-light mt-1">{{ nombreEmpresa }} • {{ vacantesRecientes.length }} Vacantes en Seguimiento</p>
      </div>
      <router-link 
        to="/reclutador/publicar" 
        class="bg-matcha text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-matcha/20 hover:bg-matcha-dark transition-colors flex items-center gap-2"
      >
        <span>+</span> Publicar Nueva Vacante
      </router-link>
    </div>

    <div class="mb-8 flex flex-wrap gap-4">
       <router-link to="/reclutador/listas" class="px-5 py-2.5 bg-white border-2 border-matcha text-matcha rounded-xl font-bold hover:bg-fondo transition-all shadow-sm flex items-center gap-2">
         <span>📋</span> Gestionar Mis Vacantes
       </router-link>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div class="lg:col-span-2 space-y-6">
        <h3 class="text-xl font-extrabold text-cerceta mb-4 flex items-center gap-2">
          <span class="w-2 h-6 bg-matcha rounded-full"></span> Vacantes Recientes
        </h3>

        <div v-if="cargandoVacantes" class="p-6 text-center text-cerceta-light animate-pulse">
            Cargando vacantes...
        </div>

        <div v-else-if="vacantesRecientes.length === 0" class="bg-fondo p-10 rounded-2xl text-center border border-dashed border-cerceta-light/30">
             <p class="text-3xl mb-3">📁</p>
             <p class="text-cerceta-light">No tienes vacantes activas.</p>
        </div>

        <div v-else v-for="vacante in vacantesRecientes" :key="vacante.id_vacante" class="bg-white p-6 rounded-2xl shadow-suave border border-matcha/10 hover:border-matcha/30 transition-colors">
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center gap-3">
              <h3 class="text-xl font-bold text-cerceta">{{ vacante.titulo }}</h3>
              <span class="bg-matcha/10 text-matcha-dark text-xs font-bold px-3 py-1 rounded-full">Activa</span>
            </div>
          </div>
          
          <p class="text-sm text-cerceta-light mb-6">Sueldo: ${{ vacante.sueldo || vacante.salario }}</p>
          
          <div class="flex items-center justify-between border-t border-fondo pt-4">
            <span class="text-xs text-cerceta-light font-medium uppercase">Publicada el: {{ new Date(vacante.fecha_creacion || vacante.created_at).toLocaleDateString() }}</span>
            <router-link :to="`/swiper/${vacante.id_vacante}?titulo=${vacante.titulo}`" class="text-sm font-bold text-matcha hover:underline">
                Gestionar Candidatos →
            </router-link>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1">
        <div class="bg-white rounded-2xl shadow-suave border border-matcha/5 p-6 h-fit sticky top-24">
          <h3 class="text-lg font-bold text-cerceta mb-6">Próximas Entrevistas</h3>
          
          <div v-if="cargandoEntrevistas" class="text-center text-cerceta-light text-sm animate-pulse">Cargando agenda...</div>
          
          <div v-else-if="entrevistasHoy.length === 0" class="text-center py-6 text-cerceta-light text-sm bg-fondo rounded-xl border border-dashed border-cerceta/20">
             Sin entrevistas programadas.
          </div>

          <div v-else class="space-y-5">
            <div v-for="e in entrevistasHoy" :key="e.id_entrevista" class="flex gap-4 items-center group cursor-pointer transition-transform hover:translate-x-1">
              
              <div class="bg-matcha/10 text-matcha-dark rounded-xl p-2 text-center min-w-[3.5rem] group-hover:bg-matcha group-hover:text-white transition-colors">
                <span class="block text-lg font-black leading-none">{{ obtenerDia(e.fecha) }}</span>
                <span class="block text-xs uppercase font-bold mt-1">{{ obtenerMes(e.fecha) }}</span>
              </div>
              
              <div>
                <h4 class="text-sm font-bold text-cerceta group-hover:text-matcha transition-colors">
                  {{ e.postulaciones?.candidatos?.nombre_completo || 'Candidato' }}
                </h4>
                <p class="text-xs text-cerceta-light font-medium mt-0.5">
                  {{ obtenerHora(e.fecha, e.hora) }}
                </p>
                <a v-if="e.link_reunion" :href="e.link_reunion" target="_blank" class="text-xs text-matcha font-bold hover:underline mt-1 block">
                  Ir a reunión →
                </a>
              </div>
            </div>
          </div>
          
          <router-link 
          to="/calendario" 
          class="block text-center w-full mt-6 py-2 border-2 border-dashed border-cerceta/20 text-cerceta-light rounded-xl text-sm font-bold hover:border-cerceta hover:text-cerceta transition-colors"
        >
          Ver Calendario Completo
        </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const vacantesRecientes = ref([])
const entrevistasHoy = ref([])
const nombreEmpresa = ref(localStorage.getItem('nombreUsuario') || 'Empresa')
const cargandoVacantes = ref(true)
const cargandoEntrevistas = ref(true)

const URL_API = import.meta.env.VITE_API_URL
const idReclutador = localStorage.getItem('usuarioId')

onMounted(async () => {
    if(!idReclutador) return
    
    // Cargar 5 vacantes más recientes
    try {
        const res = await fetch(`${URL_API}/api/vacantes/recientes/${idReclutador}`)
        if(res.ok) vacantesRecientes.value = await res.json()
    } catch (e) { console.error(e) } finally { cargandoVacantes.value = false }

    // Cargar Entrevistas
    try {
        const res = await fetch(`${URL_API}/api/entrevistas/calendario/${idReclutador}`)
        if(res.ok) entrevistasHoy.value = await res.json()
    } catch (e) { console.error(e) } finally { cargandoEntrevistas.value = false }
})

// ── FUNCIONES AUXILIARES PARA FORMATEAR LA FECHA Y HORA ──

// Extraemos el día usando T12:00:00 para evitar desfasajes por zona horaria al leer "YYYY-MM-DD"
const obtenerDia = (fecha) => {
    if (!fecha) return '';
    return new Date(`${fecha}T12:00:00`).getDate();
}

// Extraemos el nombre del mes
const obtenerMes = (fecha) => {
    if (!fecha) return '';
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return meses[new Date(`${fecha}T12:00:00`).getMonth()];
}

// Combinamos fecha y hora para mostrarla en formato 12 hrs (ej. "02:30 PM")
const obtenerHora = (fecha, hora) => {
    if (!fecha || !hora) return '';
    return new Date(`${fecha}T${hora}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
</script>