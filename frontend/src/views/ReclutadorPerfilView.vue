<template>
    <div class="max-w-4xl mx-auto py-8 px-4">
        
        <!-- Estado de carga -->
        <div v-if="cargando" class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-suave border border-matcha/10">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-matcha border-t-transparent mb-4"></div>
            <p class="text-cerceta-light font-medium">Cargando perfil de reclutador...</p>
        </div>

        <!-- Estado de error -->
        <div v-else-if="error" class="bg-white p-12 rounded-3xl shadow-suave text-center border border-matcha/10 max-w-lg mx-auto">
            <span class="text-4xl mb-4 block">⚠️</span>
            <h3 class="text-xl font-extrabold text-cerceta mb-2">No se pudo cargar tu perfil</h3>
            <p class="text-cerceta-light text-sm mb-6">{{ error }}</p>
            <button class="bg-matcha text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-matcha/20 hover:bg-matcha-dark transition-all" @click="cargarPerfil">
                Reintentar
            </button>
        </div>

        <!-- Panel de Perfil -->
        <div v-else class="space-y-8">
            
            <!-- Encabezado de la Empresa -->
            <div class="bg-white rounded-3xl shadow-suave overflow-hidden border border-matcha/10">
                <!-- Banner decorativo superior -->
                <div class="h-28 bg-gradient-to-r from-cerceta to-matcha/70 relative"></div>
                
                <div class="px-8 pb-8 pt-4 flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
                    <!-- Icono / Logotipo de la Empresa -->
                    <div class="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-suave flex items-center justify-center text-4xl -mt-16 z-10 self-start md:self-auto">
                        🏢
                    </div>
                    
                    <div class="flex-1 -mt-2">
                        <h2 class="text-2xl font-extrabold text-cerceta tracking-tight">{{ nombreEmpresa }}</h2>
                        <p class="text-cerceta-light text-sm flex items-center gap-1.5 mt-1 font-medium">
                            <span>📍</span> {{ ubicacion || 'Ubicación no configurada' }}
                        </p>
                    </div>

                    <button class="bg-matcha text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-matcha/20 hover:bg-matcha-dark transition-all flex items-center gap-2 text-sm self-start md:self-auto hover:-translate-y-0.5" @click="abrirModalEdicion">
                        <span>✎</span> Editar Perfil
                    </button>
                </div>
            </div>

            <!-- Grilla de Información Detallada (3 Columnas en pantallas medianas) -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <!-- Datos de la Empresa -->
                <div class="bg-white rounded-2xl shadow-suave p-6 border border-matcha/5 space-y-5">
                    <h3 class="text-sm font-extrabold text-cerceta uppercase tracking-wider flex items-center gap-2">
                        <span class="w-1.5 h-4 bg-matcha rounded-full"></span> Información Corporativa
                    </h3>
                    
                    <div class="space-y-4 pt-2">
                        <div>
                            <span class="block text-xs font-semibold text-cerceta-light uppercase tracking-wider mb-1">Tipo de Empresa</span>
                            <span class="text-sm font-bold text-cerceta bg-fondo py-1.5 px-3 rounded-lg block truncate">{{ tipoEmpresa || 'No especificado' }}</span>
                        </div>
                        <div>
                            <span class="block text-xs font-semibold text-cerceta-light uppercase tracking-wider mb-1">Alcance</span>
                            <span class="text-sm font-bold text-cerceta bg-fondo py-1.5 px-3 rounded-lg block truncate">{{ alcance || 'No especificado' }}</span>
                        </div>
                        <div>
                            <span class="block text-xs font-semibold text-cerceta-light uppercase tracking-wider mb-1">Rubro / Industria</span>
                            <span class="text-sm font-bold text-cerceta bg-fondo py-1.5 px-3 rounded-lg block truncate">{{ rubro || 'No especificado' }}</span>
                        </div>
                    </div>
                </div>

                <!-- Preferencias Operativas -->
                <div class="bg-white rounded-2xl shadow-suave p-6 border border-matcha/5 space-y-5">
                    <h3 class="text-sm font-extrabold text-cerceta uppercase tracking-wider flex items-center gap-2">
                        <span class="w-1.5 h-4 bg-matcha rounded-full"></span> Preferencias Operativas
                    </h3>
                    
                    <div class="space-y-4 pt-2">
                        <div>
                            <span class="block text-xs font-semibold text-cerceta-light uppercase tracking-wider mb-1">Modalidad</span>
                            <span class="text-sm font-bold text-cerceta bg-fondo py-1.5 px-3 rounded-lg block truncate">{{ modalidad || 'No especificado' }}</span>
                        </div>
                        <div>
                            <span class="block text-xs font-semibold text-cerceta-light uppercase tracking-wider mb-1">Tipo de Contratación</span>
                            <span class="text-sm font-bold text-cerceta bg-fondo py-1.5 px-3 rounded-lg block truncate">{{ horario || 'No especificado' }}</span>
                        </div>
                        <div>
                            <span class="block text-xs font-semibold text-cerceta-light uppercase tracking-wider mb-1">Nivel de Perfiles</span>
                            <span class="text-sm font-bold text-cerceta bg-fondo py-1.5 px-3 rounded-lg block truncate">{{ nivelPuesto || 'No especificado' }}</span>
                        </div>
                    </div>
                </div>

                <!-- Cultura e Idioma -->
                <div class="bg-white rounded-2xl shadow-suave p-6 border border-matcha/5 space-y-6 flex flex-col justify-between">
                    <div>
                        <h3 class="text-sm font-extrabold text-cerceta uppercase tracking-wider flex items-center gap-2 mb-4">
                            <span class="w-1.5 h-4 bg-matcha rounded-full"></span> Cultura e Idioma
                        </h3>
                        
                        <div class="space-y-5 pt-2">
                            <div>
                                <span class="block text-xs font-semibold text-cerceta-light uppercase tracking-wider mb-2">Idioma de Trabajo</span>
                                <span class="inline-block text-sm font-bold text-matcha-dark bg-matcha/10 py-1.5 px-4 rounded-full">
                                    🗣️ {{ idioma || 'No especificado' }}
                                </span>
                            </div>

                            <div>
                                <span class="block text-xs font-semibold text-cerceta-light uppercase tracking-wider mb-2">Cultura Laboral</span>
                                <div v-if="culturaLaboral" class="inline-flex items-center gap-2 bg-cerceta/5 border border-cerceta/10 py-2.5 px-4 rounded-xl">
                                    <span class="text-base">✨</span>
                                    <span class="text-sm font-bold text-cerceta">{{ culturaLaboral }}</span>
                                </div>
                                <p v-else class="text-xs text-cerceta-light italic">No especificada</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>

        <!-- modal de Edición -->
        <div v-if="modalActivo" class="fixed inset-0 bg-cerceta/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="cerrarModalEdicion">
            <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-xl border border-matcha/5 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                
                <!-- Cabecera del modal -->
                <div class="px-8 pt-8 pb-4 border-b border-fondo flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">🏢</span>
                        <div>
                            <h3 class="text-lg font-extrabold text-cerceta">Editar Perfil de Empresa</h3>
                            <p class="text-xs text-cerceta-light">Mantén tu información corporativa actualizada</p>
                        </div>
                    </div>
                    <button class="w-8 h-8 rounded-lg bg-fondo hover:bg-matcha/10 hover:text-matcha flex items-center justify-center font-bold text-sm text-cerceta transition-colors" @click="cerrarModalEdicion">
                        ✕
                    </button>
                </div>

                <!-- Formulario del modal -->
                <form @submit.prevent="guardarPerfil" class="flex-1 overflow-y-auto px-8 py-6 space-y-5">
                    
                    <!-- Nombre de la empresa -->
                    <div>
                        <label class="block text-xs font-semibold text-cerceta uppercase tracking-wide mb-1.5">
                            Nombre de la Empresa *
                        </label>
                        <input v-model="form.nombre_empresa" type="text" class="w-full px-4 py-2.5 rounded-xl bg-fondo border border-transparent focus:border-matcha focus:bg-white focus:ring-4 focus:ring-matcha/10 outline-none transition-all text-sm text-cerceta" required />
                    </div>

                    <!-- Ubicación: Estado y Ciudad -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-cerceta uppercase tracking-wide mb-1.5">
                                Estado *
                            </label>
                            <select v-model="form.estado" @change="form.ciudad = ''" class="w-full px-4 py-2.5 rounded-xl bg-fondo border border-transparent focus:border-matcha focus:bg-white focus:ring-4 focus:ring-matcha/10 outline-none transition-all text-sm text-cerceta" required>
                                <option value="" disabled>Selecciona…</option>
                                <option v-for="est in estadosMexico" :key="est" :value="est">{{ est }}</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-cerceta uppercase tracking-wide mb-1.5">
                                Ciudad *
                            </label>
                            <select v-model="form.ciudad" :disabled="!form.estado" class="w-full px-4 py-2.5 rounded-xl bg-fondo border border-transparent focus:border-matcha focus:bg-white focus:ring-4 focus:ring-matcha/10 outline-none transition-all text-sm text-cerceta disabled:opacity-50" required>
                                <option value="" disabled>Selecciona…</option>
                                <option v-for="c in ciudadesPorEstado[form.estado] || []" :key="c" :value="c">{{ c }}</option>
                            </select>
                        </div>
                    </div>

                    <!-- Fila 2 columnas: Tipo y Alcance -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-cerceta uppercase tracking-wide mb-1.5">
                                Tipo de Empresa *
                            </label>
                            <select v-model="form.tipo_empresa" class="w-full px-4 py-2.5 rounded-xl bg-fondo border border-transparent focus:border-matcha focus:bg-white focus:ring-4 focus:ring-matcha/10 outline-none transition-all text-sm text-cerceta" required>
                                <option value="" disabled>Selecciona…</option>
                                <option>Startup</option>
                                <option>Corporativo</option>
                                <option>Agencia</option>
                                <option>PYME</option>
                                <option>Gobierno</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-cerceta uppercase tracking-wide mb-1.5">
                                Alcance *
                            </label>
                            <select v-model="form.alcance" class="w-full px-4 py-2.5 rounded-xl bg-fondo border border-transparent focus:border-matcha focus:bg-white focus:ring-4 focus:ring-matcha/10 outline-none transition-all text-sm text-cerceta" required>
                                <option value="" disabled>Selecciona…</option>
                                <option>Nacional</option>
                                <option>Internacional</option>
                            </select>
                        </div>
                    </div>

                    <!-- Fila 2 columnas: Rubro y Modalidad -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-cerceta uppercase tracking-wide mb-1.5">
                                Rubro / Industria *
                            </label>
                            <select v-model="form.rubro" class="w-full px-4 py-2.5 rounded-xl bg-fondo border border-transparent focus:border-matcha focus:bg-white focus:ring-4 focus:ring-matcha/10 outline-none transition-all text-sm text-cerceta" required>
                                <option value="" disabled>Selecciona la industria…</option>
                                <option v-for="rub in opcionesRubro" :key="rub" :value="rub">{{ rub }}</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-cerceta uppercase tracking-wide mb-1.5">
                                Modalidad *
                            </label>
                            <select v-model="form.modalidad" class="w-full px-4 py-2.5 rounded-xl bg-fondo border border-transparent focus:border-matcha focus:bg-white focus:ring-4 focus:ring-matcha/10 outline-none transition-all text-sm text-cerceta" required>
                                <option value="" disabled>Selecciona…</option>
                                <option>Presencial</option>
                                <option>Remoto</option>
                                <option>Híbrido</option>
                            </select>
                        </div>
                    </div>

                    <!-- Fila 2 columnas: Contratación e Idioma -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-cerceta uppercase tracking-wide mb-1.5">
                                Tipo de Contratación *
                            </label>
                            <select v-model="form.horario" class="w-full px-4 py-2.5 rounded-xl bg-fondo border border-transparent focus:border-matcha focus:bg-white focus:ring-4 focus:ring-matcha/10 outline-none transition-all text-sm text-cerceta" required>
                                <option value="" disabled>Selecciona…</option>
                                <option>Tiempo completo</option>
                                <option>Medio tiempo</option>
                                <option>Contrato</option>
                                <option>Becario</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-cerceta uppercase tracking-wide mb-1.5">
                                Nivel de Perfiles *
                            </label>
                            <select v-model="form.nivel_puesto" class="w-full px-4 py-2.5 rounded-xl bg-fondo border border-transparent focus:border-matcha focus:bg-white focus:ring-4 focus:ring-matcha/10 outline-none transition-all text-sm text-cerceta" required>
                                <option value="" disabled>Selecciona…</option>
                                <option>Junior</option>
                                <option>Mid</option>
                                <option>Senior</option>
                            </select>
                        </div>
                    </div>

                    <!-- Idioma -->
                    <div>
                        <label class="block text-xs font-semibold text-cerceta uppercase tracking-wide mb-1.5">
                            Idioma de Trabajo *
                        </label>
                        <select v-model="form.idioma" class="w-full px-4 py-2.5 rounded-xl bg-fondo border border-transparent focus:border-matcha focus:bg-white focus:ring-4 focus:ring-matcha/10 outline-none transition-all text-sm text-cerceta" required>
                            <option value="" disabled>Selecciona…</option>
                            <option>Español</option>
                            <option>Inglés</option>
                            <option>Ambos</option>
                        </select>
                    </div>

                    <!-- Cultura laboral -->
                    <div>
                        <label class="block text-xs font-semibold text-cerceta uppercase tracking-wide mb-2">
                            Cultura Laboral *
                        </label>
                        <div class="flex flex-wrap gap-2">
                            <button v-for="opcion in opcionesCultura" :key="opcion" type="button" @click="form.cultura_laboral = opcion" :class="form.cultura_laboral === opcion
                                ? 'bg-matcha text-white shadow-md shadow-matcha/30'
                                : 'bg-fondo text-cerceta hover:bg-matcha/10 hover:text-matcha'" class="px-4 py-2 rounded-xl text-xs font-semibold transition-all border border-transparent">
                                {{ opcion }}
                            </button>
                        </div>
                        <p v-if="intentoGuardar && !form.cultura_laboral" class="text-red-400 text-xs mt-1.5">
                            Selecciona una cultura laboral
                        </p>
                    </div>

                    <!-- Mensaje de error de la API -->
                    <p v-if="errorMensaje" class="text-red-400 text-xs text-center font-medium">{{ errorMensaje }}</p>

                </form>

                <!-- Botones de Acción -->
                <div class="px-8 py-5 border-t border-fondo flex justify-end gap-3 bg-fondo/30">
                    <button type="button" :disabled="guardando" class="px-5 py-2.5 rounded-xl font-bold text-sm text-cerceta-light hover:bg-fondo transition-all" @click="cerrarModalEdicion">
                        Cancelar
                    </button>
                    <button type="button" :disabled="guardando" class="px-6 py-2.5 bg-matcha text-white rounded-xl font-bold text-sm shadow-lg shadow-matcha/20 hover:bg-matcha-dark transition-all flex items-center gap-2 disabled:opacity-60" @click="guardarPerfil">
                        <span v-if="guardando" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                        <span>{{ guardando ? 'Guardando...' : 'Guardar Cambios' }}</span>
                    </button>
                </div>

            </div>
        </div>

        <!-- Toast de Notificación -->
        <div v-if="toast.show" class="fixed bottom-8 right-8 bg-cerceta text-white px-6 py-3.5 rounded-xl shadow-2xl text-sm font-bold transition-all z-50 flex items-center gap-2 border border-matcha/10 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <span>✨</span> {{ toast.message }}
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ciudadesPorEstado, estadosMexico } from '@/data/mexico-ciudades.js'

