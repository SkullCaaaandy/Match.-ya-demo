<template>
    <div class="ficha-card" :class="{ 'modo-preview': previewMode }">

        <div class="ficha-header">
            <div class="ficha-header-izquierda">
                <div class="ficha-icono">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2.5"
                        stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="16 18 22 12 16 6"></polyline>
                        <polyline points="8 6 2 12 8 18"></polyline>
                    </svg>
                </div>
                <div class="ficha-titulos">
                    <h2 class="ficha-nombre">{{ nombre }}</h2>
                    <p class="ficha-rol">{{ rol }}</p>
                </div>
            </div>

            <div class="ficha-progreso-wrap">
                <svg class="ficha-progreso-svg" viewBox="0 0 70 70">
                    <circle cx="35" cy="35" r="28" class="ficha-circulo-fondo"/>
                    <circle cx="35" cy="35" r="28" class="ficha-circulo-progreso"
                        :style="{ strokeDashoffset: dashOffset }"/>
                </svg>
                <span class="ficha-pct">{{ porcentaje }}%</span>
            </div>
        </div>

        <div class="ficha-contenido">
            <p class="ficha-ubicacion">
                <span class="ficha-ubicacion-label">UBICACIÓN:</span> {{ ubicacion }}
            </p>

            <div class="ficha-divisor"></div>

            <div class="ficha-seccion">
                <p class="ficha-seccion-titulo">Habilidades Técnicas</p>
                <div class="ficha-chips">
                    <span v-for="s in habilidades" :key="s" class="ficha-chip-tec">{{ s }}</span>
                </div>
            </div>

            <div class="ficha-seccion">
                <p class="ficha-seccion-titulo">Habilidades Adicionales</p>
                <div class="ficha-chips">
                    <span v-for="a in habilidadesExtra" :key="a" class="ficha-chip-add">{{ a }}</span>
                </div>
            </div>

            <div class="ficha-divisor"></div>

            <div class="ficha-seccion">
                <p class="ficha-seccion-titulo">Sobre el Perfil</p>
                <p class="ficha-descripcion">{{ descripcion }}</p>
            </div>

            <button class="ficha-boton-ver" @click="$emit('ver-perfil')">VER PERFIL COMPLETO</button>
        </div>

        <div v-if="!previewMode" class="ficha-footer">
            <button class="ficha-btn-rechazar" @click="$emit('rechazar')" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                    fill="none" stroke="#9b3b3b" stroke-width="2.5"
                    stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <button class="ficha-btn-aceptar" @click="$emit('aceptar')" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                    fill="none" stroke="white" stroke-width="3.5"
                    stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </button>
        </div>

    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    nombre:           { type: String,  default: 'Candidato' },
    rol:              { type: String,  default: '' },
    ubicacion:        { type: String,  default: '' },
    porcentaje:       { type: Number,  default: 0 },
    habilidades:      { type: Array,   default: () => [] },
    habilidadesExtra: { type: Array,   default: () => [] },
    descripcion:      { type: String,  default: '' },
    previewMode:      { type: Boolean, default: false },
})

defineEmits(['aceptar', 'rechazar', 'ver-perfil'])

const dashOffset = computed(() => 176 - (176 * props.porcentaje) / 100)
</script>

<style scoped>
/* ── TARJETA BASE: idéntica al HabilidadesCandidatoView ── */
.ficha-card {
    width: 100%;
    max-width: 500px;
    border-radius: 35px;
    overflow: hidden;
    background: white;
    box-shadow: 0 15px 45px rgba(0, 0, 0, 0.08);
    font-family: 'Inter', system-ui, sans-serif;
}

