<template>
  <div class="page-wrapper">
    <div class="hero-container">
      <div class="header-top">
        <h2 class="titulo-principal text-4xl font-extrabold tracking-tight" style="color: var(--color-tetradic-1);">
          Descubrimiento de oportunidades
        </h2>
      </div>

      <h3 class="text-2xl font-medium mb-5 tracking-tight subtitulo-main">
        Desliza o utiliza las flechas para aceptar (derecha) o rechazar (izquierda)
      </h3>

      <div class="acciones-superiores">
        <button class="btn-actualizar" @click="router.push('/filtros')">
          Actualizar filtros de búsqueda
        </button>
      </div>
    </div>

    <div v-if="mostrarAvisoFiltros" class="card filtros-card">
      <div class="content text-center">
        <div class="icon-circle">⚙️</div>
        <h2 class="main-name titulo-filtros">Encuentra oportunidades ideales para ti</h2>
        <p class="desc-text subtitulo-filtros">
          Configura tus preferencias para mostrarte vacantes compatibles con tu perfil, salario deseado y modalidad.
          <span class="frase-destacada">Dinos lo que quieres y encontraremos tu match perfecto.</span>
        </p>
        <button class="btn-filtros" @click="router.push('/filtros')">
          Ajustar filtros
        </button>
      </div>
    </div>

    <div v-else-if="cargando" class="text-cerceta animate-pulse font-bold mt-10">
      Cargando vacantes...
    </div>

    <div v-else-if="!vacanteActual" class="card empty-card">
      <div class="content text-center">
        <div class="icon-box-empty">🎉</div>
        <h2 class="main-name mb-2">¡Estás al día!</h2>
        <p class="desc-text">Has visto todas las oportunidades disponibles.</p>
        <p class="desc-text mt-2">Ajusta tus filtros para descubrir nuevas vacantes.</p>
      </div>
    </div>

    <div
      v-else
      class="card"
      :style="cardStyle"
      @mousedown="onDown"
      @mousemove="onMove"
      @mouseup="onUp"
      @mouseleave="onUp"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <div v-if="offsetX > 80" class="swipe-indicator accept-indicator">✓</div>
      <div v-if="offsetX < -80" class="swipe-indicator reject-indicator">✕</div>

      <div class="header">
        <div class="header-left">
          <div class="icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </div>

          <div class="user-titles">
            <h2 class="main-name">{{ vacanteActual.titulo }}</h2>
            <p class="role-subtitle">
              {{ vacanteActual.empresa || "Empresa Confidencial" }}
            </p>
          </div>
        </div>

        <div class="progress-wrapper">
          <svg class="progress-svg" viewBox="0 0 70 70">
            <circle cx="35" cy="35" r="28" class="bg"/>
            <circle
              cx="35" cy="35" r="28" class="fg"
              :style="{ strokeDashoffset: dashOffset }"
            />
          </svg>
          <span class="percentage-text">{{ percentage }}%</span>
        </div>
      </div>

      <div class="content">
        <div class="location-container">
          <p class="location-bar">
            <span class="location-label">UBICACIÓN:</span>
            {{ vacanteActual.ubicacion || "No definida" }}
          </p>
        </div>

        <div class="divider-bold"></div>

        <div class="section">
          <p class="section-title">Tecnologías Requeridas</p>
          <div class="chips-container">
            <span v-for="s in skills" :key="s" class="tech-chip">
              {{ s }}
            </span>
            <span v-if="skills.length === 0" class="text-xs text-gray-400 font-bold">No especificadas</span>
          </div>
        </div>

        <div class="divider-bold"></div>

        <div class="section">
          <p class="section-title">Sobre la Vacante</p>
          <p class="desc-text line-clamp-4">
            {{ vacanteActual.descripcion }}
          </p>
        </div>
      </div>

      <div class="footer">
        <button @click="rechazar" class="action-btn circle-reject" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9b3b3b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <button @click="hacerMatch" class="action-btn circle-accept" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <div v-if="toast.show" class="toast">
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from "vue";
  import { useRouter } from "vue-router";

  const URL_BASE_API = import.meta.env.VITE_API_URL;

  const vacantes = ref([]);
  const indiceActual = ref(0);
  const cargando = ref(true);
  const router = useRouter();

  const mostrarAvisoFiltros = ref(false);

  const vacanteActual = computed(() => {
    return vacantes.value[indiceActual.value] || null;
  });

  const percentage = computed(() => {
    return vacanteActual.value?.score || 0;
  });

  const skills = computed(() => {
    return vacanteActual.value?.skills || [];
  });

  const dashOffset = computed(() => {
    return 176 - (176 * percentage.value) / 100;
  });

  const cargarVacantes = async () => {
    try {
      const idCandidato = localStorage.getItem("usuarioId"); 
      const res = await fetch(`${URL_BASE_API}/api/vacantes/personalizadas/${idCandidato}`);
      const data = await res.json();
      vacantes.value = data.principal || [];
    } catch (error) {
      console.error(error);
    } finally {
      cargando.value = false;
    }
  };

  const siguiente = () => {
    indiceActual.value++;
  };

  const startX = ref(0);
  const offsetX = ref(0);
  const isDragging = ref(false);

  const cardStyle = computed(() => ({
    transform: `translateX(${offsetX.value}px) rotate(${offsetX.value / 12}deg)`,
    transition: isDragging.value ? "none" : "0.3s",
    cursor: isDragging.value ? "grabbing" : "grab"
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

  // Eventos táctiles para móviles
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

  const toast = ref({ show: false, message: "" });
  const showToast = (msg) => {
    toast.value.message = msg;
    toast.value.show = true;
    setTimeout(() => { toast.value.show = false; }, 2000);
  };

  const hacerMatch = async () => {
    await fetch(`${URL_BASE_API}/api/interacciones/swipe-candidato`, {
      method: "PUT", // O POST según lo hayas declarado en tu backend para interacciones/swipe
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_candidato: localStorage.getItem("usuarioId"), 
        id_vacante: vacanteActual.value.id_vacante,
        estado: "like" // <--- ¡AQUÍ ESTÁ LA CORRECCIÓN CLAVE PARA EL ALGORITMO!
      })
    });
    showToast("¡Interés enviado a la empresa!");
    siguiente();
  };

  const rechazar = async () => {
    await fetch(`${URL_BASE_API}/api/interacciones/swipe-candidato`, {
      method: "PUT", // O POST
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_candidato: localStorage.getItem("usuarioId"),
        id_vacante: vacanteActual.value.id_vacante,
        estado: "dislike"
      })
    });
    showToast("Vacante descartada");
    siguiente();
  };

  const handleKey = (e) => {
    if (e.key === "ArrowRight") { offsetX.value = 220; setTimeout(() => { hacerMatch(); offsetX.value = 0; }, 200); }
    if (e.key === "ArrowLeft")  { offsetX.value = -220; setTimeout(() => { rechazar(); offsetX.value = 0; }, 200); }
  };

  onMounted(async () => {
    const idCandidato = localStorage.getItem("usuarioId");
    if (!idCandidato) { router.push("/login"); return; }
    try {
      const res = await fetch(`${URL_BASE_API}/api/filtros/existe/${idCandidato}`);
      const data = await res.json();
      if (data.tieneFiltros) { cargarVacantes(); } 
      else { mostrarAvisoFiltros.value = true; }
    } catch (error) {
      console.error(error);
      mostrarAvisoFiltros.value = true;
    }
    window.addEventListener("keydown", handleKey);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleKey);
  });