const URL_BASE_API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const opcionesCultura = ['Relajada', 'Alta exigencia', 'Trabajo en equipo', 'Autónomo']
const opcionesRubro = [
    'Tecnología',
    'Marketing y Publicidad',
    'Salud',
    'Educación',
    'Finanzas',
    'Manufactura',
    'Retail y Comercio',
    'Logística y Transporte',
    'Construcción',
    'Medios y Entretenimiento',
    'Consultoría',
    'Otro'
]

// Variables de Estado de Vista
const cargando = ref(true)
const guardando = ref(false)
const intentoGuardar = ref(false)
const error = ref(null)
const errorMensaje = ref('')
const modalActivo = ref(false)
const toast = ref({ show: false, message: '' })

// Datos del Reclutador en Vista
const nombreEmpresa = ref('')
const ubicacion = ref('')
const tipoEmpresa = ref('')
const modalidad = ref('')
const horario = ref('')
const nivelPuesto = ref('')
const idioma = ref('')
const culturaLaboral = ref('')
const alcance = ref('')
const rubro = ref('')

// Formulario de Edición
const form = ref({
    nombre_empresa: '',
    estado: '',
    ciudad: '',
    tipo_empresa: '',
    modalidad: '',
    horario: '',
    nivel_puesto: '',
    idioma: '',
    cultura_laboral: '',
    alcance: '',
    rubro: ''
})

