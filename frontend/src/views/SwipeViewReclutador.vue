<template>
    <div class="page-wrapper">
        <h2 class="text-4xl font-extrabold mb-2 tracking-tight text-cerceta text-center">
            Evaluación de Talento
        </h2>
        <p class="text-lg text-cerceta-light font-medium mb-8 text-center">
            {{ tituloVacante }}
        </p>

        <div class="flex gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-cerceta/5 w-full max-w-md">
            <button 
                @click="activeTab = 'swipe'" 
                :class="activeTab === 'swipe' ? 'bg-matcha text-white shadow-md shadow-matcha/20' : 'text-cerceta-light hover:bg-fondo'" 
                class="flex-1 py-2.5 rounded-xl font-bold transition-all text-sm">
                Swipe
            </button>
            <button 
                @click="activeTab = 'aceptados'" 
                :class="activeTab === 'aceptados' ? 'bg-matcha text-white shadow-md shadow-matcha/20' : 'text-cerceta-light hover:bg-fondo'" 
                class="flex-1 py-2.5 rounded-xl font-bold transition-all text-sm">
                Matches ({{ aceptados.length }})
            </button>
            <button 
                @click="activeTab = 'rechazados'" 
                :class="activeTab === 'rechazados' ? 'bg-acento-tierra text-white shadow-md shadow-acento-tierra/20' : 'text-cerceta-light hover:bg-fondo'" 
                class="flex-1 py-2.5 rounded-xl font-bold transition-all text-sm">
                Wait List ({{ rechazados.length }})
            </button>
        </div>

        <div v-show="activeTab === 'swipe'" class="w-full flex flex-col items-center">
            
            <h5 class="text-lg font-medium mb-8 tracking-tight text-cerceta-light text-center">
                Desliza o utiliza las flechas para aceptar (derecha) o rechazar (izquierda)
            </h5>

            <div v-if="cargando" class="text-cerceta animate-pulse font-bold">
                Cargando candidatos pendientes...
            </div>

            <div v-else-if="!candidatoActual" class="estado-vacio">
                <div class="content empty-state">
                    <div class="empty-icon">🎉</div>
                    <h2 class="main-name">
                        ¡Al día!
                    </h2>
                    <p class="desc-text mt-2">
                        Ya revisaste todos los perfiles disponibles para esta vacante.
                        Revisa tus otras pestañas para ver los resultados.
                    </p>
                </div>
            </div>

            <div
                v-else
                class="swipe-wrapper"
                :style="cardStyle"
                @mousedown="onDown"
                @mousemove="onMove"
                @mouseup="onUp"
                @mouseleave="onUp"
                @touchstart="onTouchStart"
                @touchmove="onTouchMove"
                @touchend="onTouchEnd"
            >
                <div v-if="offsetX > 80"  class="swipe-indicator accept-indicator">✓</div>
                <div v-if="offsetX < -80" class="swipe-indicator reject-indicator">✕</div>

                <FichaCandidato
                    :nombre="candidatoActual?.nombreCompleto || 'Nombre no disponible'"
                    :rol="candidatoActual?.perfilProfesional || 'Puesto no disponible'"
                    :ubicacion="candidatoActual?.ubicacion || 'Ubicación no disponible'"
                    :porcentaje="candidatoActual?.score || 0"
                    :habilidades="candidatoActual?.skills || []"
                    :habilidadesExtra="candidatoActual?.extras || []"
                    :descripcion="candidatoActual?.descripcion || 'Descripción no disponible'"
                    :previewMode="false"
                    @aceptar="hacerMatch"
                    @rechazar="rechazar"
                    @ver-perfil="verPerfilCompleto"
                />
            </div>

            <!-- CAMBIO 1: feedback-box ya no incluye el input inline, y se oculta cuando el modal de "Otro" está abierto -->
            <div class="feedback-box" v-if="showFeedback && !mostrarOtroInput">
                <button
                    v-for="(reason, index) in reasons"
                    :key="reason"
                    @click="selectReason(reason)"
                    :class="['feedback-btn', index === selectedIndex ? 'feedback-selected' : '']"
                >
                    {{ reason }}
                </button>
            </div>
        </div>

        <div v-show="activeTab === 'aceptados'" class="w-full max-w-3xl">
            <div v-if="aceptados.length === 0" class="text-center py-20 text-cerceta-light bg-white rounded-3xl border border-dashed border-cerceta/20">
                <p class="text-4xl mb-4">⭐</p>
                Aún no tienes candidatos aceptados en esta sesión.
            </div>
            
            <div v-else class="grid gap-4">
                <div v-for="cand in aceptados" :key="cand.id_postulacion" class="bg-white p-6 rounded-2xl border-2 border-matcha/30 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group hover:border-matcha transition-colors">
                    <div>
                        <h4 class="text-lg font-bold text-cerceta">{{ cand.nombreCompleto }}</h4>
                        <p class="text-sm text-cerceta-light">{{ cand.perfilProfesional }}</p>
                    </div>
                    <div class="flex flex-wrap items-center gap-3">
                        <span class="font-black text-matcha bg-matcha/10 px-3 py-1 rounded-lg mr-2">{{ cand.score }}% Match</span>
                        
                        <button 
                            @click="moverAWaitlistDesdeMatch(cand)"
                            class="text-xs font-bold text-acento-tierra bg-acento-tierra/10 hover:bg-acento-tierra hover:text-white px-3 py-2 rounded-xl transition-all border-0 cursor-pointer"
                        >
                            Mover a Wait List
                        </button>

                        <button 
                            v-if="cand.estatus_swipe !== 'entrevista'"
                            @click="abrirModal(cand)"
                            class="bg-matcha text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-matcha-dark transition-colors border-0 cursor-pointer">
                            Agendar
                        </button>
                        <div v-else class="flex items-center gap-2">
                            <span class="text-matcha font-bold text-sm bg-matcha/10 px-3 py-1 rounded-lg">Entrevista Agendada ✓</span>
                            <button 
                                @click="abrirModal(cand)"
                                class="text-xs font-bold text-cerceta bg-fondo hover:bg-gray-200 px-3 py-2 rounded-xl transition-all border-0 cursor-pointer"
                            >
                                Reagendar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-show="activeTab === 'rechazados'" class="w-full max-w-3xl">
            <div v-if="rechazados.length === 0" class="text-center py-20 text-cerceta-light bg-white rounded-3xl border border-dashed border-cerceta/20">
                <p class="text-4xl mb-4">✕</p>
                Aún no has descartado a ningún candidato.
            </div>
            
            <div v-else class="grid gap-4">
                <div v-for="cand in rechazados" :key="cand.id_postulacion" class="bg-white p-6 rounded-2xl border border-gray-200 opacity-90 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h4 class="text-lg font-bold text-cerceta line-through decoration-acento-tierra/40">{{ cand.nombreCompleto }}</h4>
                        <p class="text-sm text-cerceta-light">{{ cand.perfilProfesional }}</p>
                        <p class="text-xs text-acento-tierra font-bold mt-2 bg-acento-tierra/10 inline-block px-2 py-1 rounded">Motivo: {{ cand.motivoRechazo }}</p>
                    </div>
                    <div class="flex flex-wrap items-center gap-3">
                        <span class="font-black text-matcha bg-matcha/10 px-3 py-1 rounded-lg mr-2">{{ cand.score }}% Match</span>
                        <button 
                            @click="verPerfilCandidato(cand)"
                            class="text-xs font-bold text-cerceta bg-fondo hover:bg-gray-200 px-3 py-2 rounded-xl transition-all border-0 cursor-pointer"
                        >
                            Ver perfil completo
                        </button>
                        <button 
                            @click="moverAMatchDesdeWaitlist(cand)"
                            class="bg-matcha text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-matcha-dark transition-all border-0 cursor-pointer shadow-md shadow-matcha/10"
                        >
                            Dar Match ✓
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="toast.show" class="toast">
            {{ toast.message }}
        </div>

        <!-- Modal agendar entrevista (sin cambios) -->
        <div v-if="mostrarModal" class="fixed inset-0 bg-cerceta/40 flex items-center justify-center z-50 backdrop-blur-sm px-4">
            <div class="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
                <h3 class="text-2xl font-extrabold text-cerceta mb-2">Agendar Entrevista</h3>
                <p class="text-sm text-cerceta-light mb-6">Con: <span class="font-bold text-matcha">{{ candidatoSeleccionado?.nombreCompleto }}</span></p>
                
                <form @submit.prevent="confirmarAgenda">
                    <div class="mb-4">
                        <label class="block text-sm font-bold text-cerceta mb-1">Fecha</label>
                        <input type="date" :min="fechaMinima" v-model="formAgenda.fecha" required class="w-full border-2 border-fondo rounded-xl p-3 text-cerceta font-medium outline-none focus:border-matcha transition-colors">
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-bold text-cerceta mb-1">Hora</label>
                        <input type="time" :min="horaMinima" v-model="formAgenda.hora" required class="w-full border-2 border-fondo rounded-xl p-3 text-cerceta font-medium outline-none focus:border-matcha transition-colors">
                    </div>
                    <div class="mb-8">
                        <label class="block text-sm font-bold text-cerceta mb-1">Enlace de la Reunión</label>
                        <input type="url" v-model="formAgenda.link" placeholder="https://meet.google.com/..." class="w-full border-2 border-fondo rounded-xl p-3 text-cerceta font-medium outline-none focus:border-matcha transition-colors">
                    </div>
                    
                    <div class="flex gap-3">
                        <button type="button" @click="cerrarModal" class="flex-1 py-3 text-cerceta-light font-bold bg-fondo hover:bg-gray-200 rounded-xl transition-colors">Cancelar</button>
                        <button type="submit" class="flex-1 py-3 bg-matcha text-white font-bold rounded-xl shadow-lg shadow-matcha/30 hover:bg-matcha-dark transition-all">Confirmar</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- CAMBIO 2: Modal para motivo "Otro" -->
        <div v-if="mostrarOtroInput" class="fixed inset-0 bg-cerceta/40 flex items-center justify-center z-50 backdrop-blur-sm px-4">
            <div class="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
                <h3 class="text-2xl font-extrabold text-cerceta mb-2">Motivo de Rechazo</h3>
                <p class="text-sm text-cerceta-light mb-6">Describe el motivo para este candidato</p>

                <div class="mb-8">
                    <label class="block text-sm font-bold text-cerceta mb-1">Motivo</label>
                    <input
                        type="text"
                        v-model="otroMotivoText"
                        placeholder="Ej. Expectativas salariales, disponibilidad..."
                        class="w-full border-2 border-fondo rounded-xl p-3 text-cerceta font-medium outline-none focus:border-matcha transition-colors"
                        @keyup.enter="confirmarOtroMotivo"
                        autofocus
                    />
                </div>

                <div class="flex gap-3">
                    <button
                        type="button"
                        @click="cancelarOtroMotivo"
                        class="flex-1 py-3 text-cerceta-light font-bold bg-fondo hover:bg-gray-200 rounded-xl transition-colors border-0 cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        @click="confirmarOtroMotivo"
                        class="flex-1 py-3 bg-matcha text-white font-bold rounded-xl shadow-lg shadow-matcha/30 hover:bg-matcha-dark transition-all border-0 cursor-pointer"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal para seleccionar motivo al mover desde Match a Wait List -->
        <div v-if="mostrarModalMotivosMatch" class="fixed inset-0 bg-cerceta/40 flex items-center justify-center z-50 backdrop-blur-sm px-4">
            <div class="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
                <h3 class="text-2xl font-extrabold text-cerceta mb-2">Mover a Wait List</h3>
                <p class="text-sm text-cerceta-light mb-6">Selecciona el motivo de descarte para <span class="font-bold text-matcha">{{ candidatoSeleccionado?.nombreCompleto }}</span></p>

                <div class="flex flex-col gap-3 mb-8">
                    <button
                        v-for="reason in reasons"
                        :key="reason"
                        @click="seleccionarMotivoMatch(reason)"
                        class="w-full py-3 px-4 rounded-xl bg-fondo text-cerceta font-semibold text-sm hover:bg-matcha/10 hover:text-matcha transition-colors text-left border-0 cursor-pointer"
                    >
                        {{ reason }}
                    </button>
                </div>

                <div class="flex gap-3">
                    <button
                        type="button"
                        @click="cerrarModalMotivosMatch"
                        class="flex-1 py-3 text-cerceta-light font-bold bg-fondo hover:bg-gray-200 rounded-xl transition-colors border-0 cursor-pointer"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted, onBeforeUnmount } from "vue";
    import { useRoute, useRouter } from "vue-router";
    import FichaCandidato from "@/components/FichaCandidato.vue";

    const URL_BASE_API = import.meta.env.VITE_API_URL;
    const route  = useRoute();
    const router = useRouter();

    // ── LEER VARIABLES DE LA URL ──
    const tituloVacante = computed(() => route.query.titulo || 'Evaluando candidatos...');

    // ── ESTADO Y PESTAÑAS ──
    const activeTab    = ref('swipe');
    const candidatos   = ref([]);
    const aceptados    = ref([]);
    const rechazados   = ref([]);
    const indiceActual = ref(0);
    const cargando     = ref(true);
    const origenDescarte = ref('swipe');
    const mostrarModalMotivosMatch = ref(false);

    const candidatoActual = computed(() => {
        return candidatos.value[indiceActual.value] || null;
    });

    // ── CARGA DESDE EL BACKEND ──
    const cargarCandidatos = async () => {
        try {
            const idVacante = route.params.id || route.params.id_vacante;

            if (!idVacante) {
                console.error("No se detectó un ID de vacante en la URL.");
                cargando.value = false;
                return;
            }

            const respuesta = await fetch(
                `${URL_BASE_API}/api/candidatos/vacante/${idVacante}`
            );

            if (!respuesta.ok) {
                throw new Error(`Error del servidor: ${respuesta.status}`);
            }

            const data = await respuesta.json();
            
            candidatos.value = data.pendientes || [];
            aceptados.value  = data.aceptados  || [];
            rechazados.value = data.rechazados || [];

        } catch (error) {
            console.error("Error al cargar candidatos:", error);
        } finally {
            cargando.value = false;
        }
    };
    
    // ── LÓGICA DE AGENDADO DE ENTREVISTAS ──
    const mostrarModal = ref(false);
    const candidatoSeleccionado = ref(null);
    const formAgenda = ref({ fecha: '', hora: '', link: '' });

    const fechaMinima = computed(() => {
        const hoy = new Date();
        const anio = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, '0');
        const dia = String(hoy.getDate()).padStart(2, '0');
        return `${anio}-${mes}-${dia}`;
    });

    const horaMinima = computed(() => {
        if (formAgenda.value.fecha === fechaMinima.value) {
            const hoy = new Date();
            const horas = String(hoy.getHours()).padStart(2, '0');
            const minutos = String(hoy.getMinutes()).padStart(2, '0');
            return `${horas}:${minutos}`;
        }
        return '';
    });

    const abrirModal = (cand) => {
        candidatoSeleccionado.value = cand;
        if (cand.entrevista) {
            formAgenda.value = { 
                fecha: cand.entrevista.fecha || '', 
                hora: cand.entrevista.hora || '', 
                link: cand.entrevista.link || '' 
            };
        } else {
            formAgenda.value = { fecha: '', hora: '', link: '' };
        }
        mostrarModal.value = true;
    };

    const cerrarModal = () => {
        mostrarModal.value = false;
        candidatoSeleccionado.value = null;
    };

    const validarFechaHora = () => {
        if (formAgenda.value.fecha < fechaMinima.value) {
            showToast("No puedes agendar una entrevista en una fecha pasada.");
            return false;
        }
        if (formAgenda.value.fecha === fechaMinima.value && formAgenda.value.hora) {
            const hoy = new Date();
            const horas = String(hoy.getHours()).padStart(2, '0');
            const minutos = String(hoy.getMinutes()).padStart(2, '0');
            const horaActual = `${horas}:${minutos}`;
            const horaSeleccionada = formAgenda.value.hora.substring(0, 5);
            if (horaSeleccionada < horaActual) {
                showToast("No puedes agendar una entrevista a una hora pasada.");
                return false;
            }
        }
        return true;
    };

    const confirmarAgenda = async () => {
        if (!validarFechaHora()) {
            return;
        }
        try {
            const respuesta = await fetch(`${URL_BASE_API}/api/entrevistas/agendar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_postulacion: candidatoSeleccionado.value.id_postulacion,
                    fecha: formAgenda.value.fecha,
                    hora: formAgenda.value.hora,
                    link_reunion: formAgenda.value.link
                })
            });

            if (!respuesta.ok) {
                throw new Error("Error al agendar");
            }

            candidatoSeleccionado.value.entrevista = {
                fecha: formAgenda.value.fecha,
                hora: formAgenda.value.hora,
                link: formAgenda.value.link
            };
            candidatoSeleccionado.value.estatus_swipe = 'entrevista';
            
            showToast("¡Entrevista agendada exitosamente!");
            cerrarModal();
        } catch (error) {
            console.error(error);
            showToast("Hubo un error al agendar.");
        }
    };

    // ── LÓGICA DE ARRASTRE ──
    const startX     = ref(0);
    const offsetX    = ref(0);
    const isDragging = ref(false);

    const cardStyle = computed(() => ({
        transform:  `translateX(${offsetX.value}px) rotate(${offsetX.value / 12}deg)`,
        transition: isDragging.value ? "none" : "0.3s",
    }));

    const onDown = (e) => {
        isDragging.value = true;
        startX.value = e.clientX;
    };

    const onMove = (e) => {
        if (!isDragging.value) return;
        offsetX.value = e.clientX - startX.value;
    };

    const onUp = () => {
        isDragging.value = false;

        if (offsetX.value > 120) {
            hacerMatch();
        } else if (offsetX.value < -120) {
            rechazar();
        }

        offsetX.value = 0;
    };

    const onTouchStart = (e) => {
        isDragging.value = true;
        startX.value = e.touches[0].clientX;
    };

    const onTouchMove = (e) => {
        if (!isDragging.value) return;
        offsetX.value = e.touches[0].clientX - startX.value;
    };

    const onTouchEnd = () => {
        isDragging.value = false;

        if (offsetX.value > 120) {
            hacerMatch();
        } else if (offsetX.value < -120) {
            rechazar();
        }

        offsetX.value = 0;
    };

    // ── FEEDBACK Y TOAST ──
    const showFeedback     = ref(false);
    const selectedIndex    = ref(0);
    const mostrarOtroInput = ref(false);
    const otroMotivoText   = ref("");

    const reasons = [
        "Falta experiencia",
        "Habilidades técnicas",
        "Ubicación",
        "CV incompleto",
        "Otro",
    ];

    const toast = ref({ show: false, message: "" });

    const showToast = (msg) => {
        toast.value.message = msg;
        toast.value.show    = true;
        setTimeout(() => { toast.value.show = false; }, 2000);
    };

    const siguiente = () => {
        indiceActual.value++;
        selectedIndex.value = 0;
    };

    const handleFeedbackKey = (e) => {
        if (mostrarOtroInput.value) {
            if (e.key === "Escape") {
                cancelarOtroMotivo();
            }
            return;
        }
        if (e.key === "ArrowRight") {
            selectedIndex.value = (selectedIndex.value + 1) % reasons.length;
        } else if (e.key === "ArrowLeft") {
            selectedIndex.value = (selectedIndex.value - 1 + reasons.length) % reasons.length;
        } else if (e.key === "Enter") {
            document.activeElement.blur();
            selectReason(reasons[selectedIndex.value]);
        } else if (e.key >= "1" && e.key <= String(reasons.length)) {
            selectReason(reasons[Number(e.key) - 1]);
        }
    };

    const handleKey = (e) => {
        if (activeTab.value !== 'swipe') {
            return;
        }
        // ── NUEVO GUARD: ignorar todo si el modal de "Otro" está abierto ──
        if (mostrarOtroInput.value) {
            return;
        }
        if (showFeedback.value) {
            handleFeedbackKey(e);
            return;
        }
        if (e.key === "ArrowRight") {
            offsetX.value = 220;
            setTimeout(() => { hacerMatch(); offsetX.value = 0; }, 200);
        } else if (e.key === "ArrowLeft") {
            offsetX.value = -220;
            setTimeout(() => { rechazar(); offsetX.value = 0; }, 200);
        }
    };

    onMounted(() => {
        cargarCandidatos();
        window.addEventListener("keydown", handleKey);
    });

    onBeforeUnmount(() => {
        window.removeEventListener("keydown", handleKey);
    });

    const verPerfilCompleto = () => {
        const candidato = candidatoActual.value;

        if (!candidato) {
            showToast("No se encontró información del candidato.");
            return;
        }

        const idCandidato =
            candidato.id_candidato ||
            candidato.idCandidato ||
            candidato.id_candidato_usuario ||
            candidato.id_usuario ||
            candidato.idUsuario ||
            candidato.id ||
            candidato.id_postulacion;

        if (!idCandidato) {
            console.error("No se encontró ID del candidato:", candidato);
            showToast("No se encontró el ID del candidato.");
            return;
        }

        const rutasPosibles = [
            { path: `/perfil-candidato/${idCandidato}` },
            { path: `/candidato/perfil/${idCandidato}` },
            { path: `/perfil/${idCandidato}` },
            { path: "/perfil-candidato", query: { id_candidato: idCandidato } },
            { path: "/perfil", query: { id_candidato: idCandidato, vista: "reclutador" } }
        ];

        const destino = rutasPosibles.find((ruta) => router.resolve(ruta).matched.length > 0);

        if (!destino) {
            console.warn("No existe una ruta configurada para ver el perfil del candidato.", { idCandidato, candidato });
            showToast("No existe una ruta configurada para ver este perfil.");
            return;
        }

        router.push({
            name: "perfilCandidatoCompleto",
            params: { id: idCandidato }
        });
    };

    // Navegar al perfil desde la Wait List o Matches
    const verPerfilCandidato = (candidato) => {
        const idCandidato =
            candidato.id_candidato ||
            candidato.idCandidato ||
            candidato.id_candidato_usuario ||
            candidato.id_usuario ||
            candidato.idUsuario ||
            candidato.id ||
            candidato.id_postulacion;

        if (!idCandidato) {
            showToast("No se encontró el ID del candidato.");
            return;
        }

        router.push({
            name: "perfilCandidatoCompleto",
            params: { id: idCandidato }
        });
    };

    // ── ACCIONES CON BACKEND ──
    const hacerMatch = async () => {
        const candidatoGuardado = { ...candidatoActual.value }; 
        try {
            const respuesta = await fetch(`${URL_BASE_API}/api/interacciones/swipe-reclutador`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_postulacion: candidatoGuardado.id_postulacion,
                    estado: "match"
                })
            });

            if (!respuesta.ok) {
                throw new Error(`Error al guardar match: ${respuesta.status}`);
            }

            aceptados.value.push(candidatoGuardado);
            
            showFeedback.value = false;
            showToast("¡Match realizado!");
            siguiente();

        } catch (error) {
            console.error("Error en hacerMatch:", error);
            showToast("Error al guardar. Intenta de nuevo.");
        }
    };

    const rechazar = () => {
        origenDescarte.value = 'swipe';
        showFeedback.value = true;
    };

    const selectReason = async (reason) => {
        if (reason === "Otro") {
            mostrarOtroInput.value = true;
            otroMotivoText.value   = "";
        } else {
            await procesarRechazo(reason);
        }
    };

    const procesarRechazo = async (motivo) => {
        const candidatoGuardado = { 
            ...candidatoActual.value, 
            motivoRechazo: motivo 
        };
        try {
            await enviarRechazoBackend(candidatoGuardado.id_postulacion, motivo);
            rechazados.value.push(candidatoGuardado);
            showToast("Rechazado: " + motivo);
            showFeedback.value = false;
            mostrarOtroInput.value = false;
            siguiente();
        } catch (error) {
            console.error("Error al procesar rechazo:", error);
            showToast("Error al guardar. Intenta de nuevo.");
        }
    };

    const enviarRechazoBackend = async (idPostulacion, motivo) => {
        const respuesta = await fetch(`${URL_BASE_API}/api/interacciones/swipe-reclutador`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_postulacion: idPostulacion,
                estado: "rechazado",
                comentario: motivo
            })
        });
        if (!respuesta.ok) {
            throw new Error(`Error al guardar rechazo: ${respuesta.status}`);
        }
    };

    const confirmarOtroMotivo = async () => {
        const motivoFinal = otroMotivoText.value.trim() || "Otro";
        if (origenDescarte.value === 'swipe') {
            await procesarRechazo(motivoFinal);
        } else {
            await ejecutarMoverAWaitlist(candidatoSeleccionado.value, motivoFinal);
            mostrarOtroInput.value = false;
            candidatoSeleccionado.value = null;
        }
    };

    const cancelarOtroMotivo = () => {
        mostrarOtroInput.value = false;
        otroMotivoText.value = "";
        candidatoSeleccionado.value = null;
    };

    const ejecutarMoverAWaitlist = async (candidato, motivo) => {
        try {
            const respuesta = await fetch(`${URL_BASE_API}/api/interacciones/swipe-reclutador`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_postulacion: candidato.id_postulacion,
                    estado: "rechazado",
                    comentario: motivo
                })
            });

            if (!respuesta.ok) {
                throw new Error("Error al remover de matches");
            }

            aceptados.value = aceptados.value.filter((c) => {
                return c.id_postulacion !== candidato.id_postulacion;
            });
            candidato.estatus_swipe = 'rechazado';
            candidato.motivoRechazo = motivo;
            rechazados.value.push(candidato);

            showToast("Movido a la Wait List");
        } catch (error) {
            console.error(error);
            showToast("Error al mover el candidato.");
        }
    };

    const moverAWaitlistDesdeMatch = (candidato) => {
        candidatoSeleccionado.value = candidato;
        origenDescarte.value = 'matches';
        mostrarModalMotivosMatch.value = true;
    };

    const seleccionarMotivoMatch = async (reason) => {
        if (reason === "Otro") {
            mostrarModalMotivosMatch.value = false;
            mostrarOtroInput.value = true;
            otroMotivoText.value = "";
        } else {
            mostrarModalMotivosMatch.value = false;
            await ejecutarMoverAWaitlist(candidatoSeleccionado.value, reason);
            candidatoSeleccionado.value = null;
        }
    };

    const cerrarModalMotivosMatch = () => {
        mostrarModalMotivosMatch.value = false;
        candidatoSeleccionado.value = null;
    };

    // Promover un candidato desde la Wait List de regreso a Matches
    const moverAMatchDesdeWaitlist = async (candidato) => {
        try {
            const respuesta = await fetch(`${URL_BASE_API}/api/interacciones/swipe-reclutador`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_postulacion: candidato.id_postulacion,
                    estado: "match"
                })
            });

            if (!respuesta.ok) throw new Error("Error al promover candidato");

            rechazados.value = rechazados.value.filter(c => c.id_postulacion !== candidato.id_postulacion);
            candidato.estatus_swipe = 'match';
            aceptados.value.push(candidato);

            showToast("¡Movido a Matches con éxito!");
        } catch (error) {
            console.error(error);
            showToast("Error al promover el candidato.");
        }
    };
</script>

<style scoped>
    .page-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: calc(100vh - 80px);
        background-color: #f8fafc;
        padding: 40px 20px;
        overflow-x: hidden;
    }

    .swipe-wrapper {
        width: 100%;
        max-width: 500px;
        position: relative;
        cursor: grab;
        user-select: none;
        touch-action: pan-y;
    }

    .swipe-wrapper:active { cursor: grabbing; }

    @media (max-width: 640px) {
        .page-wrapper {
            padding: 20px 10px;
        }
        .estado-vacio {
            border-radius: 24px;
        }
        .empty-state {
            padding: 40px 20px;
        }
        .feedback-box {
            padding: 12px;
            gap: 8px;
        }
        .feedback-btn {
            padding: 6px 12px;
            font-size: 11px;
        }
    }

    .estado-vacio {
        width: 100%;
        max-width: 500px;
        border-radius: 35px;
        overflow: hidden;
        background: white;
        box-shadow: 0 15px 45px rgba(0, 0, 0, 0.08);
    }

    .swipe-indicator {
        position: absolute;
        top: 25px;
        font-size: 34px;
        font-weight: 900;
        z-index: 20;
    }

    .accept-indicator { right: 25px; color: #6a9a41; }
    .reject-indicator { left: 25px;  color: #9b3b3b; }

    .empty-state {
        text-align: center;
        padding: 60px 35px;
    }

    .empty-icon {
        font-size: 55px;
        margin-bottom: 18px;
    }

    .main-name {
        margin: 0;
        font-size: 25px;
        font-weight: 800;
        letter-spacing: -0.5px;
    }

    .empty-state .main-name {
        font-size: 22px;
        margin-bottom: 15px;
    }

    .desc-text {
        font-size: 14px;
        color: #475569;
        line-height: 1.6;
    }

    .feedback-box {
        margin-top: 20px;
        background: white;
        padding: 16px;
        border-radius: 18px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
        max-width: 500px;
    }

    .feedback-btn {
        padding: 8px 14px;
        border-radius: 999px;
        border: none;
        background: #dcfce7;
        color: #166534;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        transition: 0.2s;
    }

    .feedback-selected {
        background: #6a9a41;
        color: white;
        transform: scale(1.08);
    }

    .toast {
        position: fixed;
        bottom: 40px;
        right: 40px;
        background: #6a9a41;
        color: white;
        padding: 14px 24px;
        border-radius: 16px;
        font-weight: 700;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
        z-index: 50;
    }
</style>