<template>
  <div class="max-w-6xl mx-auto px-4 py-8">

    <!-- ENCABEZADO -->
    <div class="flex justify-between items-end mb-10">
      <div>
        <h2 class="text-3xl font-extrabold text-cerceta tracking-tight">Mis Vacantes</h2>
        <p class="text-cerceta-light mt-1">
          {{ vacantes.length }} vacante{{ vacantes.length !== 1 ? 's' : '' }} publicada{{ vacantes.length !== 1 ? 's' : '' }}
        </p>
      </div>
      <router-link
        to="/reclutador/publicar"
        class="bg-matcha text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-matcha/20 hover:bg-matcha-dark transition-colors flex items-center gap-2">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Nueva Vacante
      </router-link>
    </div>

    <!-- CARGANDO -->
    <div v-if="cargando" class="text-center py-16 text-cerceta-light animate-pulse font-medium">
      Cargando tus vacantes...
    </div>

    <!-- SIN VACANTES -->
    <div v-else-if="vacantes.length === 0"
      class="bg-fondo py-16 rounded-[2rem] text-center border border-dashed border-cerceta/20">
      <div class="flex justify-center mb-4">
        <svg class="w-12 h-12 text-cerceta/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="2" y="7" width="20" height="14" rx="2"/>
          <path d="M16 7V5a2 2 0 00-4 0v2M8 11h.01M12 11h.01M16 11h.01M8 15h8"/>
        </svg>
      </div>
      <h3 class="text-xl font-bold text-cerceta mb-2">No tienes vacantes publicadas</h3>
      <p class="text-cerceta-light mb-6">Comienza a atraer talento publicando tu primera oferta de trabajo.</p>
      <router-link
        to="/reclutador/publicar"
        class="bg-matcha text-white px-6 py-3 rounded-xl font-bold hover:bg-matcha-dark transition-colors inline-block">
        Publicar Vacante Ahora
      </router-link>
    </div>

    <!-- TARJETAS -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="v in vacantes"
        :key="vacanteId(v)"
        class="bg-white p-8 rounded-[2.5rem] shadow-suave border border-matcha/5 hover:border-matcha/30 hover:-translate-y-1 transition-all flex flex-col justify-between group h-full"
        :class="v.estatus === 'inactiva' ? 'opacity-70' : ''">

        <div>
          <!-- Título y badge de estatus -->
          <div class="flex justify-between items-start gap-3 mb-4">
            <h3 class="text-2xl font-extrabold text-cerceta leading-tight group-hover:text-matcha transition-colors flex-1">
              {{ v.titulo }}
            </h3>
            <!-- Badge clickeable para toggle estatus -->
            <button
              @click="confirmarToggleEstatus(v)"
              :class="v.estatus === 'activa'
                ? 'text-matcha-dark bg-matcha/10 hover:bg-red-50 hover:text-red-500'
                : 'text-gray-400 bg-gray-100 hover:bg-matcha/10 hover:text-matcha'"
              class="text-[11px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all cursor-pointer border-0 whitespace-nowrap flex-shrink-0"
              :title="v.estatus === 'activa' ? 'Clic para desactivar' : 'Clic para activar'">
              {{ v.estatus === 'activa' ? 'Activa' : 'Inactiva' }}
            </button>
          </div>

          <!-- Meta: modalidad + ubicación -->
          <div class="flex flex-wrap gap-2 mb-4">
            <span v-if="v.modalidad"
              class="text-[11px] font-bold text-cerceta bg-fondo px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center gap-1.5">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
              </svg>
              {{ v.modalidad }}
            </span>
            <span v-if="v.ubicacion"
              class="text-[11px] font-bold text-cerceta bg-fondo px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center gap-1.5">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
              </svg>
              {{ v.ubicacion }}
            </span>
          </div>

          <!-- Salario -->
          <div class="flex flex-wrap gap-2 mb-6">
            <span class="text-[11px] font-bold text-cerceta bg-fondo px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center gap-1.5">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
              </svg>
              {{ v.sueldo ? '$' + Number(v.sueldo).toLocaleString('es-MX') + ' /mes' : 'Salario no especificado' }}
            </span>
          </div>
            <span v-if="erroresEdicion.salario" class="campo-error">{{ erroresEdicion.salario }}</span>

          <!-- Descripción -->
          <p class="text-sm text-cerceta-light mb-6 line-clamp-3 leading-relaxed">
            {{ v.descripcion || 'Sin descripción detallada.' }}
          </p>

          <!-- Habilidades requeridas -->
          <div v-if="v.habilidades_requeridas?.length" class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="h in v.habilidades_requeridas" :key="h"
              class="text-[10px] font-bold text-matcha-dark bg-matcha/8 px-2.5 py-1 rounded-md">
              {{ h }}
            </span>
          </div>
        </div>

        <!-- Acciones -->
        <div class="mt-auto space-y-2">
          <!-- Evaluar candidatos -->
          <router-link
            v-if="v.estatus === 'activa'"
            :to="`/swiper/${vacanteId(v)}?titulo=${encodeURIComponent(v.titulo)}`"
            class="w-full flex items-center justify-center gap-2 py-3.5 bg-matcha text-white rounded-xl font-bold text-sm hover:bg-matcha-dark transition-all shadow-lg shadow-matcha/20">
            Evaluar Candidatos
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
          </router-link>
          <div v-else
            class="w-full flex items-center justify-center py-3.5 bg-gray-100 text-gray-400 rounded-xl font-bold text-sm cursor-not-allowed">
            Vacante pausada
          </div>

          <!-- Editar y Eliminar -->
          <div class="flex gap-2">
            <button
              @click="abrirModalEdicion(v)"
              class="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-matcha/20 text-matcha rounded-xl font-bold text-xs hover:bg-matcha/5 transition-all">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Editar
            </button>
            <button
              @click="confirmarEliminar(v)"
              class="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-red-100 text-red-400 rounded-xl font-bold text-xs hover:bg-red-50 hover:border-red-200 transition-all">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
              </svg>
              Eliminar
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- ════════ MODAL: EDITAR VACANTE ════════ -->
    <div v-if="modalEdicion" class="modal-overlay" @click.self="cerrarModalEdicion">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-titulo">Editar vacante</h3>
          <button class="modal-cerrar" @click="cerrarModalEdicion">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="modal-cuerpo">

          <!-- Nombre -->
          <div class="campo-form">
            <label class="campo-label">Nombre del puesto *</label>
            <input v-model="formEdicion.titulo" class="campo-input" type="text"
              placeholder="Ej: Desarrolladora Frontend Senior" maxlength="150"/>
            <span v-if="erroresEdicion.titulo" class="campo-error">{{ erroresEdicion.titulo }}</span>
          </div>

          <!-- Modalidad -->
          <div class="campo-form">
            <label class="campo-label">Modalidad</label>
            <select v-model="formEdicion.modalidad" class="campo-select">
              <option>Híbrido</option><option>Remoto</option><option>Presencial</option>
            </select>
          </div>

          <!-- Ubicación en cascada -->
          <div class="campo-form">
            <label class="campo-label">Ubicación</label>
            <div class="dos-col">
              <div>
                <p class="campo-sublabel">Estado</p>
                <select v-model="formEdicion.estado" class="campo-select" @change="formEdicion.ciudad = ''">
                  <option value="">— Estado —</option>
                  <option value="Remoto / Home office">Remoto / Home office</option>
                  <option v-for="e in estadosMexico" :key="e" :value="e">{{ e }}</option>
                </select>
              </div>
              <div>
                <p class="campo-sublabel">Ciudad</p>
                <select v-model="formEdicion.ciudad" class="campo-select"
                  :disabled="!formEdicion.estado || formEdicion.estado === 'Remoto / Home office'">
                  <option value="">— Ciudad —</option>
                  <option v-for="c in ciudadesPorEstado[formEdicion.estado] || []" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>
            </div>
            <span v-if="erroresEdicion.ubicacion" class="campo-error">{{ erroresEdicion.ubicacion }}</span>
          </div>

          <!-- Salario -->
          <div class="campo-form">
            <div class="flex items-baseline justify-between mb-1">
              <label class="campo-label !mb-0">Salario mensual (MXN)</label>
              <span style="font-size:11px;color:#6b7f7f;font-weight:500;">$3,000 – $200,000</span>
            </div>
            <div class="salario-wrap" :class="{ 'salario-focus': salarioActivoEdicion, 'salario-error': erroresEdicion.salario }">
              <span class="salario-signo">$</span>
              <input
                v-model="salarioEdicionFormateado"
                type="text" inputmode="numeric" placeholder="25,000"
                class="salario-input"
                @input="formatearSalarioEdicion"
                @focus="salarioActivoEdicion = true"
                @blur="validarSalarioEdicion"
              />
            </div>
          </div>

          <!-- Descripción -->
          <div class="campo-form">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
              <label class="campo-label" style="margin-bottom:0">Descripción del puesto *</label>
              <span class="campo-counter" :class="formEdicion.descripcion.length > 700 ? 'campo-counter-max' : ''">
                {{ formEdicion.descripcion.length }}/800
              </span>
            </div>
            <textarea v-model="formEdicion.descripcion" class="campo-textarea"
              placeholder="Responsabilidades, requisitos y beneficios del puesto..."
              rows="4" maxlength="800"></textarea>
            <span v-if="erroresEdicion.descripcion" class="campo-error">{{ erroresEdicion.descripcion }}</span>
          </div>

          <!-- Habilidades -->
          <div class="campo-form">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
              <label class="campo-label" style="margin-bottom:0">Habilidades requeridas (máx. 5)</label>
              <span class="campo-counter" :class="formEdicion.tags.length >= 5 ? 'campo-counter-max' : ''">
                {{ formEdicion.tags.length }}/5
              </span>
            </div>

            <div v-if="formEdicion.tags.length < 5">
              <input
                v-model="busquedaEdicion" type="text"
                placeholder="Escribe y presiona Enter para agregar..."
                class="campo-input"
                @input="buscarSugerenciasEdicion"
                @keydown.enter.prevent="agregarPorEnterEdicion"
              />
              <div v-if="sugerenciasEdicion.length" class="sugerencias-row">
                <button v-for="et in sugerenciasEdicion" :key="et.id_etiqueta"
                  type="button" class="sugerencia-btn" @click="agregarSugerenciaEdicion(et)">
                  + {{ et.nombre }}
                </button>
              </div>
              <div v-else-if="busquedaEdicion.trim() && !buscandoEdicion" class="sugerencias-row">
                <span style="font-size:12px;color:#94a3b8">No encontrada —</span>
                <button type="button" class="sugerencia-btn" @click="agregarNuevaEdicion">
                  + Agregar "{{ busquedaEdicion.trim() }}"
                </button>
              </div>
            </div>

            <div v-if="formEdicion.tags.length" class="tags-row">
              <span v-for="(tag, i) in formEdicion.tags" :key="i" class="tag-chip">
                {{ tag }}
                <button type="button" @click="quitarTagEdicion(i)" class="tag-quitar">
                  <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </span>
            </div>
          </div>

        </div>

        <div class="modal-footer">
          <button class="btn-cancelar" @click="cerrarModalEdicion" :disabled="guardandoEdicion">Cancelar</button>
          <button class="btn-guardar" @click="guardarEdicion" :disabled="guardandoEdicion">
            {{ guardandoEdicion ? 'Guardando...' : 'Guardar cambios' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ════════ MODAL: CONFIRMAR TOGGLE ESTATUS ════════ -->
    <div v-if="modalEstatus" class="modal-overlay" @click.self="modalEstatus = null">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h3 class="modal-titulo">
            {{ modalEstatus.estatus === 'activa' ? 'Desactivar vacante' : 'Activar vacante' }}
          </h3>
          <button class="modal-cerrar" @click="modalEstatus = null">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-cuerpo">
          <p class="confirm-desc">
            {{ modalEstatus.estatus === 'activa'
              ? `"${modalEstatus.titulo}" quedará inactiva y dejará de recibir postulaciones.`
              : `"${modalEstatus.titulo}" volverá a estar visible para los candidatos.` }}
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancelar" @click="modalEstatus = null" :disabled="procesandoEstatus">Cancelar</button>
          <button
            :class="modalEstatus.estatus === 'activa' ? 'btn-peligro' : 'btn-guardar'"
            @click="ejecutarToggleEstatus"
            :disabled="procesandoEstatus">
            {{ procesandoEstatus ? 'Procesando...'
              : modalEstatus.estatus === 'activa' ? 'Sí, desactivar' : 'Sí, activar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ════════ MODAL: CONFIRMAR ELIMINAR ════════ -->
    <div v-if="modalEliminar" class="modal-overlay" @click.self="modalEliminar = null">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h3 class="modal-titulo">Eliminar vacante</h3>
          <button class="modal-cerrar" @click="modalEliminar = null">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-cuerpo">
          <p class="confirm-desc">
            Se eliminará permanentemente <strong>"{{ modalEliminar.titulo }}"</strong>
            junto con todas sus postulaciones. Esta acción no puede deshacerse.
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancelar" @click="modalEliminar = null" :disabled="eliminando">Cancelar</button>
          <button class="btn-peligro" @click="ejecutarEliminar" :disabled="eliminando">
            {{ eliminando ? 'Eliminando...' : 'Sí, eliminar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- TOAST -->
    <div v-if="toast.visible" :class="['toast', toast.tipo]">{{ toast.mensaje }}</div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ciudadesPorEstado, estadosMexico } from '@/data/mexico-ciudades.js'

const URL_API      = import.meta.env.VITE_API_URL
const idReclutador = localStorage.getItem('usuarioId')

// ── HELPER: obtener el ID de la vacante (cubre posibles nombres distintos) ──
const vacanteId = (v) => v.id_vacante ?? v.id

const parsearUbicacion = (texto = '') => {
    if (!texto) return { estado: '', ciudad: '' }
    if (texto === 'Remoto / Home office') return { estado: 'Remoto / Home office', ciudad: '' }
    const partes = texto.split(',').map(p => p.trim())
    if (partes.length >= 2) {
        const ciudad = partes[0]
        const estado = partes.slice(1).join(', ').trim()
        if (estadosMexico.includes(estado)) return { estado, ciudad }
    }
    return { estado: '', ciudad: '' }
}

// ── ESTADO ────────────────────────────────────────────────────────────────────
const vacantes          = ref([])
const cargando          = ref(true)

const modalEdicion         = ref(false)
const vacanteSiendoEditada = ref(null)
const guardandoEdicion     = ref(false)
const formEdicion          = ref({ titulo: '', modalidad: 'Híbrido', estado: '', ciudad: '', descripcion: '', tags: [] })
const erroresEdicion       = ref({ titulo: '', ubicacion: '', descripcion: '', salario: '' })
const salarioEdicionFormateado = ref('')
const salarioActivoEdicion     = ref(false)

const busquedaEdicion    = ref('')
const sugerenciasEdicion = ref([])
const buscandoEdicion    = ref(false)
let   timerBusquedaEdicion = null

const modalEstatus      = ref(null)
const procesandoEstatus = ref(false)
const modalEliminar     = ref(null)
const eliminando        = ref(false)

const toast = ref({ visible: false, mensaje: '', tipo: 'exito' })

// ── CARGAR ────────────────────────────────────────────────────────────────────
onMounted(async () => {
    if (!idReclutador) { cargando.value = false; return }
    try {
        const res = await fetch(`${URL_API}/api/vacantes/reclutador/${idReclutador}`)
        if (res.ok) vacantes.value = await res.json()
    } catch (e) { console.error('Error cargando vacantes:', e) }
    finally     { cargando.value = false }
})

// ── TOAST ─────────────────────────────────────────────────────────────────────
const mostrarToast = (mensaje, tipo = 'exito') => {
    toast.value = { visible: true, mensaje, tipo }
    setTimeout(() => { toast.value.visible = false }, 3000)
}

// ── MODAL EDICIÓN ─────────────────────────────────────────────────────────────
const abrirModalEdicion = (v) => {
    vacanteSiendoEditada.value = v
    const { estado, ciudad }   = parsearUbicacion(v.ubicacion)
    formEdicion.value = {
        titulo:      v.titulo      || '',
        modalidad:   v.modalidad   || 'Híbrido',
        estado, ciudad,
        descripcion: v.descripcion || '',
        tags:        [...(v.habilidades_requeridas || [])]
    }
    salarioEdicionFormateado.value = v.sueldo ? Number(v.sueldo).toLocaleString('es-MX') : ''
    erroresEdicion.value           = { titulo: '', ubicacion: '', descripcion: '', salario: '' }
    busquedaEdicion.value          = ''
    sugerenciasEdicion.value       = []
    modalEdicion.value             = true
}

const cerrarModalEdicion = () => {
    if (guardandoEdicion.value) return
    modalEdicion.value = false
}

const SALARIO_MIN = 3_000
const SALARIO_MAX = 200_000

const formatearSalarioEdicion = () => {
    const n = salarioEdicionFormateado.value.replace(/[^0-9]/g, '')
    if (!n) { salarioEdicionFormateado.value = ''; return }
    const num = Math.min(parseInt(n, 10), SALARIO_MAX)
    salarioEdicionFormateado.value = num.toLocaleString('es-MX')
    if (erroresEdicion.value.salario) validarSalarioEdicion()
}

const validarSalarioEdicion = () => {
    salarioActivoEdicion.value = false
    const num = salarioNumericoEdicion()
    if (!num) {
        erroresEdicion.value.salario = 'Ingresa el salario mensual.'
    } else if (num < SALARIO_MIN) {
        erroresEdicion.value.salario = `El mínimo es $${SALARIO_MIN.toLocaleString('es-MX')} MXN.`
    } else if (num > SALARIO_MAX) {
        erroresEdicion.value.salario = `El máximo es $${SALARIO_MAX.toLocaleString('es-MX')} MXN.`
    } else {
        erroresEdicion.value.salario = ''
    }
}

const salarioNumericoEdicion = () =>
    parseInt(salarioEdicionFormateado.value.replace(/[^0-9]/g, '') || '0', 10)

const buscarSugerenciasEdicion = () => {
    clearTimeout(timerBusquedaEdicion)
    const texto = busquedaEdicion.value.trim()
    if (!texto) { sugerenciasEdicion.value = []; return }
    buscandoEdicion.value = true
    timerBusquedaEdicion = setTimeout(async () => {
        try {
            const r = await fetch(`${URL_API}/api/perfil/etiquetas/buscar?q=${encodeURIComponent(texto)}`)
            if (r.ok) {
                const d = await r.json()
                sugerenciasEdicion.value = d.filter(et => !formEdicion.value.tags.includes(et.nombre)).slice(0, 6)
            }
        } catch { sugerenciasEdicion.value = [] }
        finally   { buscandoEdicion.value = false }
    }, 300)
}

const agregarSugerenciaEdicion = (et) => {
    if (formEdicion.value.tags.length >= 5) return
    if (!formEdicion.value.tags.includes(et.nombre)) formEdicion.value.tags.push(et.nombre)
    busquedaEdicion.value = ''; sugerenciasEdicion.value = []
}
const agregarPorEnterEdicion = () => {
    const texto = busquedaEdicion.value.trim()
    if (!texto || formEdicion.value.tags.length >= 5) return
    const c = sugerenciasEdicion.value.find(s => s.nombre.toLowerCase() === texto.toLowerCase())
    if (c) agregarSugerenciaEdicion(c); else agregarNuevaEdicion()
}
const agregarNuevaEdicion = () => {
    const texto = busquedaEdicion.value.trim()
    if (!texto || formEdicion.value.tags.length >= 5) return
    if (!formEdicion.value.tags.includes(texto)) formEdicion.value.tags.push(texto)
    busquedaEdicion.value = ''; sugerenciasEdicion.value = []
}
const quitarTagEdicion = (i) => formEdicion.value.tags.splice(i, 1)

const guardarEdicion = async () => {
    erroresEdicion.value = { titulo: '', ubicacion: '', descripcion: '', salario: '' }
    if (!formEdicion.value.titulo.trim())      { erroresEdicion.value.titulo = 'El nombre es obligatorio.'; return }
    if (!formEdicion.value.descripcion.trim()) { erroresEdicion.value.descripcion = 'La descripción es obligatoria.'; return }
    const salNum = salarioNumericoEdicion()
    if (!salNum || salNum < SALARIO_MIN || salNum > SALARIO_MAX) { validarSalarioEdicion(); return }
    if (formEdicion.value.estado && formEdicion.value.estado !== 'Remoto / Home office' && !formEdicion.value.ciudad) {
        erroresEdicion.value.ubicacion = 'Selecciona una ciudad.'; return
    }

    let ubicacion = ''
    if (formEdicion.value.estado === 'Remoto / Home office') ubicacion = 'Remoto / Home office'
    else if (formEdicion.value.estado && formEdicion.value.ciudad) ubicacion = `${formEdicion.value.ciudad}, ${formEdicion.value.estado}`

    guardandoEdicion.value = true
    try {
        const id  = vacanteId(vacanteSiendoEditada.value)
        const url = `${URL_API}/api/vacantes/${id}`
        const res = await fetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                titulo: formEdicion.value.titulo.trim(),
                descripcion: formEdicion.value.descripcion.trim(),
                habilidadesRequeridas: formEdicion.value.tags,
                salario: salarioNumericoEdicion(),
                modalidad: formEdicion.value.modalidad,
                ubicacion
            })
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.mensaje || `Error ${res.status}`)

        const idx = vacantes.value.findIndex(x => vacanteId(x) === id)
        if (idx !== -1) vacantes.value[idx] = {
            ...vacantes.value[idx],
            titulo: formEdicion.value.titulo.trim(),
            descripcion: formEdicion.value.descripcion.trim(),
            habilidades_requeridas: formEdicion.value.tags,
            sueldo: salarioNumericoEdicion() || vacantes.value[idx].sueldo,
            modalidad: formEdicion.value.modalidad,
            ubicacion
        }
        modalEdicion.value = false
        mostrarToast('Vacante actualizada correctamente')
    } catch (err) {
        mostrarToast(err.message || 'No se pudo guardar.', 'error')
    } finally {
        guardandoEdicion.value = false
    }
}

// ── TOGGLE ESTATUS ────────────────────────────────────────────────────────────
const confirmarToggleEstatus = (v) => { modalEstatus.value = v }

const ejecutarToggleEstatus = async () => {
    const v = modalEstatus.value
    const nuevoEstatus = v.estatus === 'activa' ? 'inactiva' : 'activa'
    procesandoEstatus.value = true
    try {
        const id  = vacanteId(v)
        // La ruta específica /estatus va primero en vacantesRoutes.js (fix del 404)
        const url = `${URL_API}/api/vacantes/${id}/estatus`
        const res = await fetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estatus: nuevoEstatus })
        })
        if (!res.ok) {
            const d = await res.json().catch(() => ({}))
            throw new Error(d.mensaje || `Error ${res.status}`)
        }
        const idx = vacantes.value.findIndex(x => vacanteId(x) === id)
        if (idx !== -1) vacantes.value[idx].estatus = nuevoEstatus
        modalEstatus.value = null
        mostrarToast(nuevoEstatus === 'activa' ? 'Vacante activada' : 'Vacante desactivada')
    } catch (err) {
        mostrarToast(err.message || 'No se pudo cambiar el estatus.', 'error')
    } finally {
        procesandoEstatus.value = false
    }
}