/* ── HEADER ── */
.ficha-header {
    background: #2a6b6d;
    color: white;
    padding: 22px 35px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.ficha-header-izquierda {
    display: flex;
    gap: 15px;
    align-items: center;
    min-width: 0;
    flex: 1;
}

.ficha-icono {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.ficha-titulos { min-width: 0; }

.ficha-nombre {
    margin: 0;
    font-size: 25px;
    font-weight: 800;
    letter-spacing: -0.5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.ficha-rol {
    margin: 2px 0 0;
    font-size: 14px;
    font-weight: 600;
    color: #86efac;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.ficha-progreso-wrap {
    position: relative;
    width: 70px;
    height: 70px;
    flex-shrink: 0;
}

.ficha-progreso-svg {
    transform: rotate(-90deg);
    width: 70px;
    height: 70px;
}

.ficha-circulo-fondo   { fill: none; stroke: rgba(255,255,255,0.1); stroke-width: 6; }
.ficha-circulo-progreso { fill: none; stroke: #86efac; stroke-width: 6; stroke-dasharray: 176; stroke-linecap: round; }

.ficha-pct {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: 800;
    font-size: 14px;
    color: white;
}

/* ── CONTENIDO ── */
.ficha-contenido { padding: 30px 40px; }

.ficha-ubicacion { font-size: 13px; color: #4b5563; font-weight: 600; }
.ficha-ubicacion-label { color: #94a3b8; margin-right: 6px; }

.ficha-divisor { height: 2px; background: #f1f5f9; margin: 20px 0; }

.ficha-seccion { margin-bottom: 4px; }

.ficha-seccion-titulo {
    font-size: 11px;
    color: #94a3b8;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 15px;
}

.ficha-chips { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px; }

.ficha-chip-tec {
    padding: 8px 14px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 700;
    background: #f1f5f9;
    color: #2a6b6d;
}

.ficha-chip-add {
    padding: 8px 14px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 700;
    background: #ffffff;
    color: #64748b;
    border: 1px solid #e2e8f0;
}

.ficha-descripcion { font-size: 14px; color: #475569; line-height: 1.6; }

.ficha-boton-ver {
    width: 100%;
    margin-top: 25px;
    padding: 16px;
    border: none;
    border-radius: 18px;
    background: #3bb4a1;
    color: white;
    font-size: 14px;
    font-weight: 800;
    text-transform: uppercase;
    cursor: pointer;
    transition: opacity 0.2s;
    font-family: inherit;
}

.ficha-boton-ver:hover { opacity: 0.9; }

/* ── FOOTER: botones like/dislike ── */
.ficha-footer {
    display: flex;
    justify-content: center;
    gap: 40px;
    padding: 0 40px 40px;
}

.ficha-btn-rechazar,
.ficha-btn-aceptar {
    width: 62px;
    height: 62px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s;
    border: none;
}

.ficha-btn-rechazar {
    background: white;
    border: 2px solid #9b3b3b !important;
}

.ficha-btn-aceptar {
    background: #6a9a41;
    box-shadow: 0 8px 20px rgba(106, 154, 65, 0.2);
}

.ficha-btn-rechazar:active,
.ficha-btn-aceptar:active { transform: scale(0.9); }

/* ── MODO PREVIEW: columna derecha del perfil del candidato ── */
.modo-preview {
    max-width: 100%;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.07);
}

.modo-preview .ficha-header           { padding: 20px 24px; }
.modo-preview .ficha-icono            { width: 42px; height: 42px; border-radius: 10px; }
.modo-preview .ficha-header-izquierda { gap: 12px; }
.modo-preview .ficha-nombre           { font-size: 18px; }
.modo-preview .ficha-rol              { font-size: 12px; }
.modo-preview .ficha-progreso-wrap    { width: 58px; height: 58px; }
.modo-preview .ficha-progreso-svg     { width: 58px; height: 58px; }
.modo-preview .ficha-pct              { font-size: 12px; }
.modo-preview .ficha-contenido        { padding: 20px 24px; }
.modo-preview .ficha-ubicacion        { font-size: 13px; }
.modo-preview .ficha-divisor          { height: 2px; margin: 16px 0; }
.modo-preview .ficha-seccion-titulo   { font-size: 11px; margin-bottom: 12px; }
.modo-preview .ficha-chip-tec,
.modo-preview .ficha-chip-add         { padding: 7px 13px; font-size: 12px; border-radius: 9px; }
.modo-preview .ficha-chips            { gap: 8px; margin-bottom: 8px; }
.modo-preview .ficha-descripcion      { font-size: 13px; line-height: 1.6; }
.modo-preview .ficha-boton-ver        { margin-top: 20px; padding: 14px; font-size: 13px; border-radius: 16px; }

@media (max-width: 640px) {
    .ficha-nombre {
        white-space: normal;
        font-size: 20px;
    }
    .ficha-rol {
        white-space: normal;
        font-size: 13px;
    }
    .ficha-header {
        padding: 16px 20px;
    }
    .ficha-contenido {
        padding: 20px 16px;
    }
    .ficha-footer {
        padding: 0 20px 24px;
        gap: 24px;
    }
    .ficha-btn-rechazar,
    .ficha-btn-aceptar {
        width: 52px;
        height: 52px;
    }
    .ficha-card {
        border-radius: 24px;
    }
}
</style>