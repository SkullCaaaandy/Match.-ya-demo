<template>
    <div class="flex flex-col items-center justify-center min-h-[80vh]">
        <div class="bg-white rounded-[2rem] shadow-suave w-full max-w-md p-10 border border-matcha/5 transition-transform hover:-translate-y-1">
            
            <div class="flex flex-col items-center mb-8">
                <img src="/logo.png" alt="Match-Ya" class="h-16 w-auto mb-4" />
                <h2 class="text-2xl font-extrabold text-cerceta tracking-tight">Crea tu Cuenta</h2>
                <p class="text-sm text-cerceta-light mt-1">Únete a Match-Ya hoy mismo</p>
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

            <form @submit.prevent="registrarUsuario" class="space-y-5">
                
                <div>
                    <label class="block text-xs font-semibold text-cerceta uppercase tracking-wide mb-1.5">
                        {{ rol === 'candidato' ? 'Nombre Completo' : 'Nombre de la Empresa' }}
                    </label>
                    <input 
                        v-model="nombreRegistro" 
                        type="text" 
                        :placeholder="rol === 'candidato' ? 'Ej. Sabrina Carpintera' : 'Ej. Code Divas'" 
                        class="w-full px-4 py-3 rounded-xl bg-fondo border border-transparent focus:border-matcha-light focus:bg-white focus:ring-4 focus:ring-matcha/10 outline-none transition-all text-cerceta" 
                        required
                    >
                </div>

                <div>
                    <label class="block text-xs font-semibold text-cerceta uppercase tracking-wide mb-1.5">Correo Electrónico</label>
                    <input v-model="correoElectronico" type="email" placeholder="correo@ejemplo.com" class="w-full px-4 py-3 rounded-xl bg-fondo border border-transparent focus:border-matcha-light focus:bg-white focus:ring-4 focus:ring-matcha/10 outline-none transition-all text-cerceta" required>
                </div>
                
                <div>
                    <label class="block text-xs font-semibold text-cerceta uppercase tracking-wide mb-1.5">Contraseña</label>
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
                </div>

                <div>
                    <label class="block text-xs font-semibold text-cerceta uppercase tracking-wide mb-1.5">Confirmar Contraseña</label>
                    <div class="relative">
                        <input 
                            v-model="confirmarContrasena" 
                            :type="mostrarConfirmarContrasena ? 'text' : 'password'" 
                            placeholder="••••••••" 
                            class="w-full pl-4 pr-12 py-3 rounded-xl bg-fondo border border-transparent focus:border-matcha-light focus:bg-white focus:ring-4 focus:ring-matcha/10 outline-none transition-all text-cerceta" 
                            required
                        >
                        <button 
                            type="button" 
                            @click="mostrarConfirmarContrasena = !mostrarConfirmarContrasena" 
                            class="absolute inset-y-0 right-0 pr-4 flex items-center text-cerceta-light hover:text-matcha transition-colors"
                            tabindex="-1"
                        >
                            <svg v-if="mostrarConfirmarContrasena" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                        </button>
                    </div>
                </div>

                <button type="submit" class="w-full py-3.5 mt-4 bg-matcha text-white rounded-xl font-bold text-lg shadow-lg shadow-matcha/30 hover:bg-matcha-dark hover:-translate-y-0.5 transition-all">
                    Crear Cuenta
                </button>
            </form>
            
            <p class="text-center text-sm text-cerceta-light mt-8">
                ¿Ya tienes cuenta? <router-link to="/login" class="text-matcha font-bold hover:underline">Inicia sesión</router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const rol = ref('candidato')

// Variables enlazadas
const nombreRegistro = ref('')
const correoElectronico = ref('')
const contrasena = ref('')
const confirmarContrasena = ref('') // <-- Nueva variable

// Variables para los ojitos
const mostrarContrasena = ref(false)
const mostrarConfirmarContrasena = ref(false)

const URL_BASE_API = import.meta.env.VITE_API_URL
const URL_REGISTRO = `${URL_BASE_API}/api/auth/registro`

const registrarUsuario = async () => {
    // 1. VALIDACIÓN DEL LADO DEL CLIENTE
    if (contrasena.value !== confirmarContrasena.value) {
        alert('Las contraseñas no coinciden. Por favor, verifícalas.')
        return
    }

    // 2. COMUNICACIÓN CON EL SERVIDOR
    try {
        const configuracionPeticion = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombreCompleto: nombreRegistro.value,
                correoElectronico: correoElectronico.value,
                contrasena: contrasena.value,
                rolUsuario: rol.value
            })
        }

        const respuestaServidor = await fetch(URL_REGISTRO, configuracionPeticion)
        const datosRespuesta = await respuestaServidor.json()

        if (!respuestaServidor.ok) {
            alert(datosRespuesta.mensaje)
            return
        }

        console.log('Registro exitoso:', datosRespuesta)
        localStorage.setItem('sesionActiva', 'true')
        localStorage.setItem('rolUsuario', rol.value)
        localStorage.setItem('usuarioId', datosRespuesta.usuario.id)
        localStorage.setItem('id_candidato', datosRespuesta.usuario.id)
        localStorage.setItem('nombreEmpresa', nombreRegistro.value)
        
        // Redirección dinámica según el rol
        if (rol.value === 'candidato') {
            router.push('/perfil') 
        } else {
            router.push('/reclutador/setup')
        }

    } catch (excepcionPeticion) {
        console.error('Error en el registro:', excepcionPeticion)
        alert('Error de conexión con el servidor. Verifica que esté encendido.')
    }
}
</script>