// ── ELIMINAR ──────────────────────────────────────────────────────────────────
const confirmarEliminar = (v) => { modalEliminar.value = v }

const ejecutarEliminar = async () => {
    const v = modalEliminar.value
    eliminando.value = true
    try {
        const id  = vacanteId(v)
        const url = `${URL_API}/api/vacantes/${id}`
        const res = await fetch(url, { method: 'DELETE' })
        if (!res.ok) {
            const d = await res.json().catch(() => ({}))
            throw new Error(d.mensaje || `Error ${res.status}`)
        }
        vacantes.value     = vacantes.value.filter(x => vacanteId(x) !== id)
        modalEliminar.value = null
        mostrarToast('Vacante eliminada')
    } catch (err) {
        mostrarToast(err.message || 'No se pudo eliminar.', 'error')
    } finally {
        eliminando.value = false
    }
}
</script>

<style scoped>
/* ── MODALES ─────────────────────────────────────────────────────── */
.modal-overlay {
    position: fixed; inset: 0;
    background: rgba(15,23,42,.45);
    display: flex; align-items: center; justify-content: center;
    z-index: 200; padding: 20px;
    backdrop-filter: blur(2px);
}
.modal {
    background: white; border-radius: 20px;
    width: 100%; max-width: 560px;
    box-shadow: 0 20px 60px rgba(0,0,0,.15);
    display: flex; flex-direction: column; max-height: 90vh;
}
.modal-sm { max-width: 420px; }

