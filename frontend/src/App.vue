<template>
    <div class="min-h-screen bg-fondo font-sans text-cerceta">
        
        <nav v-if="debeMostrarNavBar" class="bg-white/80 backdrop-blur-md border-b border-matcha/10 sticky top-0 z-50">
            <div class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                
                <div class="flex items-center gap-3 cursor-pointer" @click="irAInicio">
                    <img src="/logo.png" alt="Match-Ya" class="h-10 w-auto" />
                    <span class="text-2xl font-bold tracking-tight text-cerceta">Match-Ya</span>
                </div>

                <!-- Menú de escritorio -->
                <div class="hidden md:flex items-center space-x-8 font-medium text-sm">
                    
                    <template v-if="rol === 'reclutador'">
                        <router-link to="/reclutador" class="text-cerceta-light hover:text-matcha transition-colors" active-class="text-matcha font-bold text-sm">Inicio</router-link> 
                        <router-link to="/reclutador/listas" class="text-cerceta-light hover:text-matcha transition-colors" active-class="text-matcha font-bold text-sm">Mis Vacantes</router-link>
                        <router-link to="/calendario" class="text-cerceta-light hover:text-matcha transition-colors" active-class="text-matcha font-bold text-sm">Mi Agenda</router-link>
                        <router-link to="/reclutador/perfil" class="text-cerceta-light hover:text-matcha transition-colors" active-class="text-matcha font-bold text-sm">Perfil de Reclutador</router-link>
                        <router-link to="/reclutador/publicar" class="px-4 py-2 bg-matcha text-white rounded-lg shadow-md hover:bg-matcha-dark transition-colors font-bold text-sm">Publicar Vacante</router-link>
                    </template>

                    <template v-else-if="rol === 'candidato'">
                        <router-link to="/candidato" class="text-cerceta-light hover:text-matcha transition-colors" active-class="text-matcha font-bold">Inicio</router-link>
                        <router-link to="/swipec" class="text-cerceta-light hover:text-matcha transition-colors" active-class="text-matcha font-bold">Explorar</router-link>
                        <router-link to="/estatus" class="text-cerceta-light hover:text-matcha transition-colors" active-class="text-matcha font-bold">Mis Postulaciones</router-link>
                        <router-link to="/calendario" class="text-cerceta-light hover:text-matcha transition-colors" active-class="text-matcha font-bold">Mi Agenda</router-link>
                        <router-link to="/retroalimentacion" class="text-cerceta-light hover:text-matcha transition-colors" active-class="text-matcha font-bold">Retroalimentación</router-link>
                        <router-link to="/perfil" class="text-cerceta-light hover:text-matcha transition-colors" active-class="text-matcha font-bold">Mi Perfil</router-link>
                    </template>

                    <button @click="cerrarSesion" class="text-red-500 hover:text-red-700 transition-colors ml-4 font-bold">Salir</button>
                    
                </div>

                <!-- Botón hamburguesa para móvil -->
                <div class="flex items-center md:hidden">
                    <button @click="menuAbierto = !menuAbierto" class="text-cerceta hover:text-matcha focus:outline-none">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path v-if="!menuAbierto" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
            </div>

            <!-- Menú desplegable para móvil -->
            <div v-if="menuAbierto" class="md:hidden border-t border-matcha/10 bg-white/95 backdrop-blur-md px-6 py-4 flex flex-col gap-4 font-medium text-sm">
                <template v-if="rol === 'reclutador'">
                    <router-link to="/reclutador" class="text-cerceta-light hover:text-matcha py-2 border-b border-gray-100 transition-colors" active-class="text-matcha font-bold">Inicio</router-link> 
                    <router-link to="/reclutador/listas" class="text-cerceta-light hover:text-matcha py-2 border-b border-gray-100 transition-colors" active-class="text-matcha font-bold">Mis Vacantes</router-link>
                    <router-link to="/calendario" class="text-cerceta-light hover:text-matcha py-2 border-b border-gray-100 transition-colors" active-class="text-matcha font-bold">Mi Agenda</router-link>
                    <router-link to="/reclutador/perfil" class="text-cerceta-light hover:text-matcha py-2 border-b border-gray-100 transition-colors" active-class="text-matcha font-bold">Perfil de Reclutador</router-link>
                    <router-link to="/reclutador/publicar" class="px-4 py-2 bg-matcha text-white rounded-lg shadow-md hover:bg-matcha-dark transition-colors font-bold text-center mt-2">Publicar Vacante</router-link>
                </template>

                <template v-else-if="rol === 'candidato'">
                    <router-link to="/candidato" class="text-cerceta-light hover:text-matcha py-2 border-b border-gray-100 transition-colors" active-class="text-matcha font-bold">Inicio</router-link>
                    <router-link to="/swipec" class="text-cerceta-light hover:text-matcha py-2 border-b border-gray-100 transition-colors" active-class="text-matcha font-bold">Explorar</router-link>
                    <router-link to="/estatus" class="text-cerceta-light hover:text-matcha py-2 border-b border-gray-100 transition-colors" active-class="text-matcha font-bold">Mis Postulaciones</router-link>
                    <router-link to="/calendario" class="text-cerceta-light hover:text-matcha py-2 border-b border-gray-100 transition-colors" active-class="text-matcha font-bold">Mi Agenda</router-link>
                    <router-link to="/retroalimentacion" class="text-cerceta-light hover:text-matcha py-2 border-b border-gray-100 transition-colors" active-class="text-matcha font-bold">Retroalimentación</router-link>
                    <router-link to="/perfil" class="text-cerceta-light hover:text-matcha py-2 border-b border-gray-100 transition-colors" active-class="text-matcha font-bold">Mi Perfil</router-link>
                </template>

                <button @click="cerrarSesion" class="text-red-500 hover:text-red-700 py-2 font-bold text-left mt-2">Salir</button>
            </div>
        </nav>

        <main class="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10">
            <router-view></router-view>
        </main>
        
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const rutaActual = useRoute()
const enrutador = useRouter()

