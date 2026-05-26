<template>
    <div class="contenedor-perfil">

        <!-- ── BOTÓN VOLVER ── -->
        <button class="btn-volver" @click="volver">
            <span>←</span> Volver al swipe
        </button>

        <!-- ── CARGANDO ── -->
        <div v-if="cargando" class="estado-carga">
            <div class="spinner"></div>
            <p>Cargando perfil del candidato...</p>
        </div>

        <!-- ── ERROR ── -->
        <div v-else-if="error" class="estado-error">
            <p class="error-icono">⚠️</p>
            <p class="error-titulo">No se pudo cargar el perfil</p>
            <p class="error-desc">{{ error }}</p>
            <button class="btn-reintentar" @click="cargarPerfil">Reintentar</button>
        </div>

        <!-- ── CONTENIDO ── -->
        <div v-else class="grilla-perfil">

            <div class="tarjeta-perfil">
                <div class="banner">
                    <div class="avatar">{{ iniciales }}</div>
                </div>
                <div class="cuerpo">

                    <div class="fila-top">
                        <div>
                            <h2 class="nombre">{{ nombreCandidato || 'Candidato' }}</h2>
                            <p class="rol">{{ rolProfesional || 'Rol no especificado' }}</p>
                            <p class="ubicacion">📍 {{ ubicacion || 'Ubicación no especificada' }}</p>
                        </div>
                        <div class="toggle-wrap">
                            <span class="toggle-label">Búsqueda Activa</span>
                            <div :class="['badge-busqueda', busquedaActiva ? 'badge-activa' : 'badge-inactiva']">
                                <span class="punto"></span>
                                {{ busquedaActiva ? 'Sí' : 'No' }}
                            </div>
                        </div>
                    </div>

                    <div class="divisor"/>

                    <!-- Top Skills -->
                    <div class="seccion">
                        <h3 class="seccion-titulo">Top Skills</h3>
                        <div class="chips" v-if="topSkills.length">
                            <span v-for="s in topSkills" :key="s.id" class="chip">{{ s.nombre }}</span>
                        </div>
                        <p v-else class="texto-placeholder-sec">Sin habilidades destacadas</p>
                    </div>

                    <!-- Habilidades técnicas -->
                    <div class="seccion">
                        <h3 class="seccion-titulo">Habilidades Técnicas</h3>
                        <div class="chips" v-if="habilidadesTecnicas.length">
                            <span v-for="h in habilidadesTecnicas" :key="h.id" class="chip">{{ h.nombre }}</span>
                        </div>
                        <p v-else class="texto-placeholder-sec">Sin habilidades técnicas registradas</p>
                    </div>

                    <!-- Habilidades adicionales -->
                    <div class="seccion">
                        <h3 class="seccion-titulo">Habilidades Adicionales</h3>
                        <div class="chips" v-if="habilidadesAdicionales.length">
                            <span v-for="h in habilidadesAdicionales" :key="h.id" class="chip chip-adicional">{{ h.nombre }}</span>
                        </div>
                        <p v-else class="texto-placeholder-sec">Sin habilidades adicionales registradas</p>
                    </div>

                    <!-- Sobre el candidato -->
                    <div class="seccion">
                        <h3 class="seccion-titulo">Sobre el candidato</h3>
                        <p class="texto-descripcion" v-if="descripcion">{{ descripcion }}</p>
                        <p v-else class="texto-placeholder-sec">Este candidato aún no ha agregado una descripción.</p>
                    </div>

                    <!-- Documentos / CV -->
                    <div class="seccion">
                        <h3 class="seccion-titulo">Curriculum Vitae</h3>
                        <div class="zona-cv" v-if="cvUrl">
                            <div class="cv-info">
                                <span class="cv-icono">📄</span>
                                <div>
                                    <p class="cv-nombre">{{ cvNombre || 'CV del candidato' }}</p>
                                    <p class="cv-fecha">Disponible para revisión</p>
                                </div>
                            </div>
                            <div class="cv-botones">
                                <a :href="cvUrl" target="_blank" rel="noopener" class="btn-cv btn-cv-abrir">
                                    Abrir ↗
                                </a>
                                <a :href="cvUrl" :download="cvNombre || 'cv.pdf'" class="btn-cv btn-cv-descargar">
                                    ⬇ Descargar
                                </a>
                            </div>
                        </div>
                        <p v-else class="texto-placeholder-sec">Este candidato aún no ha subido su CV.</p>

                        <!-- Visor PDF  -->
                        <div v-if="cvUrl" class="pdf-wrapper">
                            <iframe
                                :src="cvUrl"
                                class="pdf-viewer"
                                title="CV del candidato"
                            ></iframe>
                        </div>
                    </div>

                    <!-- Portafolio -->
                    <div class="seccion" style="margin-bottom:0">
                        <h3 class="seccion-titulo">Portafolio Destacado</h3>
                        <div class="grilla-portafolio" v-if="portafolio.length">
                            <div v-for="p in portafolio" :key="p.titulo" class="item-portafolio">
                                <h4>{{ p.titulo }}</h4>
                                <p>{{ p.descripcion }}</p>
                            </div>
                        </div>
                        <p v-else class="texto-placeholder-sec">
                            Este candidato aún no ha agregado proyectos a su portafolio.
                        </p>
                    </div>

                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    const URL_BASE_API = import.meta.env.VITE_API_URL
    const route  = useRoute()
    const router = useRouter()

    // ── ESTADO DEL PERFIL ──
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
    const error                  = ref(null)

    // ── COMPUTED ──
    const iniciales = computed(() => {
        if (!nombreCandidato.value) return '?'
        return nombreCandidato.value.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase()
    })

    const topSkills = computed(() => habilidadesTecnicas.value.slice(0, 3))

    // ── CARGAR PERFIL DESDE EL BACKEND ──
    const parsearRespuesta = async (r) => {
        const texto = await r.text()
        try { return JSON.parse(texto) }
        catch { throw new Error('Error de comunicación con el servidor. Verifica que el backend esté corriendo en el puerto 3000.') }
    }

    const cargarPerfil = async () => {
        cargando.value = true
        error.value    = null
        try {
            const id = route.params.id
            if (!id) { error.value = 'No se especificó el ID del candidato.'; return }

            const r = await fetch(`${URL_BASE_API}/api/candidatos/perfil-postulacion/${id}`)
            if (r.status === 404) { error.value = 'No se encontró el perfil de este candidato.'; return }
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
        } catch (ex) {
            console.error('[PerfilCompleto] Error:', ex)
            error.value = ex.message || 'No se pudo cargar el perfil.'
        } finally {
            cargando.value = false
        }
    }

    // ── VOLVER ──
    const volver = () => {
        if (window.history.length > 1) router.back()
        else                            router.push({ name: 'reclutador-inicio' })
    }

    onMounted(() => cargarPerfil())
