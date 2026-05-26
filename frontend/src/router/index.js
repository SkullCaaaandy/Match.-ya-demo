import { createRouter, createWebHistory } from 'vue-router'

// ─── IMPORTACIÓN DE COMPONENTES DE VISTA ──────────────────────────────────
import LoginView from '../views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import InicioView from '@/views/InicioView.vue'
import SwipeViewReclutador from '../views/SwipeViewReclutador.vue'
import ReclutadorInicioView from '../views/ReclutadorInicioView.vue'
import ReclutadorListasView from '../views/ReclutadorListasView.vue'
import PublicarVacanteView from '../views/PublicarVacanteView.vue'
import HabilidadesCandidatoView from '@/views/HabilidadesCandidatoView.vue'
import InicioViewCandidato from '@/views/InicioViewCandidato.vue' 
import SwipeViewCandidato from '../views/SwipeViewCandidato.vue'
import EstatusView from '../views/EstatusView.vue'
import RetroalimentacionView from '@/views/RetroalimentacionView.vue'
import PerfilView from '../views/PerfilView.vue'
import JobSearchFiltersView from '../views/JobSearchFiltersView.vue'
import CalendarioEntrevistaView from '@/views/CalendarioEntrevistaView.vue'
import PerfilCompletoView from '@/views/PerfilCompletoView.vue'
import EmpresaSetupView from '@/views/EmpresaSetupView.vue'
import ReclutadorPerfilView from '@/views/ReclutadorPerfilView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // RUTA INICIAL: Redirección automática al Home público
    { path: '/', redirect: '/inicio' }, 

    // VISTA: InicioView.vue (Landing page/Página de bienvenida)
    { path: '/inicio', name: 'Inicio', component: InicioView }, 

    // VISTA: LoginView.vue (Acceso al sistema)
    { path: '/login', name: 'login', component: LoginView },   

    // VISTA: SignupView.vue (Creación de cuenta nueva)
    { path: '/registro', name: 'signup', component: SignupView }, 

    // VISTA: EmpresaSetupView.vue (Configuración de empresa — solo reclutador)
    { 
      path: '/reclutador/setup', name: 'empresa-setup', component: EmpresaSetupView,
      meta: { requiereAuth: true, rol: 'reclutador' }
    },

    
    // ─── RUTAS PROTEGIDAS: RECLUTADOR ──────────────────────────────────────
    
    // VISTA: ReclutadorInicioView.vue (Dashboard principal del reclutador)
    { 
      path: '/reclutador', name: 'reclutador-inicio', component: ReclutadorInicioView, 
      meta: { requiereAuth: true, rol: 'reclutador' } 
    },

    // VISTA: SwipeViewReclutador.vue (Evaluación de candidatos estilo swipe)
    { 
      path: '/swiper/:id', name: 'swipeReclutador', component: SwipeViewReclutador,
      meta: { requiereAuth: true, rol: 'reclutador' } 
    },

    // VISTA: ReclutadorListasView.vue (Listado general de vacantes y postulantes)
    { 
      path: '/reclutador/listas', name: 'reclutador-listas', component: ReclutadorListasView, 
      meta: { requiereAuth: true, rol: 'reclutador' } 
    },

    // VISTA: PublicarVacanteView.vue (Formulario para crear nuevas vacantes)
    { 
      path: '/reclutador/publicar', name: 'PublicarVacante', component: PublicarVacanteView, 
      meta: { requiereAuth: true, rol: 'reclutador' } 
    },
    // VISTA: ReclutadorPerfilView.vue (Edición de datos de empresa del reclutador)
    { 
      path: '/reclutador/perfil', name: 'reclutador-perfil', component: ReclutadorPerfilView, 
      meta: { requiereAuth: true, rol: 'reclutador' } 
    },

    // VISTA: HabilidadesCandidatoView.vue (Ficha técnica del perfil del candidato)
    { 
      path: '/habilidades', name: 'habilidades', component: HabilidadesCandidatoView, 
      meta: { requiereAuth: true, rol: 'reclutador' } 
    },

    //VISTA: Perfil completo del candidato (Ver CV)
    { 
    path: '/reclutador/candidato/:id', name: 'perfilCandidatoCompleto', component: PerfilCompletoView,
    meta: { requiereAuth: true, rol: 'reclutador' } 
    },


    // ─── RUTAS PROTEGIDAS: CANDIDATO ───────────────────────────────────────

    // VISTA: InicioViewCandidato.vue (Dashboard principal del candidato)
    { 
      path: '/candidato', name: 'inicioCandidato', component: InicioViewCandidato, 
      meta: { requiereAuth: true, rol: 'candidato' } 
    },

    // VISTA: SwipeViewCandidato.vue (Exploración de vacantes recomendadas)
    { 
      path: '/swipec', name: 'swipePostulante', component: SwipeViewCandidato, 
      meta: { requiereAuth: true, rol: 'candidato' } 
    },

    // VISTA: EstatusView.vue (Sección "Mis Postulaciones" y seguimiento)
    { 
      path: '/estatus', name: 'estatus', component: EstatusView, 
      meta: { requiereAuth: true, rol: 'candidato' } 
    },

    // VISTA: RetroalimentacionView.vue (Revisión de feedback de reclutadores)
    { 
      path: '/retroalimentacion', name: 'retroalimentacion', component: RetroalimentacionView, 
      meta: { requiereAuth: true, rol: 'candidato' }
    },

    // VISTA: PerfilView.vue (Edición de datos personales del candidato)
    { 
      path: '/perfil', name: 'perfil', component: PerfilView, 
      meta: { requiereAuth: true, rol: 'candidato' } 
    },

    // VISTA: JobSearchFiltersView.vue (Configuración de preferencias de búsqueda)
    { 
      path: '/filtros', name: 'JobSearchFilters', component: JobSearchFiltersView, 
      meta: { requiereAuth: true, rol: 'candidato' } 
    },


    // ─── RUTA COMPARTIDA: AMBOS ROLES ──────────────────────────────────────

    // VISTA: CalendarioEntrevistaView.vue (Agenda personal de entrevistas)
    { 
      path: '/calendario', 
      name: 'calendario', 
      component: CalendarioEntrevistaView, 
      meta: { requiereAuth: true } 
    }
  ]
})

// ─── GUARDIÁN DE SEGURIDAD (MIDDLEWARE) ───────────────────────────────────
router.beforeEach((to, from, next) => {
  const estaAutenticado = localStorage.getItem('sesionActiva') === 'true'
  const rolUsuario = localStorage.getItem('rolUsuario')

  // Redirigir al Login si no hay sesión
  if (to.meta.requiereAuth && !estaAutenticado) {
    return next('/login')
  }

  // Restringir acceso por rol (Reclutador vs Candidato)
  if (to.meta.requiereAuth && to.meta.rol && to.meta.rol !== rolUsuario) {
    return next(rolUsuario === 'reclutador' ? '/reclutador' : '/candidato')
  }

  // Evitar que usuarios logueados vuelvan al Login/Registro
  if (estaAutenticado && (to.path === '/login' || to.path === '/registro')) {
    return next(rolUsuario === 'reclutador' ? '/reclutador' : '/candidato')
  }

  next()
})

export default router