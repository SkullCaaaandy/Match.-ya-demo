<template>
  <div class="max-w-6xl mx-auto py-8 px-4">
    <div class="mb-10 text-center md:text-left">
      <h2 class="text-4xl font-extrabold text-cerceta tracking-tight">Mi Agenda</h2>
      <p class="text-cerceta-light mt-1">Gestiona tus entrevistas y conexiones para este mes</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div class="lg:col-span-2 bg-white rounded-2xl sm:rounded-[2.5rem] shadow-suave border border-matcha/5 p-4 sm:p-8">
        
        <div class="flex justify-between items-center mb-8">
          <h3 class="text-2xl font-bold text-cerceta capitalize">
            {{ nombreMesActual }} <span class="text-matcha">{{ anioActual }}</span>
          </h3>
          <div class="flex gap-2">
            <button @click="mesAnterior" class="p-2 rounded-xl hover:bg-fondo text-cerceta transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button @click="mesSiguiente" class="p-2 rounded-xl hover:bg-fondo text-cerceta transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-7 gap-1">
          <div v-for="d in diasSemana" :key="d" class="text-center text-[11px] font-black text-cerceta-light uppercase tracking-widest mb-4">
            {{ d }}
          </div>

          <div v-for="v in espaciosVacios" :key="'v'+v" class="aspect-square"></div>

          <div 
            v-for="dia in diasDelMes" 
            :key="dia" 
            @click="seleccionarDia(dia)"
            class="aspect-square relative flex flex-col items-center justify-center cursor-pointer rounded-2xl transition-all group"
            :class="[
              esDiaSeleccionado(dia) ? 'bg-matcha text-white shadow-lg shadow-matcha/30' : 'hover:bg-fondo',
              esHoy(dia) ? 'border-2 border-matcha/30' : ''
            ]"
          >
            <span class="text-sm sm:text-lg font-bold" :class="esDiaSeleccionado(dia) ? '' : 'text-cerceta'">{{ dia }}</span>
            
            <div 
              v-if="tieneEntrevista(dia)" 
              class="w-1.5 h-1.5 rounded-full mt-1"
              :class="esDiaSeleccionado(dia) ? 'bg-white' : 'bg-matcha'"
            ></div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1">
        <div class="bg-white rounded-2xl sm:rounded-[2.5rem] shadow-suave border border-matcha/5 p-6 h-full lg:sticky lg:top-24">
          <h4 class="text-lg font-bold text-cerceta mb-6 flex items-center gap-2">
           {{ fechaLargaSeleccionada }}
          </h4>

          <div v-if="cargando" class="text-center py-10 animate-pulse text-cerceta-light">Cargando agenda...</div>

          <div v-else-if="entrevistasDelDia.length === 0" class="flex flex-col items-center justify-center py-12 text-center opacity-60">
            <p class="text-4xl mb-4">☕</p>
            <p class="text-sm font-medium text-cerceta-light">No hay entrevistas para este día.</p>
          </div>

          <div v-else class="space-y-4">
            <div 
              v-for="e in entrevistasDelDia" 
              :key="e.id_entrevista" 
              class="p-4 rounded-2xl bg-fondo border-l-4 border-matcha hover:translate-x-1 transition-transform"
            >
              <div class="flex justify-between items-start mb-2">
                <span class="text-xs font-black text-matcha uppercase tracking-wider">{{ e.horaFormateada }}</span>
                <span v-if="e.confirmada" class="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-md font-bold">Confirmada</span>
              </div>
              
              <h5 class="font-bold text-cerceta leading-tight mb-1">
                {{ esReclutador ? e.postulaciones?.candidatos?.nombre_completo : e.postulaciones?.vacantes?.titulo }}
              </h5>
              
              <p class="text-xs text-cerceta-light mb-3">
                {{ esReclutador ? e.postulaciones?.vacantes?.titulo : e.postulaciones?.vacantes?.reclutadores?.nombre_empresa }}
              </p>

              <a 
                v-if="e.link_reunion" 
                :href="e.link_reunion" 
                target="_blank" 
                class="inline-flex items-center gap-2 text-xs font-bold text-white bg-matcha px-4 py-2 rounded-xl hover:bg-matcha-dark transition-colors"
              >
                <span>📹</span> Unirse a la reunión
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const URL_API = import.meta.env.VITE_API_URL;
const idUsuario = localStorage.getItem('usuarioId');
const rolUsuario = localStorage.getItem('rolUsuario');
const esReclutador = rolUsuario === 'reclutador';