</script>

<style scoped>
    .contenedor-perfil { min-height: calc(100vh - 80px); background-color: #f8fafc; padding: 28px 32px; }

    /* ── BOTÓN VOLVER ── */
    .btn-volver {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: white;
        border: 2px solid #e2e8f0;
        color: #2a6b6d;
        padding: 9px 16px;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        margin-bottom: 20px;
        transition: all 0.2s;
        font-family: inherit;
    }
    .btn-volver:hover { border-color: #2a6b6d; transform: translateX(-3px); }
    .btn-volver span { font-size: 16px; line-height: 1; }

    .grilla-perfil {
        display: block;
        width: 100%;
        max-width: 900px;
        margin: 0 auto;
    }

    .tarjeta-perfil { background: white; border-radius: 20px; overflow: visible; box-shadow: 0 2px 16px rgba(0,0,0,0.06); width: 100%; }
    .banner { background: #2a6b6d; height: 110px; position: relative; border-radius: 20px 20px 0 0; }
    .avatar { position: absolute; bottom: -32px; left: 28px; width: 72px; height: 72px; border-radius: 50%; background: #e1f5ee; border: 4px solid white; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 800; color: #2a6b6d; }
    .cuerpo { padding: 52px 40px 36px; }

    .fila-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 12px; }
    .nombre   { font-size: 22px; font-weight: 800; color: #1e293b; margin-bottom: 4px; }
    .rol      { font-size: 13px; color: #2a6b6d; font-weight: 600; margin-bottom: 2px; }
    .ubicacion { font-size: 12px; color: #94a3b8; }

    .texto-placeholder-sec { font-size: 12px; color: #cbd5e1; font-style: italic; }

    .toggle-wrap  { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; flex-shrink: 0; }
    .toggle-label { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }

    .badge-busqueda {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 12px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .badge-busqueda .punto { width: 7px; height: 7px; border-radius: 50%; }
    .badge-activa   { background: rgba(106, 154, 65, 0.12); color: #6a9a41; }
    .badge-activa .punto   { background: #6a9a41; box-shadow: 0 0 6px #6a9a41; }
    .badge-inactiva { background: #f1f5f9; color: #94a3b8; }
    .badge-inactiva .punto { background: #cbd5e1; }

    .divisor { height: 1px; background: #f1f5f9; margin: 16px 0; }
    .seccion        { margin-bottom: 20px; }
    .seccion-titulo { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }

    .chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .chip  { padding: 6px 14px; background: white; border: 1.5px solid #e2e8f0; color: #334155; font-size: 12px; font-weight: 600; border-radius: 8px; }
    .chip-adicional { background: #f8fafc; color: #64748b; }
    .texto-descripcion { font-size: 13px; color: #475569; line-height: 1.7; }

    /* ZONA CV */
    .zona-cv  { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 12px; background: #f8fafc; }
    .cv-info  { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
    .cv-icono { font-size: 22px; }
    .cv-nombre { font-size: 12px; font-weight: 700; color: #334155; margin: 0; }
    .cv-fecha  { font-size: 10px; color: #94a3b8; margin: 2px 0 0; }

    .cv-botones { display: flex; gap: 8px; flex-shrink: 0; }
    .btn-cv {
        text-decoration: none;
        padding: 8px 14px;
        border-radius: 10px;
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        transition: all 0.2s;
        white-space: nowrap;
    }
    .btn-cv-abrir { background: rgba(42,107,109,0.08); color: #2a6b6d; border: 1px solid transparent; }
    .btn-cv-abrir:hover { background: #2a6b6d; color: white; }
    .btn-cv-descargar { background: #2a6b6d; color: white; }
    .btn-cv-descargar:hover { opacity: 0.9; }

    /* VISOR PDF */
    .pdf-wrapper {
        margin-top: 12px;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        overflow: hidden;
        background: #f8fafc;
    }
    .pdf-viewer {
        width: 100%;
        height: 700px;
        border: none;
        display: block;
    }

    .grilla-portafolio { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .item-portafolio   { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; }
    .item-portafolio h4 { font-size: 13px; font-weight: 700; color: #2a6b6d; margin-bottom: 3px; }
    .item-portafolio p  { font-size: 11px; color: #94a3b8; }

    .estado-carga  { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 16px; color: #64748b; font-size: 14px; }
    .spinner       { width: 40px; height: 40px; border: 4px solid #e2e8f0; border-top-color: #2a6b6d; border-radius: 50%; animation: girar 0.8s linear infinite; }
    @keyframes girar { to { transform: rotate(360deg); } }
    .estado-error  { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 12px; text-align: center; padding: 40px; }
    .error-icono   { font-size: 48px; }
    .error-titulo  { font-size: 18px; font-weight: 700; color: #1e293b; }
    .error-desc    { font-size: 14px; color: #64748b; max-width: 380px; }
    .btn-reintentar { margin-top: 8px; padding: 10px 24px; background: #2a6b6d; color: white; border: none; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; }

    @media (max-width: 1024px) {
        .contenedor-perfil { padding: 24px 20px; }
        .pdf-viewer        { height: 550px; }
    }

    @media (max-width: 600px) {
        .zona-cv     { flex-direction: column; align-items: stretch; }
        .cv-botones  { width: 100%; }
        .btn-cv      { flex: 1; text-align: center; }
        .cuerpo      { padding: 52px 24px 28px; }
        .pdf-viewer  { height: 450px; }
    }
</style>