// 1. Variables de Estado
const rol = ref('')
const sesionActiva = ref(false)
const menuAbierto = ref(false)

// 2. Constantes de Rutas
const RUTAS_SIN_NAVBAR = ['/login', '/registro', '/inicio', '/', '/reclutador/setup']

// 3. Propiedades Computadas
const debeMostrarNavBar = computed(() => {
    // Se muestra si el usuario tiene sesión activa y NO está en una ruta pública
    return sesionActiva.value && !RUTAS_SIN_NAVBAR.includes(rutaActual.path)
})

// 4. Reactividad de Sesión (Esta es la magia que repara el error)
// Escucha cada cambio de ruta para actualizar quién está navegando
watch(() => rutaActual.path, () => {
    sesionActiva.value = localStorage.getItem('sesionActiva') === 'true'
    rol.value = localStorage.getItem('rolUsuario')
    menuAbierto.value = false
}, { immediate: true })

// 5. Métodos de Acción
const irAInicio = () => {
    if (rol.value === 'reclutador') {
        enrutador.push('/reclutador')
    } else {
        enrutador.push('/candidato')
    }
}

const cerrarSesion = () => {
    // Destruimos todas las credenciales y datos de sesión
    localStorage.removeItem('sesionActiva')
    localStorage.removeItem('rolUsuario')
    localStorage.removeItem('usuarioId')
    localStorage.removeItem('id_candidato')
    localStorage.removeItem('nombreUsuario')
    localStorage.removeItem('nombreEmpresa')
    localStorage.removeItem('empresa_configurada')
    localStorage.removeItem('filtros_configurados')

    // Limpiamos las variables locales
    sesionActiva.value = false
    rol.value = ''
    menuAbierto.value = false

    // Redirigimos al Login
    enrutador.push('/login')
}
</script>