</script>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 80px);
  background-color: #f8fafc;
  padding: 20px;
  overflow: hidden;
}

.hero-container {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header-top {
  width: 100%;
  margin-bottom: 10px;
}

.titulo-principal {
  width: 100%;
  text-align: center;
}

.subtitulo-main {
  text-align: center;
  color: #2a6b6d;
  font-size: 16px;
}

.acciones-superiores {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
}

.btn-actualizar {
  border: none;
  padding: 12px 18px;
  border-radius: 16px;
  background: linear-gradient(135deg, #16b8b0, #118a84);
  color: white;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: .25s ease;
  white-space: nowrap;
  box-shadow: 0 10px 22px rgba(0,0,0,.10);
}
.btn-actualizar:hover { transform: translateY(-2px); }

/* ── DISEÑO DE LA TARJETA PRINCIPAL ── */
.card {
  width: 100%;
  max-width: 500px;
  border-radius: 35px;
  overflow: hidden;
  background: white;
  box-shadow: 0 15px 45px rgba(0,0,0,0.08);
  font-family: 'Inter', system-ui, sans-serif;
  user-select: none;
  position: relative;
  touch-action: pan-y; /* Permite scroll vertical pero previene el horizontal nativo en la tarjeta */
}

.empty-card {
  padding: 60px 30px;
}

.icon-box-empty {
  font-size: 50px;
  margin-bottom: 20px;
}

.header {
  background: #2a6b6d;
  color: white;
  padding: 22px 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  gap: 15px;
  align-items: center;
}

.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255,255,255,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-name {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.role-subtitle {
  margin: 2px 0 0;
  font-size: 13px;
  font-weight: 600;
  color: #86efac; 
}

/* PROGRESS */
.progress-wrapper {
  position: relative;
  width: 70px;
  height: 70px;
  flex-shrink: 0;
}

.progress-svg {
  transform: rotate(-90deg);
  width: 70px;
  height: 70px;
}

circle { fill: none; stroke-width: 6; }
.bg { stroke: rgba(255,255,255,0.1); }
.fg { stroke: #86efac; stroke-dasharray: 176; stroke-linecap: round; transition: stroke-dashoffset 0.5s ease; }

.percentage-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 800;
  font-size: 14px;
}

.content { padding: 30px 40px; }

.location-bar { font-size: 13px; color: #4b5563; font-weight: 600; }
.location-label { color: #94a3b8; margin-right: 6px; }

.divider-bold { height: 2px; background: #f1f5f9; margin: 20px 0; }

.section-title {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 15px;
}

.chips-container { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px; }
.tech-chip { padding: 8px 14px; border-radius: 10px; font-size: 12px; font-weight: 700; background: #f1f5f9; color: #2a6b6d; }
.desc-text { font-size: 14px; color: #475569; line-height: 1.6; }

.footer {
  display: flex;
  justify-content: center;
  gap: 40px;
  padding: 0 40px 40px;
}

.action-btn {
  width: 62px;
  height: 62px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.circle-reject { background: white; border: 2px solid #9b3b3b; }
.circle-accept { background: #6a9a41; border: none; box-shadow: 0 8px 20px rgba(106, 154, 65, 0.2); }
.action-btn:active { transform: scale(0.9); }

/* Swipe Indicators Overlay */
.swipe-indicator {
  position: absolute;
  top: 30px;
  font-size: 34px;
  font-weight: 900;
  z-index: 20;
}
.accept-indicator { right: 30px; color: #6a9a41; }
.reject-indicator { left: 30px; color: #9b3b3b; }

/* ── FILTROS AVISO ── */
.filtros-card { margin-top: 10px; animation: fadeUp .5s ease; }
.icon-circle {
  width: 85px; height: 85px; margin: 0 auto 20px auto; border-radius: 50%;
  background: linear-gradient(135deg, #16b8b0, #118a84);
  display: flex; align-items: center; justify-content: center; font-size: 38px; color: white;
  box-shadow: 0 10px 25px rgba(0,0,0,.12);
}
.titulo-filtros { font-size: 24px; font-weight: 800; margin-bottom: 14px; color: #1e293b; }
.subtitulo-filtros { color: #64748b; line-height: 1.6; margin-bottom: 28px; }
.frase-destacada { display: block; margin-top: 14px; font-weight: 700; font-size: 16px; color: #16b8b0; }
.btn-filtros {
  width: 100%; padding: 15px; border: none; border-radius: 18px; font-size: 16px; font-weight: 700; color: white; cursor: pointer;
  background: linear-gradient(135deg, #16b8b0, #118a84); transition: .25s;
}
.btn-filtros:hover { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(0,0,0,.12); }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(25px); }
  to { opacity: 1; transform: translateY(0); }
}

.toast {
  position: fixed; bottom: 40px; right: 40px;
  background: #6a9a41; color: white; padding: 14px 24px;
  border-radius: 16px; font-weight: 700; z-index: 50;
  box-shadow: 0 10px 30px rgba(0,0,0,.12);
}

/* ── MEDIA QUERIES RESPONSIVAS ── */
@media (max-width: 640px) {
  .page-wrapper {
    padding: 10px;
  }
  .card {
    border-radius: 24px;
  }
  .header {
    padding: 16px 20px;
  }
  .content {
    padding: 20px 16px;
  }
  .footer {
    padding: 0 20px 24px;
    gap: 24px;
  }
  .action-btn {
    width: 52px;
    height: 52px;
  }
  .main-name {
    font-size: 18px;
  }
  .role-subtitle {
    font-size: 12px;
  }
  .progress-wrapper {
    width: 55px;
    height: 55px;
  }
  .progress-svg {
    width: 55px;
    height: 55px;
  }
  .percentage-text {
    font-size: 11px;
  }
  circle {
    stroke-width: 5;
  }
  .btn-actualizar {
    padding: 10px 16px;
    font-size: 13px;
  }
  .subtitulo-main {
    font-size: 14px;
  }
}
</style>