const obtenerIdReclutador = () => {
    return localStorage.getItem('usuarioId') || null
}

const parsearUbicacion = (ubic) => {
    if (!ubic) {
        return { estado: '', ciudad: '' }
    }
    const partes = ubic.split(',').map((p) => {
        return p.trim()
    })
    if (partes.length >= 2) {
        return { ciudad: partes[0], estado: partes.slice(1).join(', ') }
    } else {
        return { estado: partes[0] || '', ciudad: '' }
    }
}

const asignarDatosReclutador = (reclutador) => {
    nombreEmpresa.value = reclutador.nombre_empresa || ''
    ubicacion.value = reclutador.ubicacion || ''
    tipoEmpresa.value = reclutador.tipo_empresa || ''
    modalidad.value = reclutador.modalidad || ''
    horario.value = reclutador.horario || ''
    nivelPuesto.value = reclutador.nivel_puesto || ''
    idioma.value = reclutador.idioma || ''
    culturaLaboral.value = reclutador.cultura_laboral || ''
    alcance.value = reclutador.alcance || ''
    rubro.value = reclutador.rubro || ''
}

const cargarPerfil = async () => {
    cargando.value = true
    error.value = null
    try {
        const id = obtenerIdReclutador()
        if (!id) {
            error.value = 'No se encontró tu sesión. Intenta iniciar sesión de nuevo.'
            return
        }
        const URL_COMPLETA = `${URL_BASE_API}/api/reclutadores/${id}`
        const respuesta = await fetch(URL_COMPLETA)
        if (!respuesta.ok) {
            throw new Error(`Error ${respuesta.status}`)
        }
        const datos = await respuesta.json()
        if (datos.ok && datos.reclutador) {
            asignarDatosReclutador(datos.reclutador)
        } else {
            error.value = 'No se pudo cargar la información del reclutador.'
        }
    } catch (err) {
        console.error(err)
        error.value = 'No se pudo conectar con el servidor.'
    } finally {
        cargando.value = false
    }
}

