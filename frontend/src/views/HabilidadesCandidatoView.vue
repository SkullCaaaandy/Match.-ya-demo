<template>
  <div class="page-wrapper">
    <div class="card">
      <div class="header">
        <div class="header-left">
          <div class="icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </div>
          <div class="user-titles">
            <h2 class="main-name">Neyzer Torres</h2>
            <p class="role-subtitle">Ingeniero de Software | Frontend Developer</p>
          </div>
        </div>

        <div class="progress-wrapper">
          <svg class="progress-svg">
            <circle cx="35" cy="35" r="28" class="bg"/>
            <circle cx="35" cy="35" r="28" class="fg" :style="{ strokeDashoffset: dashOffset }"/>
          </svg>
          <span class="percentage-text">{{ percentage }}%</span>
        </div>
      </div>

      <div class="content">
        <div class="location-container">
          <p class="location-bar">
            <span class="location-label">UBICACIÓN:</span> Guadalajara, Jalisco
          </p>
        </div>

        <div class="divider-bold"></div>

        <div class="section">
          <p class="section-title">Habilidades Técnicas</p>
          <div class="chips-container">
            <span v-for="s in skills" :key="s" class="tech-chip">{{ s }}</span>
          </div>
        </div>

        <div class="section">
          <p class="section-title">Habilidades Adicionales</p>
          <div class="chips-container">
            <span v-for="a in additionalSkills" :key="a" class="extra-chip">{{ a }}</span>
          </div>
        </div>

        <div class="divider-bold"></div>

        <div class="section">
          <p class="section-title">Sobre el Perfil</p>
          <p class="desc-text">
            Ingeniero enfocado en el desarrollo de interfaces de alto rendimiento y arquitecturas escalables, garantizando experiencias de usuario fluidas y eficientes.
          </p>
        </div>

        <button class="cta-button">Ver perfil completo</button>
      </div>

      <div class="footer">
        <button class="action-btn circle-reject">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9b3b3b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <button class="action-btn circle-accept">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const percentage = 94;
const skills = ["Vue.js", "Kotlin", "Firebase", "Scrum", "UI/UX", "JavaScript", "Git"];
const additionalSkills = ["Node.js", "PostgreSQL", "Docker", "Inglés (C1)"];


const dashOffset = computed(() => 176 - (176 * percentage) / 100);
</script>

<style scoped>
.page-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  background-color: #f8fafc;
  padding: 20px;
}

.card {
  width: 100%;
  max-width: 500px; 
  border-radius: 35px;
  overflow: hidden;
  background: white;
  box-shadow: 0 15px 45px rgba(0,0,0,0.08);
  font-family: 'Inter', system-ui, sans-serif;
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
  font-size: 25px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.role-subtitle {
  margin: 2px 0 0;
  font-size: 14px;
  font-weight: 600;
  color: #86efac; 
}

/* PROGRESS */
.progress-wrapper {
  position: relative;
  width: 70px;
  height: 70px;
}

.progress-svg {
  transform: rotate(-90deg);
  width: 70px;
  height: 70px;
}

circle { fill: none; stroke-width: 6; }
.bg { stroke: rgba(255,255,255,0.1); }
.fg { stroke: #86efac; stroke-dasharray: 176; stroke-linecap: round; }

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


.divider-bold {
  height: 2px;
  background: #f1f5f9;
  margin: 20px 0;
}

.section-title {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 15px;
}

.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}


.tech-chip, .extra-chip {
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
}

.tech-chip {
  background: #f1f5f9;
  color: #2a6b6d;
}

.extra-chip {
  background: #ffffff;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.desc-text { font-size: 14px; color: #475569; line-height: 1.6; }

.cta-button {
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
}

.cta-button:hover { opacity: 0.9; }


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

.circle-reject {
  background: white;
  border: 2px solid #9b3b3b;
}

.circle-accept {
  background: #6a9a41;
  border: none;
  box-shadow: 0 8px 20px rgba(106, 154, 65, 0.2);
}

.action-btn:active { transform: scale(0.9); }
</style>