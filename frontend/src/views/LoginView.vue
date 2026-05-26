<template>
    <div class="flex flex-col items-center justify-center min-h-[80vh]">
        <div class="bg-white rounded-[2rem] shadow-suave w-full max-w-md p-10 border border-matcha/5 transition-transform hover:-translate-y-1">
            
            <div class="flex flex-col items-center mb-8">
                <img src="/logo.png" alt="Match-Ya" class="h-16 w-auto mb-4" />
                <h2 class="text-2xl font-extrabold text-cerceta tracking-tight">Bienvenido de Vuelta</h2>
                <p class="text-sm text-cerceta-light mt-1">Ingresa a tu Cuenta para Continuar</p>
            </div>

            <div class="flex bg-fondo rounded-xl p-1 mb-8">
                <button 
                    @click="rol = 'candidato'"
                    :class="rol === 'candidato' ? 'bg-white shadow-sm text-cerceta font-bold' : 'text-cerceta-light hover:text-cerceta'"
                    class="flex-1 py-2 rounded-lg text-sm transition-all"
                >
                    Candidato
                </button>
                <button 
                    @click="rol = 'reclutador'"
                    :class="rol === 'reclutador' ? 'bg-white shadow-sm text-cerceta font-bold' : 'text-cerceta-light hover:text-cerceta'"
                    class="flex-1 py-2 rounded-lg text-sm transition-all"
                >
                    Reclutador
                </button>
            </div>

            <form @submit.prevent="iniciarSesion" class="space-y-5">
                
                <div>
                    <input v-model="correoElectronico" type="email" placeholder="correo@ejemplo.com" class="w-full px-4 py-3 rounded-xl bg-fondo border border-transparent focus:border-matcha-light focus:bg-white focus:ring-4 focus:ring-matcha/10 outline-none transition-all text-cerceta" required>
                </div>
                
                <div class="relative">
                    <input 
                        v-model="contrasena" 
                        :type="mostrarContrasena ? 'text' : 'password'" 
                        placeholder="••••••••" 
                        class="w-full pl-4 pr-12 py-3 rounded-xl bg-fondo border border-transparent focus:border-matcha-light focus:bg-white focus:ring-4 focus:ring-matcha/10 outline-none transition-all text-cerceta" 
                        required
                    >
                    <button 
                        type="button" 
                        @click="mostrarContrasena = !mostrarContrasena" 
                        class="absolute inset-y-0 right-0 pr-4 flex items-center text-cerceta-light hover:text-matcha transition-colors"
                        tabindex="-1"
                    >
                        <svg v-if="mostrarContrasena" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                    </button>
                </div>

                <div class="flex items-center justify-between pt-1">
                    <label class="flex items-center gap-2 cursor-pointer group">
                        <input v-model="recordarUsuario" type="checkbox" class="w-4 h-4 text-matcha bg-fondo border-matcha/20 rounded focus:ring-matcha focus:ring-2 cursor-pointer">
                        <span class="text-xs font-semibold text-cerceta-light group-hover:text-cerceta transition-colors">Recuérdame</span>
                    </label>
                    
                    <a href="#" class="text-xs font-bold text-matcha hover:underline">¿Olvidaste tu contraseña?</a>
                </div>

                <button type="submit" class="w-full py-3.5 mt-2 bg-matcha text-white rounded-xl font-bold text-lg shadow-lg shadow-matcha/30 hover:bg-matcha-dark hover:-translate-y-0.5 transition-all">
                    Iniciar Sesión
                </button>
            </form>
            
            <p class="text-center text-sm text-cerceta-light mt-8">
                ¿No tienes cuenta? <router-link to="/registro" class="text-matcha font-bold hover:underline">Regístrate aquí</router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const rol = ref('candidato')

// Variables enlazadas
const correoElectronico = ref('')
const contrasena = ref('')
const recordarUsuario = ref(false)
const mostrarContrasena = ref(false) // <-- ¡NUEVA VARIABLE AÑADIDA!

// Constantes
const CLAVE_MEMORIA_LOCAL = 'matchYaCorreoUsuario'
const URL_BASE_API = import.meta.env.VITE_API_URL
const URL_INICIO_SESION = `${URL_BASE_API}/api/auth/login`

// Método que se ejecuta apenas carga la pantalla
onMounted(() => {
    const correoGuardado = localStorage.getItem(CLAVE_MEMORIA_LOCAL)
    
    if (correoGuardado) {
        correoElectronico.value = correoGuardado
        recordarUsuario.value = true
    }
})

const procesarRecuerdoDeUsuario = () => {
    if (recordarUsuario.value) {
        localStorage.setItem(CLAVE_MEMORIA_LOCAL, correoElectronico.value)
    } else {
        localStorage.removeItem(CLAVE_MEMORIA_LOCAL)
    }
}

const iniciarSesion = async () => {
    try {
        const configuracionPeticion = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                correoElectronico: correoElectronico.value,
                contrasena: contrasena.value,
                rolUsuario: rol.value // Enviamos el rol seleccionado para validarlo en backend
            })
        }

        const respuestaServidor = await fetch(URL_INICIO_SESION, configuracionPeticion)
        const datosRespuesta = await respuestaServidor.json()

        // Validamos si el backend nos regresó un error (ej. credenciales inválidas o rol incorrecto)
        if (!respuestaServidor.ok) {
            alert(datosRespuesta.mensaje)
            return
        }

        // --- LÓGICA DE SEGURIDAD FRONTEND ---
        // Usamos el rol real de los metadatos de Supabase, no el del toggle de la UI.
        // Esto evita que un reclutador quede registrado como candidato si no cambia el toggle.
        const rolReal = datosRespuesta.usuario.user_metadata?.rol || rol.value

        localStorage.setItem('sesionActiva', 'true')
        localStorage.setItem('rolUsuario', rolReal)
        localStorage.setItem('usuarioId', datosRespuesta.usuario.id)
        localStorage.setItem('id_candidato', datosRespuesta.usuario.id)
        localStorage.setItem(
            'nombreUsuario',
            datosRespuesta.usuario.user_metadata?.nombre || ''
        )

        // Verificamos si marcamos el checkbox para recordar el correo
        procesarRecuerdoDeUsuario()
        
        // Redirección dinámica a la vista correspondiente
        if (rolReal === 'candidato') {
            router.push('/candidato') 
        } else {
            router.push('/reclutador') 
        }

    } catch (excepcionPeticion) {
        console.error('Error en el login:', excepcionPeticion)
        alert('Error de conexión con el servidor. Verifica que esté encendido.')
    }
}
</script>