const abrirModalEdicion = () => {
    intentoGuardar.value = false
    errorMensaje.value = ''
    const { estado, ciudad } = parsearUbicacion(ubicacion.value)
    form.value = {
        nombre_empresa: nombreEmpresa.value,
        estado: estado,
        ciudad: ciudad,
        tipo_empresa: tipoEmpresa.value,
        modalidad: modalidad.value,
        horario: horario.value,
        nivel_puesto: nivelPuesto.value,
        idioma: idioma.value,
        cultura_laboral: culturaLaboral.value,
        alcance: alcance.value,
        rubro: rubro.value
    }
    modalActivo.value = true
}

const cerrarModalEdicion = () => {
    if (!guardando.value) {
        modalActivo.value = false
    }
}

const mostrarToast = (msg) => {
    toast.value = { show: true, message: msg }
    setTimeout(() => {
        toast.value.show = false
    }, 3000)
}

const construirCuerpoPeticion = (ubicacionFinal) => {
    return {
        nombre_empresa: form.value.nombre_empresa.trim(),
        ubicacion: ubicacionFinal,
        tipo_empresa: form.value.tipo_empresa,
        modalidad: form.value.modalidad,
        horario: form.value.horario,
        nivel_puesto: form.value.nivel_puesto,
        idioma: form.value.idioma,
        cultura_laboral: form.value.cultura_laboral,
        alcance: form.value.alcance,
        rubro: form.value.rubro
    }
}

