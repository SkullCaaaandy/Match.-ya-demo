<template>
    <div class="contenedor-perfil">

        <div v-if="cargando" class="estado-carga">
            <div class="spinner"></div>
            <p>Cargando perfil...</p>
        </div>

        <div v-else-if="error" class="estado-error">
            <p class="error-icono">⚠️</p>
            <p class="error-titulo">No se pudo cargar tu perfil</p>
            <p class="error-desc">{{ error }}</p>
            <button class="btn-reintentar" @click="cargarPerfil">Reintentar</button>
        </div>

        <div v-else class="grilla-perfil">

            <!-- ── COLUMNA IZQUIERDA ── -->
            <div class="tarjeta-perfil">
                <div class="banner">
                    <div class="avatar">{{ iniciales }}</div>
                </div>
                <div class="cuerpo">

                    <div class="fila-top">
                        <div>
                            <h2 class="nombre" :class="{ 'texto-placeholder': !nombreCandidato }">
                                {{ nombreCandidato || 'Tu nombre aquí' }}
                            </h2>
                            <p class="rol" :class="{ 'texto-placeholder': !rolProfesional }">
                                {{ rolProfesional || 'Ej: Diseñadora UX | Analista de Datos' }}
                            </p>
                            <p class="ubicacion" :class="{ 'texto-placeholder': !ubicacion }">
                                📍 {{ ubicacion || 'Tu ciudad, Estado' }}
                            </p>
                        </div>
                        <div class="toggle-wrap">
                            <span class="toggle-label">Búsqueda Activa</span>
                            <button @click="alternarBusqueda"
                                :class="busquedaActiva ? 'toggle-on' : 'toggle-off'"
                                class="toggle-btn">
                                <span :class="busquedaActiva ? 'perilla-on' : 'perilla-off'" class="perilla"/>
                            </button>
                        </div>
                    </div>

                    <button class="btn-editar-seccion" @click="abrirModal('info')">✎ Editar información</button>

                    <div class="divisor"/>

                    <!-- Top Skills -->
                    <div class="seccion">
                        <h3 class="seccion-titulo">Top Skills</h3>
                        <div class="chips" v-if="topSkills.length">
                            <span v-for="s in topSkills" :key="s.id" class="chip">{{ s.nombre }}</span>
                        </div>
                        <p v-else class="texto-placeholder-sec">Agrega habilidades técnicas para verlas aquí</p>
                    </div>

                    <!-- Habilidades técnicas -->
                    <div class="seccion">
                        <div class="seccion-header">
                            <h3 class="seccion-titulo">Habilidades Técnicas</h3>
                            <button class="btn-editar-seccion" @click="abrirModal('habilidades')">✎ Editar</button>
                        </div>
                        <div class="chips" v-if="habilidadesTecnicas.length">
                            <span v-for="h in habilidadesTecnicas" :key="h.id" class="chip">{{ h.nombre }}</span>
                        </div>
                        <p v-else class="texto-placeholder-sec">Ej: Python, Figma, Enfermería, Contabilidad...</p>
                    </div>

                    <!-- Habilidades adicionales -->
                    <div class="seccion">
                        <h3 class="seccion-titulo">Habilidades Adicionales</h3>
                        <div class="chips" v-if="habilidadesAdicionales.length">
                            <span v-for="h in habilidadesAdicionales" :key="h.id" class="chip chip-adicional">{{ h.nombre }}</span>
                        </div>
                        <p v-else class="texto-placeholder-sec">Ej: Inglés (B2), Liderazgo, Trabajo en equipo...</p>
                    </div>

                    <!-- Sobre mí -->
                    <div class="seccion">
                        <div class="seccion-header">
                            <h3 class="seccion-titulo">Sobre mí</h3>
                            <button class="btn-editar-seccion" @click="abrirModal('descripcion')">✎ Editar</button>
                        </div>
                        <p class="texto-descripcion" :class="{ 'texto-placeholder': !descripcion }">
                            {{ descripcion || 'Cuéntanos sobre tu experiencia, fortalezas y objetivos profesionales...' }}
                        </p>
                    </div>

                    <!-- Documentos / CV -->
                    <div class="seccion">
                        <h3 class="seccion-titulo">Documentos</h3>
                        <div class="zona-cv">
                            <div class="cv-info" v-if="cvNombre">
                                <span class="cv-icono">📄</span>
                                <div>
                                    <p class="cv-nombre">{{ cvNombre }}</p>
                                    <p class="cv-fecha">CV subido correctamente</p>
                                </div>
                            </div>
                            <p v-else class="texto-placeholder-sec" style="flex:1">
                                Sin CV — sube tu CV en PDF para que los reclutadores puedan verlo
                            </p>
                            <label class="btn-actualizar-cv" :class="{ 'btn-cargando': subiendoCV }">
                                <input type="file" accept="application/pdf" @change="manejarCV"
                                    style="display:none" :disabled="subiendoCV"/>
                                {{ subiendoCV ? 'Subiendo...' : cvNombre ? '⬆ Actualizar' : '⬆ Subir CV' }}
                            </label>
                        </div>
                        <p v-if="errorCV" class="error-campo">{{ errorCV }}</p>
                    </div>

                    <!-- Portafolio -->
                    <div class="seccion" style="margin-bottom:0">
                        <div class="seccion-header">
                            <h3 class="seccion-titulo">Portafolio Destacado</h3>
                            <button class="btn-editar-seccion" @click="abrirModal('portafolio')">✎ Editar</button>
                        </div>
                        <div class="grilla-portafolio" v-if="portafolio.length">
                            <div v-for="p in portafolio" :key="p.titulo" class="item-portafolio">
                                <h4>{{ p.titulo }}</h4>
                                <p>{{ p.descripcion }}</p>
                            </div>
                        </div>
                        <p v-else class="texto-placeholder-sec">
                            Ej: Proyecto de tesis, App desarrollada, Campaña de marketing...
                        </p>
                    </div>

                </div>
            </div>

            <!-- ── COLUMNA DERECHA ── -->
            <div class="columna-preview">
                <div class="etiqueta-wrap">
                    <div class="etiqueta-preview">
                        <span class="punto-preview"></span>
                        Vista del reclutador
                    </div>
                    <p class="hint-preview">
                        Esta es tu ficha pública. Edita tu perfil para actualizarla en tiempo real.
                    </p>
                </div>

                <FichaCandidato
                    :nombre="nombreCandidato || 'Tu nombre'"
                    :rol="rolProfesional || 'Tu rol profesional'"
                    :ubicacion="ubicacion || 'Tu ubicación'"
                    :porcentaje="porcentajeMatch"
                    :habilidades="habilidadesTecnicas.map(h => h.nombre)"
                    :habilidadesExtra="habilidadesAdicionales.map(h => h.nombre)"
                    :descripcion="resumenDescripcion || 'Agrega una descripción para aparecer aquí'"
                    :previewMode="true"
                />

                <!-- Leyenda profesional del porcentaje -->
                <p class="leyenda-match">
                    El porcentaje de compatibilidad mostrado es referencial. El valor real varía en función de los requisitos específicos de cada vacante a la que apliques.
                </p>
            </div>

        </div>

        <!-- ════════ MODAL: INFORMACIÓN ════════ -->
        <div v-if="modalActivo === 'info'" class="modal-overlay" @click.self="cerrarModal">
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-titulo">Editar información</h3>
                    <button class="modal-cerrar" @click="cerrarModal">✕</button>
                </div>
                <div class="modal-cuerpo">
                    <div class="campo-form">
                        <label class="campo-label">Nombre completo *</label>
                        <input v-model="form.nombreCandidato" class="campo-input" type="text"
                            placeholder="Ej: Ana Sofía Mendoza Ruiz" maxlength="150"/>
                        <span v-if="erroresForm.nombre" class="campo-error">{{ erroresForm.nombre }}</span>
                    </div>
                    <div class="campo-form">
                        <label class="campo-label">Rol profesional</label>
                        <input v-model="form.rolProfesional" class="campo-input" type="text"
                            placeholder="Ej: Analista de Ciberseguridad | Diseñadora UX" maxlength="150"/>
                    </div>
                    <div class="campo-form">
                        <label class="campo-label">Estado</label>
                        <select v-model="form.estado" class="campo-input" @change="form.ciudad = ''">
                            <option value="">— Selecciona un estado —</option>
                            <option value="Remoto / Home office">Remoto / Home office</option>
                            <option v-for="est in estadosMexico" :key="est" :value="est">{{ est }}</option>
                        </select>
                    </div>
                    <div class="campo-form" v-if="form.estado && form.estado !== 'Remoto / Home office'">
                        <label class="campo-label">Ciudad</label>
                        <select v-model="form.ciudad" class="campo-input">
                            <option value="">— Selecciona una ciudad —</option>
                            <option v-for="c in ciudadesPorEstado[form.estado] || []" :key="c" :value="c">{{ c }}</option>
                        </select>
                        <span v-if="erroresForm.ciudad" class="campo-error">{{ erroresForm.ciudad }}</span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancelar" @click="cerrarModal" :disabled="guardando">Cancelar</button>
                    <button class="btn-guardar" @click="guardarInfo" :disabled="guardando">
                        {{ guardando ? 'Guardando...' : 'Guardar cambios' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- ════════ MODAL: SOBRE MÍ ════════ -->
        <div v-if="modalActivo === 'descripcion'" class="modal-overlay" @click.self="cerrarModal">
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-titulo">Editar Sobre mí</h3>
                    <button class="modal-cerrar" @click="cerrarModal">✕</button>
                </div>
                <div class="modal-cuerpo">
                    <div class="campo-form">
                        <label class="campo-label">Sobre mí</label>
                        <textarea v-model="form.descripcion" class="campo-textarea"
                            placeholder="Ej: Especialista en marketing digital con 3 años de experiencia. Apasionada por los datos y el contenido creativo. Busco contribuir en empresas innovadoras donde pueda crecer profesionalmente..."
                            rows="6" maxlength="500"></textarea>
                        <div style="display:flex; justify-content:flex-end">
                            <span class="campo-contador">{{ form.descripcion?.length || 0 }}/500</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancelar" @click="cerrarModal" :disabled="guardando">Cancelar</button>
                    <button class="btn-guardar" @click="guardarDescripcion" :disabled="guardando">
                        {{ guardando ? 'Guardando...' : 'Guardar' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- ════════ MODAL: HABILIDADES ════════ -->
        <div v-if="modalActivo === 'habilidades'" class="modal-overlay" @click.self="cerrarModal">
            <div class="modal modal-grande">
                <div class="modal-header">
                    <h3 class="modal-titulo">Editar habilidades</h3>
                    <button class="modal-cerrar" @click="cerrarModal">✕</button>
                </div>
                <div class="modal-cuerpo">
                    <div class="campo-form">
                        <label class="campo-label">Escribe una habilidad y presiona Enter</label>
                        <input v-model="busquedaEtiqueta" class="campo-input" type="text"
                            placeholder="Ej: Python, Figma, Enfermería, Inglés, Liderazgo..."
                            @input="buscarSugerencias"
                            @keydown.enter.prevent="agregarPorEnter"/>
                        <div v-if="sugerencias.length" class="lista-sugerencias">
                            <button v-for="et in sugerencias" :key="et.id_etiqueta"
                                class="sugerencia-item" @click="agregarEtiqueta(et)">
                                + {{ et.nombre }}
                            </button>
                        </div>
                        <div v-else-if="busquedaEtiqueta.trim() && !buscandoSugerencias"
                            class="nueva-etiqueta-wrap">
                            <p class="nueva-etiqueta-hint">No encontrada —</p>
                            <button class="btn-nueva-etiqueta" @click="agregarNueva">
                                + Agregar "{{ busquedaEtiqueta.trim() }}"
                            </button>
                        </div>
                    </div>
                    <div v-if="etiquetaPendiente" class="selector-tipo">
                        <p class="campo-label">¿Cómo clasificas <strong>"{{ etiquetaPendiente.nombre }}"</strong>?</p>
                        <div class="tipo-botones">
                            <button class="btn-tipo" @click="confirmarEtiqueta('tecnico')">Técnica</button>
                            <button class="btn-tipo btn-tipo-adicional" @click="confirmarEtiqueta('adicional')">Adicional</button>
                            <button class="btn-cancelar-tipo" @click="etiquetaPendiente = null">Cancelar</button>
                        </div>
                    </div>
                    <div class="campo-form">
                        <label class="campo-label">Habilidades técnicas</label>
                        <div class="chips-editables" v-if="form.tecnicas.length">
                            <span v-for="h in form.tecnicas" :key="h.nombre" class="chip chip-editable">
                                {{ h.nombre }}
                                <button @click="quitarEtiqueta(h, 'tecnico')" class="chip-quitar">×</button>
                            </span>
                        </div>
                        <p v-else class="texto-placeholder-sec">Ninguna — escribe arriba para agregar</p>
                    </div>
                    <div class="campo-form">
                        <label class="campo-label">Habilidades adicionales</label>
                        <div class="chips-editables" v-if="form.adicionales.length">
                            <span v-for="h in form.adicionales" :key="h.nombre" class="chip chip-editable chip-adicional">
                                {{ h.nombre }}
                                <button @click="quitarEtiqueta(h, 'adicional')" class="chip-quitar">×</button>
                            </span>
                        </div>
                        <p v-else class="texto-placeholder-sec">Ninguna — escribe arriba para agregar</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancelar" @click="cerrarModal" :disabled="guardando">Cancelar</button>
                    <button class="btn-guardar" @click="guardarHabilidades" :disabled="guardando">
                        {{ guardando ? 'Guardando...' : 'Guardar habilidades' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- ════════ MODAL: PORTAFOLIO ════════ -->
        <div v-if="modalActivo === 'portafolio'" class="modal-overlay" @click.self="cerrarModal">
            <div class="modal modal-grande">
                <div class="modal-header">
                    <h3 class="modal-titulo">Editar portafolio</h3>
                    <button class="modal-cerrar" @click="cerrarModal">✕</button>
                </div>
                <div class="modal-cuerpo">
                    <div v-for="(proyecto, i) in form.portafolio" :key="i" class="proyecto-form">
                        <div class="proyecto-header">
                            <span class="campo-label">Proyecto {{ i + 1 }}</span>
                            <button class="btn-quitar-proyecto" @click="quitarProyecto(i)">✕ Eliminar</button>
                        </div>
                        <input v-model="proyecto.titulo" class="campo-input" type="text"
                            placeholder="Ej: Campaña de Marketing Digital, App de Salud, Tesis"
                            maxlength="80"/>
                        <textarea v-model="proyecto.descripcion" class="campo-textarea"
                            placeholder="Describe brevemente el proyecto: objetivo, tecnologías usadas o logros obtenidos..."
                            rows="3" maxlength="300" style="margin-top:8px"></textarea>
                        <div style="display:flex;justify-content:flex-end">
                            <span class="campo-contador">{{ proyecto.descripcion?.length || 0 }}/300</span>
                        </div>
                    </div>
                    <button class="btn-agregar-proyecto" @click="agregarProyecto">
                        + Agregar proyecto
                    </button>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancelar" @click="cerrarModal" :disabled="guardando">Cancelar</button>
                    <button class="btn-guardar" @click="guardarPortafolio" :disabled="guardando">
                        {{ guardando ? 'Guardando...' : 'Guardar portafolio' }}
                    </button>
                </div>
            </div>
        </div>

        <div v-if="toast.visible" :class="['toast', toast.tipo]">{{ toast.mensaje }}</div>

    </div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'
    import FichaCandidato from '@/components/FichaCandidato.vue'
    import { ciudadesPorEstado, estadosMexico } from '@/data/mexico-ciudades.js'

    const URL_BASE_API = import.meta.env.VITE_API_URL

    const nombreCandidato        = ref('')
    const rolProfesional         = ref('')
    const ubicacion              = ref('')
    const descripcion            = ref('')
    const busquedaActiva         = ref(false)
    const habilidadesTecnicas    = ref([])
    const habilidadesAdicionales = ref([])
    const portafolio             = ref([])
    const cvNombre               = ref('')
    const cvUrl                  = ref('')
    const cargando               = ref(true)
    const guardando              = ref(false)
    const subiendoCV             = ref(false)
    const errorCV                = ref('')
    const error                  = ref(null)

    const iniciales = computed(() => {
        if (!nombreCandidato.value) return '?'
        return nombreCandidato.value.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase()
    })
    const topSkills = computed(() => habilidadesTecnicas.value.slice(0, 3))
    const resumenDescripcion = computed(() => {
        const texto = descripcion.value || ''
        return texto.length > 150 ? texto.slice(0, 150) + '...' : texto
    })
    const porcentajeMatch = computed(() => {
        let p = 0
        if (nombreCandidato.value)               p += 20
        if (rolProfesional.value)                p += 15
        if (ubicacion.value)                     p += 10
        if (descripcion.value)                   p += 15
        if (habilidadesTecnicas.value.length)    p += 20
        if (habilidadesAdicionales.value.length) p += 10
        if (cvUrl.value)                         p += 10
        return p
    })

    const modalActivo         = ref(null)
    const form                = ref({})
    const erroresForm         = ref({ nombre: '', ciudad: '' })
    const busquedaEtiqueta    = ref('')
    const sugerencias         = ref([])
    const buscandoSugerencias = ref(false)
    const etiquetaPendiente   = ref(null)
    let   timerBusqueda       = null

    const parsearUbicacion = (ubic) => {
        if (!ubic) return { estado: '', ciudad: '' }
        if (ubic === 'Remoto / Home office') return { estado: 'Remoto / Home office', ciudad: '' }
        const partes = ubic.split(',').map(p => p.trim())
        return partes.length >= 2
            ? { ciudad: partes[0], estado: partes.slice(1).join(', ') }
            : { estado: partes[0] || '', ciudad: '' }
    }

    const abrirModal = (tipo) => {
        erroresForm.value       = { nombre: '', ciudad: '' }
        busquedaEtiqueta.value  = ''
        sugerencias.value       = []
        etiquetaPendiente.value = null
        errorCV.value           = ''
        if (tipo === 'info') {
            const { estado, ciudad } = parsearUbicacion(ubicacion.value)
            form.value = { nombreCandidato: nombreCandidato.value, rolProfesional: rolProfesional.value, estado, ciudad }
        } else if (tipo === 'descripcion') {
            form.value = { descripcion: descripcion.value }
        } else if (tipo === 'habilidades') {
            form.value = {
                tecnicas:    habilidadesTecnicas.value.map(h => ({ id_etiqueta: h.id, nombre: h.nombre })),
                adicionales: habilidadesAdicionales.value.map(h => ({ id_etiqueta: h.id, nombre: h.nombre }))
            }
        } else if (tipo === 'portafolio') {
            form.value = { portafolio: portafolio.value.map(p => ({ ...p })) }
        }
        modalActivo.value = tipo
    }

    const cerrarModal = () => { if (!guardando.value) modalActivo.value = null }

    const buscarSugerencias = () => {
        clearTimeout(timerBusqueda)
        const texto = busquedaEtiqueta.value.trim()
        if (!texto) { sugerencias.value = []; return }
        buscandoSugerencias.value = true
        timerBusqueda = setTimeout(async () => {
            try {
                const r = await fetch(`${URL_BASE_API}/api/perfil/etiquetas/buscar?q=${encodeURIComponent(texto)}`)
                if (r.ok) {
                    const datos = await r.json()
                    const ya = [...(form.value.tecnicas || []), ...(form.value.adicionales || [])].map(h => h.id_etiqueta)
                    sugerencias.value = datos.filter(et => !ya.includes(et.id_etiqueta))
                }
            } catch { sugerencias.value = [] }
            finally   { buscandoSugerencias.value = false }
        }, 300)
    }

    const agregarEtiqueta = (et) => {
        etiquetaPendiente.value = { id_etiqueta: et.id_etiqueta, nombre: et.nombre }
        busquedaEtiqueta.value  = ''
        sugerencias.value       = []
    }
    const agregarPorEnter = () => {
        const texto = busquedaEtiqueta.value.trim()
        if (!texto) return
        const coincidencia = sugerencias.value.find(s => s.nombre.toLowerCase() === texto.toLowerCase())
        if (coincidencia) agregarEtiqueta(coincidencia)
        else              agregarNueva()
    }
    const agregarNueva = () => {
        const texto = busquedaEtiqueta.value.trim()
        if (!texto) return
        etiquetaPendiente.value = { id_etiqueta: null, nombre: texto }
        busquedaEtiqueta.value  = ''
        sugerencias.value       = []
    }
    const confirmarEtiqueta = (nivel) => {
        const et = etiquetaPendiente.value
        if (!et) return
        if (nivel === 'tecnico') form.value.tecnicas.push({ id_etiqueta: et.id_etiqueta, nombre: et.nombre })
        else                     form.value.adicionales.push({ id_etiqueta: et.id_etiqueta, nombre: et.nombre })
        etiquetaPendiente.value = null
    }
    const quitarEtiqueta = (h, tipo) => {
        if (tipo === 'tecnico') form.value.tecnicas    = form.value.tecnicas.filter(t => t.nombre !== h.nombre)
        else                   form.value.adicionales = form.value.adicionales.filter(a => a.nombre !== h.nombre)
    }
    const agregarProyecto = () => form.value.portafolio.push({ titulo: '', descripcion: '' })
    const quitarProyecto  = (i) => form.value.portafolio.splice(i, 1)

    const toast = ref({ visible: false, mensaje: '', tipo: 'exito' })
    const mostrarToast = (mensaje, tipo = 'exito') => {
        toast.value = { visible: true, mensaje, tipo }
        setTimeout(() => { toast.value.visible = false }, 3000)
    }

    const obtenerIdCandidato = () =>
        localStorage.getItem('usuarioId') || localStorage.getItem('candidato_id') || null

    const parsearRespuesta = async (r) => {
        const texto = await r.text()
        try { return JSON.parse(texto) }
        catch { throw new Error('Error de comunicación con el servidor. Verifica que el backend esté corriendo en el puerto 3000.') }
    }

    const cargarPerfil = async () => {
        cargando.value = true
        error.value    = null
        try {
            const id = obtenerIdCandidato()
            if (!id) { error.value = 'No se encontró tu sesión. Intenta iniciar sesión de nuevo.'; return }
            const r = await fetch(`${URL_BASE_API}/api/perfil/${id}`)
            if (r.status === 404) { error.value = 'No se encontró tu perfil.'; return }
            if (!r.ok) throw new Error(`Error ${r.status}`)
            const datos = await parsearRespuesta(r)
            nombreCandidato.value        = datos.nombre_completo         || ''
            rolProfesional.value         = datos.rol_profesional         || ''
            ubicacion.value              = datos.ubicacion               || ''
            descripcion.value            = datos.descripcion             || ''
            busquedaActiva.value         = datos.busqueda_activa         ?? false
            habilidadesTecnicas.value    = datos.habilidades_tecnicas    || []
            habilidadesAdicionales.value = datos.habilidades_adicionales || []
            portafolio.value             = datos.portafolio              || []
            cvNombre.value               = datos.cv_nombre               || ''
            cvUrl.value                  = datos.cv_url                  || ''
        } catch { error.value = 'No se pudo conectar con el servidor.' }
        finally  { cargando.value = false }
    }

    const guardarInfo = async () => {
        erroresForm.value = { nombre: '', ciudad: '' }
        if (!form.value.nombreCandidato?.trim()) { erroresForm.value.nombre = 'El nombre no puede estar vacío.'; return }
        if (form.value.estado && form.value.estado !== 'Remoto / Home office' && !form.value.ciudad) { erroresForm.value.ciudad = 'Selecciona una ciudad.'; return }
        let ubicacionFinal = ''
        if (form.value.estado === 'Remoto / Home office')   ubicacionFinal = 'Remoto / Home office'
        else if (form.value.estado && form.value.ciudad)     ubicacionFinal = `${form.value.ciudad}, ${form.value.estado}`
        else if (form.value.estado)                          ubicacionFinal = form.value.estado
        guardando.value = true
        try {
            const r = await fetch(`${URL_BASE_API}/api/perfil/${obtenerIdCandidato()}`, {
                method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre_completo: form.value.nombreCandidato.trim(), rol_profesional: form.value.rolProfesional?.trim(), ubicacion: ubicacionFinal, descripcion: descripcion.value })
            })
            if (!r.ok) { const d = await parsearRespuesta(r); throw new Error(d.mensaje || `Error ${r.status}`) }
            nombreCandidato.value = form.value.nombreCandidato.trim()
            rolProfesional.value  = form.value.rolProfesional?.trim()
            ubicacion.value       = ubicacionFinal
            modalActivo.value     = null
            mostrarToast('Información actualizada')
        } catch (ex) { mostrarToast(ex.message || 'No se pudo guardar.', 'error') }
        finally       { guardando.value = false }
    }

    const guardarDescripcion = async () => {
        guardando.value = true
        try {
            const r = await fetch(`${URL_BASE_API}/api/perfil/${obtenerIdCandidato()}`, {
                method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre_completo: nombreCandidato.value, rol_profesional: rolProfesional.value, ubicacion: ubicacion.value, descripcion: form.value.descripcion?.trim() })
            })
            if (!r.ok) { const d = await parsearRespuesta(r); throw new Error(d.mensaje || `Error ${r.status}`) }
            descripcion.value = form.value.descripcion?.trim()
            modalActivo.value = null
            mostrarToast('Descripción actualizada')
        } catch (ex) { mostrarToast(ex.message || 'No se pudo guardar.', 'error') }
        finally       { guardando.value = false }
    }

    const guardarHabilidades = async () => {
        guardando.value = true
        try {
            const r = await fetch(`${URL_BASE_API}/api/perfil/${obtenerIdCandidato()}/habilidades`, {
                method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tecnicas: form.value.tecnicas, adicionales: form.value.adicionales })
            })
            if (!r.ok) { const d = await parsearRespuesta(r); throw new Error(d.mensaje || `Error ${r.status}`) }
            habilidadesTecnicas.value    = form.value.tecnicas.map(h => ({ id: h.id_etiqueta, nombre: h.nombre }))
            habilidadesAdicionales.value = form.value.adicionales.map(h => ({ id: h.id_etiqueta, nombre: h.nombre }))
            modalActivo.value = null
            mostrarToast('Habilidades actualizadas')
        } catch (ex) { mostrarToast(ex.message || 'No se pudo guardar.', 'error') }
        finally       { guardando.value = false }
    }

    const manejarCV = async (evento) => {
        const archivo = evento.target.files?.[0]
        errorCV.value = ''
        if (!archivo) return
        if (archivo.type !== 'application/pdf') { errorCV.value = 'Solo se permiten archivos PDF.'; evento.target.value = ''; return }
        if (archivo.size > 5 * 1024 * 1024)    { errorCV.value = 'El archivo supera el límite de 5 MB.'; evento.target.value = ''; return }
        subiendoCV.value = true
        try {
            const fd = new FormData()
            fd.append('cv', archivo)
            const r    = await fetch(`${URL_BASE_API}/api/perfil/${obtenerIdCandidato()}/cv`, { method: 'POST', body: fd })
            const datos = await parsearRespuesta(r)
            if (!r.ok) throw new Error(datos.mensaje || `Error ${r.status}`)
            cvNombre.value = datos.cv_nombre
            cvUrl.value    = datos.cv_url
            mostrarToast('CV subido correctamente')
        } catch (ex) { errorCV.value = ex.message || 'No se pudo subir el CV.' }
        finally       { subiendoCV.value = false; evento.target.value = '' }
    }

    const guardarPortafolio = async () => {
        const validos = form.value.portafolio.filter(p => p.titulo?.trim())
        guardando.value = true
        try {
            const r = await fetch(`${URL_BASE_API}/api/perfil/${obtenerIdCandidato()}/portafolio`, {
                method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ portafolio: validos })
            })
            if (!r.ok) { const d = await parsearRespuesta(r); throw new Error(d.mensaje || `Error ${r.status}`) }
            portafolio.value  = validos
            modalActivo.value = null
            mostrarToast('Portafolio actualizado')
        } catch (ex) { mostrarToast(ex.message || 'No se pudo guardar.', 'error') }
        finally       { guardando.value = false }
    }

    const alternarBusqueda = async () => {
        const anterior       = busquedaActiva.value
        busquedaActiva.value = !anterior
        try {
            const r = await fetch(`${URL_BASE_API}/api/perfil/${obtenerIdCandidato()}/busqueda`, {
                method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ busqueda_activa: busquedaActiva.value })
            })
            if (!r.ok) throw new Error()
            mostrarToast(busquedaActiva.value ? 'Búsqueda activa — eres visible para reclutadores' : 'Búsqueda desactivada', busquedaActiva.value ? 'exito' : 'info')
        } catch { busquedaActiva.value = anterior; mostrarToast('No se pudo actualizar. Intenta de nuevo.', 'error') }
    }

    onMounted(() => cargarPerfil())