.modal-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 20px 24px; border-bottom: 1px solid #f1f5f9; flex-shrink: 0;
}
.modal-titulo { font-size: 18px; font-weight: 800; color: #0f172a; }
.modal-cerrar {
    width: 32px; height: 32px; border-radius: 8px;
    background: #f1f5f9; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #64748b; transition: background .2s;
}
.modal-cerrar:hover { background: #e2e8f0; }
.modal-cuerpo { padding: 20px 24px; display: flex; flex-direction: column; gap: 14px; overflow-y: auto; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid #f1f5f9; flex-shrink: 0; }

/* ── CAMPOS ──────────────────────────────────────────────────────── */
.campo-form   { display: flex; flex-direction: column; gap: 5px; }
.campo-label  { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: .05em; }
.campo-sublabel { font-size: 10px; font-weight: 600; color: #94a3b8; display: block; margin-bottom: 4px; }
.campo-counter     { font-size: 11px; color: #94a3b8; font-weight: 600; }
.campo-counter-max { font-size: 11px; color: #ef4444; font-weight: 700; }
.campo-input, .campo-textarea {
    padding: 10px 14px; border: 1.5px solid #e2e8f0;
    border-radius: 10px; font-size: 14px; color: #1e293b;
    font-family: inherit; outline: none; transition: border-color .2s; width: 100%;
}
.campo-input:focus, .campo-textarea:focus { border-color: #3bb4a1; box-shadow: 0 0 0 3px rgba(59,180,161,.1); }
.campo-textarea { resize: vertical; min-height: 90px; }
.campo-select {
    width: 100%; padding: 10px 34px 10px 14px;
    border: 1.5px solid #e2e8f0; border-radius: 10px;
    font-size: 13px; color: #1e293b; font-family: inherit;
    background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 14px center;
    appearance: none; outline: none; cursor: pointer; transition: border-color .2s;
}
.campo-select:focus    { border-color: #3bb4a1; box-shadow: 0 0 0 3px rgba(59,180,161,.1); }
.campo-select:disabled { opacity: .5; cursor: not-allowed; }
.campo-error { font-size: 12px; color: #ef4444; font-weight: 600; }
.dos-col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

/* Salario */
.salario-wrap {
    display: flex; align-items: center;
    border: 1.5px solid #e2e8f0; border-radius: 10px; overflow: hidden; transition: border-color .2s;
}
.salario-error { border-color: #ef4444 !important; background: #fff5f5; }
.salario-focus { border-color: #3bb4a1; box-shadow: 0 0 0 3px rgba(59,180,161,.1); }
.salario-signo { padding: 0 4px 0 14px; font-size: 13px; font-weight: 700; color: #2a6b6d; user-select: none; flex-shrink: 0; }
.salario-input { flex: 1; padding: 10px 14px 10px 4px; background: transparent; border: none; outline: none; font-size: 13px; color: #1e293b; font-family: inherit; min-width: 0; }
.salario-input::placeholder { color: #cbd5e1; }

/* Tags / Habilidades */
.sugerencias-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.sugerencia-btn  { padding: 4px 12px; border-radius: 20px; background: #e1f5ee; color: #085041; border: 1px solid #5dcaa5; font-size: 12px; font-weight: 600; cursor: pointer; transition: background .15s; }
.sugerencia-btn:hover { background: #3bb4a1; color: white; border-color: #3bb4a1; }
.tags-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
.tag-chip { display: inline-flex; align-items: center; gap: 5px; background: rgba(59,180,161,.1); color: #2a6b6d; font-size: 12px; font-weight: 600; padding: 4px 8px 4px 12px; border-radius: 8px; }
.tag-quitar { display: flex; align-items: center; background: none; border: none; cursor: pointer; color: #94a3b8; padding: 0; transition: color .15s; }
.tag-quitar:hover { color: #ef4444; }

/* Confirm */
.confirm-desc { font-size: 13px; color: #64748b; line-height: 1.6; }

/* Botones modal */
.btn-cancelar { padding: 10px 20px; border: 1.5px solid #e2e8f0; background: white; color: #64748b; font-size: 13px; font-weight: 700; border-radius: 10px; cursor: pointer; font-family: inherit; }
.btn-cancelar:disabled { opacity: .5; cursor: not-allowed; }
.btn-guardar  { padding: 10px 24px; border: none; background: #2a6b6d; color: white; font-size: 13px; font-weight: 700; border-radius: 10px; cursor: pointer; font-family: inherit; transition: opacity .2s; }
.btn-guardar:hover    { opacity: .9; }
.btn-guardar:disabled { opacity: .6; cursor: not-allowed; }
.btn-peligro  { padding: 10px 24px; border: none; background: #dc2626; color: white; font-size: 13px; font-weight: 700; border-radius: 10px; cursor: pointer; font-family: inherit; transition: opacity .2s; }
.btn-peligro:hover    { opacity: .9; }
.btn-peligro:disabled { opacity: .6; cursor: not-allowed; }

/* Toast */
.toast       { position: fixed; bottom: 32px; right: 32px; padding: 14px 22px; border-radius: 14px; font-size: 13px; font-weight: 700; color: white; box-shadow: 0 8px 24px rgba(0,0,0,.12); z-index: 300; max-width: 360px; }
.toast.exito { background: #6a9a41; }
.toast.error { background: #9b3b3b; }

@media (max-width: 640px) {
    .dos-col { grid-template-columns: 1fr; }
}
</style>