<template>
  <div class="min-h-screen bg-fondo flex items-center justify-center py-10 px-4">
    <div class="max-w-2xl w-full bg-white rounded-3xl shadow-suave p-8 border border-matcha/5">

      <div class="mb-8">
        <router-link to="/reclutador" class="text-xs font-bold text-matcha hover:underline uppercase tracking-widest">
          ← Panel de Reclutador
        </router-link>
        <h2 class="text-3xl font-black text-cerceta mt-2 tracking-tighter">Nueva Vacante</h2>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">

        <!-- Nombre del puesto -->
        <div>
          <label class="label-style">Nombre del puesto *</label>
          <input v-model="form.titulo" type="text"
            placeholder="Ej: Desarrolladora Frontend, Enfermera Quirúrgica, Diseñadora Gráfica"
            class="input-style" required/>
        </div>

        <!-- Modalidad -->
        <div>
          <label class="label-style">Modalidad</label>
          <select v-model="form.modalidad" class="input-style cursor-pointer">
            <option>Híbrido</option>
            <option>Remoto</option>
            <option>Presencial</option>
          </select>
        </div>

        <!-- Contratación, Nivel e Idioma en grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="label-style">Tipo de contratación</label>
            <select v-model="form.horario" class="input-style cursor-pointer" required>
              <option value="" disabled>Selecciona…</option>
              <option>Tiempo completo</option>
              <option>Medio tiempo</option>
              <option>Contrato</option>
              <option>Becario</option>
            </select>
          </div>
          <div>
            <label class="label-style">Nivel del perfil</label>
            <select v-model="form.nivel_puesto" class="input-style cursor-pointer" required>
              <option value="" disabled>Selecciona…</option>
              <option>Junior</option>
              <option>Mid</option>
              <option>Senior</option>
            </select>
          </div>
          <div>
            <label class="label-style">Idioma</label>
            <select v-model="form.idioma" class="input-style cursor-pointer" required>
              <option value="" disabled>Selecciona…</option>
              <option>Español</option>
              <option>Inglés</option>
              <option>Ambos</option>
            </select>
          </div>
        </div>

        <!-- Ubicación: Estado → Ciudad -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="label-style">Estado</label>
            <select v-model="form.estado" class="input-style cursor-pointer" @change="form.ciudad = ''">
              <option value="">— Selecciona un estado —</option>
              <option value="Remoto / Home office">Remoto / Home office</option>
              <option v-for="est in estadosMexico" :key="est" :value="est">{{ est }}</option>
            </select>
            <p v-if="errores.estado" class="texto-error">{{ errores.estado }}</p>
          </div>
          <div>
            <label class="label-style">Ciudad</label>
            <select v-model="form.ciudad" class="input-style cursor-pointer"
              :disabled="!form.estado || form.estado === 'Remoto / Home office'">
              <option value="">— Selecciona una ciudad —</option>
              <option v-for="c in ciudadesPorEstado[form.estado] || []" :key="c" :value="c">{{ c }}</option>
            </select>
            <p v-if="errores.ciudad" class="texto-error">{{ errores.ciudad }}</p>
          </div>
        </div>

        <!-- ── SALARIO: wrapper flex en lugar de $ absoluto ── -->
        <!-- Corrección: el $ absoluto se solapaba porque .input-style
             tiene padding:1rem que anulaba el pl-10 de Tailwind.
             Con un wrapper flex el signo y el input nunca se superponen. -->
        <div>
          <div class="flex items-baseline justify-between mb-1">
            <label class="label-style !mb-0">Salario mensual (MXN)</label>
            <span class="text-xs text-cerceta-light font-medium">$3,000 – $200,000</span>
          </div>
          <div class="salario-wrapper" :class="{ 'salario-focus': salarioActivo, 'salario-error': errores.salario }">
            <span class="salario-signo">$</span>
            <input
              v-model="salarioFormateado"
              type="text"
              inputmode="numeric"
              placeholder="25,000"
              class="salario-input"
              @input="formatearSalario"
              @focus="salarioActivo = true"
              @blur="validarSalario"
            />
          </div>
          <p v-if="errores.salario" class="texto-error">{{ errores.salario }}</p>
        </div>

        <!-- Descripción -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="label-style" style="margin-bottom:0">Descripción del puesto *</label>
            <span :class="form.descripcion.length > 700 ? 'text-red-400' : 'text-gray-400'"
                class="text-xs font-bold">
              {{ form.descripcion.length }}/800
            </span>
          </div>
          <textarea v-model="form.descripcion" rows="4"
            placeholder="Describe las responsabilidades, requisitos y lo que ofrece el puesto..."
            class="input-style resize-none" maxlength="800" required></textarea>
        </div>

        <!-- Habilidades requeridas — máx. 5 -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="label-style" style="margin-bottom:0">Habilidades requeridas (máx. 5)</label>
            <span :class="form.tags.length >= 5 ? 'text-red-400' : 'text-matcha'" class="text-xs font-bold">
              {{ form.tags.length }}/5
            </span>
          </div>

          <div v-if="form.tags.length < 5" class="mb-2">
            <input
              v-model="busquedaHabilidad"
              type="text"
              placeholder="Escribe y presiona Enter para agregar..."
              class="input-style"
              @input="buscarEtiquetas"
              @keydown.enter.prevent="agregarPorEnter"
            />
            <div v-if="sugerencias.length" class="flex flex-wrap gap-2 mt-2">
              <button v-for="et in sugerencias" :key="et.id_etiqueta" type="button"
                class="sugerencia-btn" @click="agregarEtiqueta(et)">
                + {{ et.nombre }}
              </button>
            </div>
            <div v-else-if="busquedaHabilidad.trim() && !buscando" class="flex items-center gap-2 mt-2">
              <span class="text-xs text-gray-400">No encontrada —</span>
              <button type="button" class="sugerencia-btn" @click="agregarNueva">
                + Agregar "{{ busquedaHabilidad.trim() }}"
              </button>
            </div>
          </div>

          <div class="input-style min-h-[52px] flex flex-wrap gap-2 items-center" v-if="form.tags.length">
            <span v-for="(tag, i) in form.tags" :key="i"
              class="bg-matcha/10 text-matcha text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
              {{ tag }}
              <button @click="removeTag(i)" type="button" class="hover:text-red-500 ml-1 text-sm">&times;</button>
            </span>
          </div>
          <p v-else-if="form.tags.length === 0 && intentoEnvio" class="texto-error">
            Agrega al menos una habilidad requerida.
          </p>
          <p class="text-xs text-gray-400 mt-1">
            Las habilidades se usan en el algoritmo de compatibilidad con candidatos.
          </p>
        </div>

        <!-- Error general -->
        <div v-if="errorGeneral" class="p-3 bg-red-100 text-red-700 text-sm font-bold rounded-xl text-center">
          {{ errorGeneral }}
        </div>

        <div class="pt-4">
          <button type="submit"
            :disabled="cargando"
            :class="cargando ? 'opacity-70 cursor-not-allowed' : 'hover:bg-matcha-dark transform hover:-translate-y-1 active:scale-[0.98]'"
            class="w-full bg-matcha text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-matcha/30 transition-all">
            {{ cargando ? 'Publicando...' : 'Publicar Vacante' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ciudadesPorEstado, estadosMexico } from '@/data/mexico-ciudades.js'

const router = useRouter()

// ── ESTADO ──
const form = ref({
    titulo:      '',
    modalidad:   'Híbrido',
    estado:      '',
    ciudad:      '',
    horario:     '',
    nivel_puesto: '',
    idioma:      '',
    descripcion: '',
    tags:        []
})

const salarioFormateado = ref('')
const salarioActivo     = ref(false)
const busquedaHabilidad = ref('')
const sugerencias       = ref([])
const buscando          = ref(false)
const cargando          = ref(false)
const intentoEnvio      = ref(false)
const errorGeneral      = ref('')
const errores           = ref({ estado: '', ciudad: '', salario: '' })

let timerBusqueda = null

// ── PRECARGA DESDE PERFIL DE EMPRESA ──────────────────────────────────────
onMounted(async () => {
    const idReclutador = localStorage.getItem('usuarioId')
    if (!idReclutador) return
    try {
        const r = await fetch(`${import.meta.env.VITE_API_URL}/api/reclutadores/${idReclutador}`)
        if (!r.ok) return
        const { reclutador } = await r.json()

        // Solo precargamos ubicación — modalidad, contratación, nivel e idioma
        // los elige el reclutador en cada vacante de forma independiente.
        if (reclutador.ubicacion) {
            const partes = reclutador.ubicacion.split(', ')
            if (partes.length >= 2) {
                const estadoCandidato = partes.slice(1).join(', ')
                const ciudadCandidato = partes[0]
                if (estadosMexico.includes(estadoCandidato)) {
                    form.value.estado = estadoCandidato
                    const ciudades = ciudadesPorEstado[estadoCandidato] || []
                    if (ciudades.includes(ciudadCandidato)) {
                        form.value.ciudad = ciudadCandidato
                    }
                }
            }
        }
    } catch (e) {
        console.warn('No se pudo cargar el perfil de empresa:', e)
    }
})

// ── FORMATEAR SALARIO ──
// Separamos el formateador para que @input no tenga cursor-jump.
// El campo es type="text" con inputmode="numeric" para evitar las flechitas.
const SALARIO_MIN = 3_000
const SALARIO_MAX = 200_000

const formatearSalario = () => {
    const soloNumeros = salarioFormateado.value.replace(/[^0-9]/g, '')
    if (!soloNumeros) { salarioFormateado.value = ''; return }
    // Limitar mientras escribe al máximo para no confundir
    const num = Math.min(parseInt(soloNumeros, 10), SALARIO_MAX)
    salarioFormateado.value = num.toLocaleString('es-MX')
    // Si ya había error y ahora el valor es válido, limpiarlo en vivo
    if (errores.value.salario) validarSalario()
}

const validarSalario = () => {
    salarioActivo.value = false
    const num = salarioNumerico()
    if (!num) {
        errores.value.salario = 'Ingresa el salario mensual.'
    } else if (num < SALARIO_MIN) {
        errores.value.salario = `El mínimo es $${SALARIO_MIN.toLocaleString('es-MX')} MXN.`
    } else if (num > SALARIO_MAX) {
        errores.value.salario = `El máximo es $${SALARIO_MAX.toLocaleString('es-MX')} MXN.`
    } else {
        errores.value.salario = ''
    }
}

const salarioNumerico = () =>
    parseInt(salarioFormateado.value.replace(/[^0-9]/g, '') || '0', 10)

// ── ETIQUETAS ──
const buscarEtiquetas = () => {
    clearTimeout(timerBusqueda)
    const texto = busquedaHabilidad.value.trim()
    if (!texto) { sugerencias.value = []; return }
    buscando.value = true
    timerBusqueda = setTimeout(async () => {
        try {
            const r = await fetch(`${import.meta.env.VITE_API_URL}/api/perfil/etiquetas/buscar?q=${encodeURIComponent(texto)}`)
            if (r.ok) {
                const datos = await r.json()
                sugerencias.value = datos.filter(et => !form.value.tags.includes(et.nombre)).slice(0, 6)
            }
        } catch { sugerencias.value = [] }
        finally   { buscando.value = false }
    }, 300)
}

const agregarEtiqueta = (et) => {
    if (form.value.tags.length >= 5) return
    if (!form.value.tags.includes(et.nombre)) form.value.tags.push(et.nombre)
    busquedaHabilidad.value = ''
    sugerencias.value       = []
}

const agregarPorEnter = () => {
    const texto = busquedaHabilidad.value.trim()
    if (!texto || form.value.tags.length >= 5) return
    const c = sugerencias.value.find(s => s.nombre.toLowerCase() === texto.toLowerCase())
    if (c) agregarEtiqueta(c)
    else   agregarNueva()
}

const agregarNueva = () => {
    const texto = busquedaHabilidad.value.trim()
    if (!texto || form.value.tags.length >= 5) return
    if (!form.value.tags.includes(texto)) form.value.tags.push(texto)
    busquedaHabilidad.value = ''
    sugerencias.value       = []
}

const removeTag = (i) => form.value.tags.splice(i, 1)

// ── ENVIAR ──
const handleSubmit = async () => {
    intentoEnvio.value = true
    errores.value      = { estado: '', ciudad: '', salario: '' }
    errorGeneral.value = ''

    if (!form.value.estado) { errores.value.estado = 'Selecciona un estado.'; return }
    if (form.value.estado !== 'Remoto / Home office' && !form.value.ciudad) {
        errores.value.ciudad = 'Selecciona una ciudad.'; return
    }
    const salNum = salarioNumerico()
    if (!salNum || salNum < SALARIO_MIN || salNum > SALARIO_MAX) {
        validarSalario(); return
    }
    if (form.value.tags.length === 0) return
    if (form.value.tags.length > 5)  { errorGeneral.value = 'El máximo de habilidades es 5.'; return }

    const ubicacionFinal = form.value.estado === 'Remoto / Home office'
        ? 'Remoto / Home office'
        : `${form.value.ciudad}, ${form.value.estado}`

    cargando.value = true
    try {
        const reclutadorId = localStorage.getItem('usuarioId')
        if (!reclutadorId) throw new Error('No se detectó la sesión del reclutador.')

        const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/api/vacantes/crear`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                titulo:                form.value.titulo,
                descripcion:           form.value.descripcion,
                habilidadesRequeridas: form.value.tags,
                salario:               salarioNumerico(),
                reclutador_id:         reclutadorId,
                modalidad:             form.value.modalidad,
                horario:               form.value.horario,
                nivel_puesto:          form.value.nivel_puesto,
                idioma:                form.value.idioma,
                ubicacion:             ubicacionFinal
            })
        })

        const data = await respuesta.json()
        if (!respuesta.ok) throw new Error(data.mensaje || 'Error al publicar la vacante.')
        router.push('/reclutador/listas')

    } catch (err) {
        console.error(err)
        errorGeneral.value = err.message
    } finally {
        cargando.value = false
    }
}
</script>

<style scoped>
.label-style {
    display: block;
    font-size: 10px;
    font-weight: 900;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.375rem;
    margin-left: 0.25rem;
}

.input-style {
    width: 100%;
    padding: 1rem;
    background-color: #f9fafb;
    border: 2px solid transparent;
    border-radius: 1rem;
    outline: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    color: #2a6b6d;
    font-weight: 500;
    font-family: inherit;
}
.input-style:focus {
    border-color: #3bb4a1;
    background-color: white;
    box-shadow: 0 4px 12px rgba(59, 180, 161, 0.08);
}
.input-style::placeholder { color: #d1d5db; }
.input-style:disabled { opacity: 0.5; cursor: not-allowed; }

select.input-style {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    padding-right: 40px;
}

/* ── SALARIO WRAPPER ────────────────────────────────────────────
   Solución definitiva al solapamiento del $ con el valor:
   En lugar de posicionamiento absoluto (que conflictuaba con
   padding:1rem de .input-style), usamos un flex-wrapper que
   actúa como el propio input visualmente.
────────────────────────────────────────────────────────────── */
.salario-wrapper {
    display: flex;
    align-items: center;
    background-color: #f9fafb;
    border: 2px solid transparent;
    border-radius: 1rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
}
.salario-error {
  border-color: #ef4444 !important;
  background: #fff5f5;
}
.salario-focus {
    border-color: #3bb4a1;
    background-color: white;
    box-shadow: 0 4px 12px rgba(59, 180, 161, 0.08);
}
.salario-signo {
    padding: 0 4px 0 16px;
    font-size: 0.875rem;
    font-weight: 700;
    color: #2a6b6d;
    user-select: none;
    flex-shrink: 0;
    line-height: 1;
}
.salario-input {
    flex: 1;
    padding: 1rem 1rem 1rem 4px;  /* izquierda mínima: el $ ya tiene su espacio */
    background: transparent;
    border: none;
    outline: none;
    color: #2a6b6d;
    font-weight: 500;
    font-size: inherit;
    font-family: inherit;
    min-width: 0;
}
.salario-input::placeholder { color: #d1d5db; }

.sugerencia-btn {
    padding: 4px 12px;
    border-radius: 20px;
    background: #e1f5ee;
    color: #085041;
    border: 1px solid #5dcaa5;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
}
.sugerencia-btn:hover { background: #3bb4a1; color: white; border-color: #3bb4a1; }

.texto-error { font-size: 11px; color: #ef4444; font-weight: 600; margin-top: 4px; margin-left: 4px; }
</style>