// ── ESTADO DEL CALENDARIO ──
const hoy = new Date();
const fechaActual = ref(new Date()); // Controla el mes que vemos
const diaSeleccionado = ref(new Date()); // El día que el usuario clickeó
const todasLasEntrevistas = ref([]);
const cargando = ref(true);

const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// ── LÓGICA DE FECHAS ──
const anioActual = computed(() => fechaActual.value.getFullYear());
const nombreMesActual = computed(() => {
  return fechaActual.value.toLocaleString('es-MX', { month: 'long' });
});

const espaciosVacios = computed(() => {
  const primerDia = new Date(fechaActual.value.getFullYear(), fechaActual.value.getMonth(), 1);
  return primerDia.getDay();
});

const diasDelMes = computed(() => {
  const ultimoDia = new Date(fechaActual.value.getFullYear(), fechaActual.value.getMonth() + 1, 0);
  return ultimoDia.getDate();
});

const fechaLargaSeleccionada = computed(() => {
  return diaSeleccionado.value.toLocaleDateString('es-MX', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  });
});

// ── NAVEGACIÓN ──
const mesAnterior = () => {
  fechaActual.value = new Date(fechaActual.value.getFullYear(), fechaActual.value.getMonth() - 1, 1);
};

const mesSiguiente = () => {
  fechaActual.value = new Date(fechaActual.value.getFullYear(), fechaActual.value.getMonth() + 1, 1);
};

const seleccionarDia = (dia) => {
  diaSeleccionado.value = new Date(fechaActual.value.getFullYear(), fechaActual.value.getMonth(), dia);
};

// ── HELPERS VISUALES ──
const esHoy = (dia) => {
  return dia === hoy.getDate() && 
         fechaActual.value.getMonth() === hoy.getMonth() && 
         fechaActual.value.getFullYear() === hoy.getFullYear();
};

const esDiaSeleccionado = (dia) => {
  return dia === diaSeleccionado.value.getDate() && 
         fechaActual.value.getMonth() === diaSeleccionado.value.getMonth() && 
         fechaActual.value.getFullYear() === diaSeleccionado.value.getFullYear();
};

const tieneEntrevista = (dia) => {
  const fechaStr = formatearFechaBusqueda(dia);
  return todasLasEntrevistas.value.some(e => e.fecha === fechaStr);
};

const formatearFechaBusqueda = (dia) => {
  const m = fechaActual.value.getMonth() + 1;
  const mes = m < 10 ? '0' + m : m;
  const d = dia < 10 ? '0' + dia : dia;
  return `${fechaActual.value.getFullYear()}-${mes}-${d}`;
};

// ── FILTRAR ENTREVISTAS POR DÍA SELECCIONADO ──
const entrevistasDelDia = computed(() => {
  const fechaStr = `${diaSeleccionado.value.getFullYear()}-${String(diaSeleccionado.value.getMonth() + 1).padStart(2, '0')}-${String(diaSeleccionado.value.getDate()).padStart(2, '0')}`;
  
  return todasLasEntrevistas.value
    .filter(e => e.fecha === fechaStr)
    .map(e => ({
      ...e,
      horaFormateada: new Date(`2000-01-01T${e.hora}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }))
    .sort((a, b) => a.hora.localeCompare(b.hora));
});

// ── CARGA DE DATOS ──
const cargarAgenda = async () => {
  cargando.value = true;
  try {
    const endpoint = esReclutador 
      ? `${URL_API}/api/entrevistas/calendario/${idUsuario}`
      : `${URL_API}/api/entrevistas/candidato/${idUsuario}`;
    
    const res = await fetch(endpoint);
    if (res.ok) {
      todasLasEntrevistas.value = await res.json();
    }
  } catch (e) {
    console.error("Error cargando agenda:", e);
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
  cargarAgenda();
});
</script>

<style scoped>
/* Estilos extra para la estética de la app */
.aspect-square {
  aspect-ratio: 1 / 1;
}

/* Scroll bar estética para la lista de la derecha */
.lg\:col-span-1 > div {
  max-height: 600px;
  overflow-y: auto;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #f1f5f9;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #2a6b6d;
}
</style>