</script>

<style scoped>
    .contenedor-perfil { min-height: calc(100vh - 80px); background-color: #f8fafc; padding: 28px 32px; }

    .grilla-perfil {
        display: grid;
        grid-template-columns: 3fr 1fr;
        gap: 20px;
        width: 100%;
        margin: 0 auto;
        align-items: start;
    }

    .tarjeta-perfil { background: white; border-radius: 20px; overflow: visible; box-shadow: 0 2px 16px rgba(0,0,0,0.06); width: 100%; }
    .banner { background: #2a6b6d; height: 110px; position: relative; border-radius: 20px 20px 0 0; }
    .avatar { position: absolute; bottom: -32px; left: 28px; width: 72px; height: 72px; border-radius: 50%; background: #e1f5ee; border: 4px solid white; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 800; color: #2a6b6d; }
    .cuerpo { padding: 52px 40px 36px; }

    .fila-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 12px; }
    .nombre   { font-size: 22px; font-weight: 800; color: #1e293b; margin-bottom: 4px; }
    .rol      { font-size: 13px; color: #2a6b6d; font-weight: 600; margin-bottom: 2px; }
    .ubicacion { font-size: 12px; color: #94a3b8; }

    .texto-placeholder     { color: #cbd5e1 !important; font-style: italic; }
    .texto-placeholder-sec { font-size: 12px; color: #cbd5e1; font-style: italic; }

    .toggle-wrap  { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; flex-shrink: 0; }
    .toggle-label { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
    .toggle-btn   { position: relative; width: 42px; height: 23px; border-radius: 12px; border: none; cursor: pointer; padding: 0; transition: background 0.25s; }
    .toggle-on    { background: #2a6b6d; }
    .toggle-off   { background: #cbd5e1; }
    .perilla      { position: absolute; top: 3px; width: 17px; height: 17px; border-radius: 50%; background: white; transition: left 0.25s; }
    .perilla-on   { left: 22px; }
    .perilla-off  { left: 3px; }

    .btn-editar-seccion { font-size: 11px; font-weight: 700; color: #2a6b6d; background: rgba(42,107,109,0.08); border: none; border-radius: 8px; padding: 4px 12px; cursor: pointer; transition: background 0.2s; }
    .btn-editar-seccion:hover { background: rgba(42,107,109,0.16); }

    .divisor { height: 1px; background: #f1f5f9; margin: 16px 0; }
    .seccion        { margin-bottom: 20px; }
    .seccion-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .seccion-titulo { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }

    .chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .chip  { padding: 6px 14px; background: white; border: 1.5px solid #e2e8f0; color: #334155; font-size: 12px; font-weight: 600; border-radius: 8px; }
    .chip-adicional { background: #f8fafc; color: #64748b; }
    .texto-descripcion { font-size: 13px; color: #475569; line-height: 1.7; }

    .zona-cv  { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 12px; background: #f8fafc; }
    .cv-info  { display: flex; align-items: center; gap: 8px; flex: 1; }
    .cv-icono { font-size: 20px; }
    .cv-nombre { font-size: 12px; font-weight: 600; color: #334155; margin: 0; }
    .cv-fecha  { font-size: 10px; color: #94a3b8; margin: 2px 0 0; }
    .error-campo { font-size: 11px; color: #9b3b3b; margin-top: 6px; font-weight: 600; }
    .btn-actualizar-cv { padding: 8px 16px; border: 2px dashed #2a6b6d; background: transparent; color: #2a6b6d; font-weight: 700; font-size: 12px; border-radius: 12px; cursor: pointer; white-space: nowrap; transition: all 0.2s; font-family: inherit; }
    .btn-actualizar-cv:hover { background: #2a6b6d; color: white; }
    .btn-cargando { opacity: 0.6; cursor: not-allowed; }

    .grilla-portafolio { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .item-portafolio   { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; }
    .item-portafolio h4 { font-size: 13px; font-weight: 700; color: #2a6b6d; margin-bottom: 3px; }
    .item-portafolio p  { font-size: 11px; color: #94a3b8; }

    .columna-preview  { display: flex; flex-direction: column; gap: 12px; position: sticky; top: 24px; }
    .etiqueta-wrap    { display: flex; flex-direction: column; gap: 4px; }
    .etiqueta-preview { display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px; border-radius: 999px; background: #e1f5ee; border: 1px solid #5dcaa5; font-size: 10px; font-weight: 800; color: #085041; text-transform: uppercase; letter-spacing: 0.8px; align-self: flex-start; }
    .punto-preview    { width: 6px; height: 6px; border-radius: 50%; background: #3bb4a1; }
    .hint-preview     { font-size: 11px; color: #94a3b8; line-height: 1.5; }

    /* Leyenda profesional del porcentaje */
    .leyenda-match {
        font-size: 11px;
        color: #64748b;
        line-height: 1.6;
        padding: 10px 14px;
        background: #f8fafc;
        border-left: 3px solid #2a6b6d;
        border-radius: 0 8px 8px 0;
        font-style: italic;
    }

    /* MODALES */
    .modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.4); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 20px; }
    .modal { background: white; border-radius: 20px; width: 100%; max-width: 520px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); display: flex; flex-direction: column; max-height: 90vh; }
    .modal-grande { max-width: 640px; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #f1f5f9; flex-shrink: 0; }
    .modal-titulo { font-size: 18px; font-weight: 800; color: #0f172a; }
    .modal-cerrar { width: 32px; height: 32px; border-radius: 8px; background: #f1f5f9; border: none; cursor: pointer; font-size: 14px; color: #64748b; }
    .modal-cerrar:hover { background: #e2e8f0; }
    .modal-cuerpo { padding: 24px; display: flex; flex-direction: column; gap: 16px; overflow-y: auto; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid #f1f5f9; flex-shrink: 0; }

    .campo-form     { display: flex; flex-direction: column; gap: 6px; }
    .campo-label    { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
    .campo-input, .campo-textarea { padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; color: #1e293b; font-family: inherit; transition: border-color 0.2s; outline: none; width: 100%; }
    .campo-input:focus, .campo-textarea:focus { border-color: #2a6b6d; }
    .campo-textarea { resize: vertical; min-height: 80px; }
    .campo-error    { font-size: 12px; color: #9b3b3b; font-weight: 600; }
    .campo-contador { font-size: 11px; color: #94a3b8; text-align: right; }

    select.campo-input { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; cursor: pointer; }

    .lista-sugerencias   { display: flex; flex-wrap: wrap; gap: 6px; }
    .sugerencia-item     { padding: 5px 12px; border-radius: 20px; background: #e1f5ee; color: #085041; border: 1px solid #5dcaa5; font-size: 12px; font-weight: 600; cursor: pointer; transition: background 0.15s; }
    .sugerencia-item:hover { background: #3bb4a1; color: white; border-color: #3bb4a1; }
    .nueva-etiqueta-wrap { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .nueva-etiqueta-hint { font-size: 12px; color: #94a3b8; }
    .btn-nueva-etiqueta  { padding: 5px 12px; border-radius: 20px; background: rgba(42,107,109,0.08); color: #2a6b6d; border: 1px dashed #2a6b6d; font-size: 12px; font-weight: 600; cursor: pointer; }
    .btn-nueva-etiqueta:hover { background: #2a6b6d; color: white; }

    .selector-tipo { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; }
    .tipo-botones  { display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
    .btn-tipo              { padding: 7px 16px; border: none; border-radius: 8px; background: #2a6b6d; color: white; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; }
    .btn-tipo-adicional    { background: #64748b; }
    .btn-cancelar-tipo     { padding: 7px 16px; border: 1px solid #e2e8f0; border-radius: 8px; background: white; color: #64748b; font-size: 12px; cursor: pointer; font-family: inherit; }

    .chips-editables { display: flex; flex-wrap: wrap; gap: 7px; }
    .chip-editable   { display: flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 8px; background: #f1f5f9; color: #2a6b6d; font-size: 12px; font-weight: 600; }
    .chip-quitar     { background: none; border: none; cursor: pointer; color: #94a3b8; font-size: 15px; line-height: 1; padding: 0; }
    .chip-quitar:hover { color: #9b3b3b; }

    .proyecto-form       { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 8px; }
    .proyecto-header     { display: flex; justify-content: space-between; align-items: center; }
    .btn-quitar-proyecto { font-size: 11px; color: #9b3b3b; background: none; border: none; cursor: pointer; font-weight: 700; }
    .btn-agregar-proyecto { padding: 10px; border: 2px dashed #2a6b6d; background: transparent; color: #2a6b6d; font-weight: 700; font-size: 13px; border-radius: 12px; cursor: pointer; width: 100%; font-family: inherit; transition: all 0.2s; }
    .btn-agregar-proyecto:hover { background: #2a6b6d; color: white; }

    .btn-cancelar { padding: 10px 20px; border: 1.5px solid #e2e8f0; background: white; color: #64748b; font-size: 13px; font-weight: 700; border-radius: 10px; cursor: pointer; font-family: inherit; }
    .btn-cancelar:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-guardar  { padding: 10px 24px; border: none; background: #2a6b6d; color: white; font-size: 13px; font-weight: 700; border-radius: 10px; cursor: pointer; font-family: inherit; transition: opacity 0.2s; }
    .btn-guardar:hover    { opacity: 0.9; }
    .btn-guardar:disabled { opacity: 0.6; cursor: not-allowed; }

    .estado-carga  { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 16px; color: #64748b; font-size: 14px; }
    .spinner       { width: 40px; height: 40px; border: 4px solid #e2e8f0; border-top-color: #2a6b6d; border-radius: 50%; animation: girar 0.8s linear infinite; }
    @keyframes girar { to { transform: rotate(360deg); } }
    .estado-error  { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 12px; text-align: center; padding: 40px; }
    .error-icono   { font-size: 48px; }
    .error-titulo  { font-size: 18px; font-weight: 700; color: #1e293b; }
    .error-desc    { font-size: 14px; color: #64748b; max-width: 380px; }
    .btn-reintentar { margin-top: 8px; padding: 10px 24px; background: #2a6b6d; color: white; border: none; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; }

    .toast       { position: fixed; bottom: 32px; right: 32px; padding: 14px 22px; border-radius: 14px; font-size: 13px; font-weight: 700; color: white; box-shadow: 0 8px 24px rgba(0,0,0,0.12); z-index: 300; max-width: 360px; }
    .toast.exito { background: #6a9a41; }
    .toast.info  { background: #2a6b6d; }
    .toast.error { background: #9b3b3b; }

    @media (max-width: 1024px) {
        .contenedor-perfil { padding: 24px 20px; }
        .grilla-perfil     { grid-template-columns: 1fr; gap: 20px; }
        .columna-preview   { position: static; }
    }

    @media (max-width: 640px) {
        .contenedor-perfil { padding: 16px 12px; }
        .cuerpo { padding: 36px 16px 24px; }
        .fila-top { flex-direction: column; align-items: stretch; gap: 16px; }
        .toggle-wrap { align-items: flex-start; }
        .grilla-portafolio { grid-template-columns: 1fr; }
        .zona-cv { flex-direction: column; align-items: stretch; gap: 12px; }
        .btn-actualizar-cv { text-align: center; }
    }
</style>