const actualizarLocalStorageYEstado = (nombre, ubicacionFinal) => {
    nombreEmpresa.value = nombre
    ubicacion.value = ubicacionFinal
    tipoEmpresa.value = form.value.tipo_empresa
    modalidad.value = form.value.modalidad
    horario.value = form.value.horario
    nivelPuesto.value = form.value.nivel_puesto
    idioma.value = form.value.idioma
    culturaLaboral.value = form.value.cultura_laboral
    alcance.value = form.value.alcance
    rubro.value = form.value.rubro

    localStorage.setItem('nombreEmpresa', nombre)
    localStorage.setItem('nombreUsuario', nombre)
}

const guardarPerfil = async () => {
    intentoGuardar.value = true
    errorMensaje.value = ''

    if (!form.value.nombre_empresa?.trim() || !form.value.estado || !form.value.ciudad || !form.value.tipo_empresa || !form.value.alcance || !form.value.rubro || !form.value.cultura_laboral) {
        return
    }

    const id = obtenerIdReclutador()
    if (!id) {
        return
    }

    const ubicacionFinal = `${form.value.ciudad}, ${form.value.estado}`
    guardando.value = true

    try {
        const cuerpoPeticion = construirCuerpoPeticion(ubicacionFinal)
        const URL_COMPLETA = `${URL_BASE_API}/api/reclutadores/${id}`
        const respuesta = await fetch(URL_COMPLETA, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cuerpoPeticion)
        })

        const datos = await respuesta.json()
        if (!respuesta.ok) {
            errorMensaje.value = datos.mensaje || 'Error al guardar el perfil.'
            return
        }

        actualizarLocalStorageYEstado(cuerpoPeticion.nombre_empresa, ubicacionFinal)
        mostrarToast('¡Perfil de empresa actualizado correctamente! ✨')
        modalActivo.value = false
    } catch (e) {
        console.error(e)
        errorMensaje.value = 'Error de conexión con el servidor.'
    } finally {
        guardando.value = false
    }
}

onMounted(() => {
    cargarPerfil()
})
</script>
