<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white rounded-2xl shadow-md overflow-hidden">
      
        <div class="bg-cerceta h-32 relative">
            <div>
                <h2 class="text-3xl font-bold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style="color: var(--color-tetradic-7);">Búsqueda de Empleo</h2>
            </div>    
        </div>

        <div class="pt-16 pb-8 px-8">

        <div class="mt-1">
            <h3 class="text-2xl font-bold text-gray-800 mb-6">Ajusta los filtros para encontrar tu Match perfecto.</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Puesto -->
                <div>
                    <label class="block text-sm font-semibold text-gray-600 mb-1">Puesto</label>
                    <input 
                        type="text" 
                        v-model="filtros.puesto"
                        placeholder="Ej. Frontend Developer"
                        class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cerceta-DEFAULT"
                    />
                </div>

                <!-- Ubicación: Estado → Ciudad -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-semibold text-gray-600 mb-1">
                            Estado
                        </label>

                        <select
                            v-model="filtros.estado"
                            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cerceta-DEFAULT"
                            @change="filtros.ciudad = ''"
                        >
                            <option value="">— Selecciona un estado —</option>
                            <option value="Remoto / Home office">
                                Remoto / Home office
                            </option>

                            <option
                                v-for="est in estadosMexico"
                                :key="est"
                                :value="est"
                            >
                                {{ est }}
                            </option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-gray-600 mb-1">
                            Ciudad
                        </label>

                        <select
                            v-model="filtros.ciudad"
                            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cerceta-DEFAULT"
                            :disabled="!filtros.estado || filtros.estado === 'Remoto / Home office'"
                        >
                            <option value="">— Selecciona una ciudad —</option>

                            <option
                                v-for="c in ciudadesPorEstado[filtros.estado] || []"
                                :key="c"
                                :value="c"
                            >
                                {{ c }}
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Modalidad -->
                <div>
                    <label class="block text-sm font-semibold text-gray-600 mb-1">Modalidad</label>
                    <select v-model="filtros.modalidad" class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cerceta-DEFAULT">
                        <option>Presencial</option>
                        <option>Remoto</option>
                        <option>Híbrido</option>
                    </select>
                </div>

                <!-- Salario -->
                <div>
                    <div class="flex items-baseline justify-between mb-1">
                        <label class="block text-sm font-semibold text-gray-600">Salario mínimo deseado</label>
                        <span class="text-xs text-gray-400 font-medium">$3,000 – $200,000</span>
                    </div>
                    <div class="flex items-center border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-cerceta-DEFAULT"
                         :class="errorSalario ? 'border-red-400 bg-red-50' : 'border-gray-300'">
                        <span class="pl-3 text-gray-500 font-medium select-none">$</span>
                        <input
                            type="text"
                            inputmode="numeric"
                            v-model="salarioFormateado"
                            placeholder="15,000"
                            class="w-full px-2 py-2 outline-none bg-transparent"
                            @input="formatearSalarioFiltro"
                            @blur="validarSalarioFiltro"
                        />
                    </div>
                    <p v-if="errorSalario" class="text-xs text-red-500 font-semibold mt-1 ml-1">{{ errorSalario }}</p>
                </div>
                <!-- Horario -->
                <div>
                    <label class="block text-sm font-semibold text-gray-600 mb-1">Horario</label>
                    <select v-model="filtros.horario" class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cerceta-DEFAULT">
                        <option>Tiempo completo</option>
                        <option>Medio tiempo</option>
                        <option>Contrato</option>
                        <option>Becario</option>
                    </select>
                </div>

                <!-- empresa -->
                <div>
                <label class="block text-sm font-semibold text-gray-600 mb-1">Tipo de empresa</label>
                <select v-model="filtros.tipo_empresa" class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cerceta-DEFAULT">
                    <option>Startup</option>
                    <option>Corporativo</option>
                    <option>Agencia</option>
                </select>
                </div>

                <!--  puesto -->
                <div>
                <label class="block text-sm font-semibold text-gray-600 mb-1">Nivel del puesto</label>
                <select v-model="filtros.nivel_puesto" class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cerceta-DEFAULT">
                    <option>Junior</option>
                    <option>Mid</option>
                    <option>Senior</option>
                </select>
                </div>

                <!-- ultura laboral -->
                <div>
                <label class="block text-sm font-semibold text-gray-600 mb-1">Cultura laboral</label>
                <select v-model="filtros.cultura_laboral" class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cerceta-DEFAULT">
                    <option>Relajada</option>
                    <option>Alta exigencia</option>
                    <option>Trabajo en equipo</option>
                    <option>Autónomo</option>
                </select>
                </div>

                <!-- Idioma -->
                <div>
                <label class="block text-sm font-semibold text-gray-600 mb-1">Idioma requerido</label>
                <select v-model="filtros.idioma" class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cerceta-DEFAULT">
                    <option>Español</option>
                    <option>Inglés</option>
                    <option>Ambos</option>
                </select>
                </div>

        
            </div>

        <!-- Boton de Preferencias-->
        <div class="mt-6">
            <label class="block text-sm font-semibold text-gray-600 mb-2">¿Qué es lo más importante para ti?</label>
            <div class="flex flex-wrap gap-2">
                <button
                    @click="filtros.prioridad='Salario'"
                    :class="filtros.prioridad === 'Salario'
                    ? 'bg-acento-morado text-white'
                    : 'bg-acento-morado/10 text-acento-morado'"
                    class="px-3 py-1 rounded-full text-sm transition"
                    >
                    Salario
                </button>

                <button
                    @click="filtros.prioridad='Crecimiento'"
                    :class="filtros.prioridad === 'Crecimiento'
                    ? 'bg-acento-morado text-white'
                    : 'bg-acento-morado/10 text-acento-morado'"
                    class="px-3 py-1 rounded-full text-sm transition"
                    >
                    Crecimiento
                 </button>

                <button
                    @click="filtros.prioridad='Cultura'" :class="filtros.prioridad === 'Cultura'
                    ? 'bg-acento-morado text-white'
                    : 'bg-acento-morado/10 text-acento-morado'"
                    class="px-3 py-1 rounded-full text-sm transition"
                    >
                    Cultura
                </button>

                <button
                    @click="filtros.prioridad='Flexibilidad'"
                    :class="filtros.prioridad === 'Flexibilidad'
                    ? 'bg-acento-morado text-white'
                    : 'bg-acento-morado/10 text-acento-morado'"
                    class="px-3 py-1 rounded-full text-sm transition"
                    >
                    Flexibilidad
                </button>
            </div>
        </div>

        <div class="mt-8 flex justify-end">
            <button 
                @click="guardarFiltros"
                class="px-6 py-3 bg-cerceta rounded-xl font-semibold hover:bg-cerceta-dark transition shadow-md" 
                style="color: var(--color-tetradic-7);"
                >
                Establecer Filtros
            </button>
        </div>
        </div>

        </div>
      </div>
    </div>

    <div 
        v-if="toast.show" 
        class="fixed bottom-10 right-10 bg-cerceta text-white px-6 py-3 rounded-xl shadow-lg whitespace-pre-line"
        >
        {{ toast.message }}
    </div>
</template>

<script setup>
    import { ref, onMounted } from "vue";
    import axios from "axios";
    import { useRouter } from "vue-router";
    import { ciudadesPorEstado, estadosMexico } from '@/data/mexico-ciudades.js'

    const router = useRouter();
    const URL_BASE_API = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const filtros = ref({
        id_candidato: localStorage.getItem("usuarioId"),
        puesto: "",
        estado: "",
        ciudad: "",
        modalidad: "",
        salario_minimo: "",
        horario: "",
        tipo_empresa: "",
        nivel_puesto: "",
        cultura_laboral: "",
        idioma: "",
        prioridad: ""
    });

    const toast = ref({
        show: false,
        message: ""
    });

    const showToast = (msg) => {
        toast.value.message = msg;
        toast.value.show = true;
        setTimeout(() => {
            toast.value.show = false;
        }, 2000);
    };

    // ── SALARIO FILTRO ────────────────────────────────────────────────────────
    const SALARIO_MIN = 3_000
    const SALARIO_MAX = 200_000
    const salarioFormateado = ref('')
    const errorSalario      = ref('')

    const formatearSalarioFiltro = () => {
        const n = salarioFormateado.value.replace(/[^0-9]/g, '')
        if (!n) { salarioFormateado.value = ''; filtros.value.salario_minimo = ''; return }
        const num = Math.min(parseInt(n, 10), SALARIO_MAX)
        salarioFormateado.value = num.toLocaleString('es-MX')
        filtros.value.salario_minimo = num
        if (errorSalario.value) validarSalarioFiltro()
    }

    const validarSalarioFiltro = () => {
        const raw = salarioFormateado.value.replace(/[^0-9]/g, '')
        if (!raw) { errorSalario.value = ''; return }
        const num = parseInt(raw, 10)
        if (num < SALARIO_MIN) {
            errorSalario.value = `El mínimo permitido es $${SALARIO_MIN.toLocaleString('es-MX')} MXN.`
        } else if (num > SALARIO_MAX) {
            errorSalario.value = `El máximo permitido es $${SALARIO_MAX.toLocaleString('es-MX')} MXN.`
        } else {
            errorSalario.value = ''
            filtros.value.salario_minimo = num
        }
    }

    onMounted(async () => {
        const idCandidato = localStorage.getItem("usuarioId");
        if (!idCandidato) {
            router.push("/login");
            return;
        }

        try {
            const respuesta = await axios.get(`${URL_BASE_API}/api/filtros/obtener/${idCandidato}`);
            
            if (respuesta.data && respuesta.data.ok && respuesta.data.filtros) {
                const configPrevia = respuesta.data.filtros;
                filtros.value.puesto = configPrevia.puesto || "";
                filtros.value.modalidad = configPrevia.modalidad || "";
                filtros.value.salario_minimo = configPrevia.salario_minimo || "";
                if (configPrevia.salario_minimo) {
                    salarioFormateado.value = Number(configPrevia.salario_minimo).toLocaleString('es-MX')
                }
                filtros.value.horario = configPrevia.horario || "";
                filtros.value.tipo_empresa = configPrevia.tipo_empresa || "";
                filtros.value.nivel_puesto = configPrevia.nivel_puesto || "";
                filtros.value.cultura_laboral = configPrevia.cultura_laboral || "";
                filtros.value.idioma = configPrevia.idioma || "";
                filtros.value.prioridad = configPrevia.prioridad || "";

                // Restaurar estado y ciudad desde ubicacion guardada
                if (configPrevia.ubicacion) {
                    if (configPrevia.ubicacion === 'Remoto / Home office') {
                        filtros.value.estado = 'Remoto / Home office'
                        filtros.value.ciudad = ''
                    } else {
                        const partes = configPrevia.ubicacion.split(', ')
                        if (partes.length >= 2) {
                            const ciudad = partes[0]
                            const estado = partes.slice(1).join(', ')
                            if (estadosMexico.includes(estado)) {
                                filtros.value.estado = estado
                                const ciudades = ciudadesPorEstado[estado] || []
                                if (ciudades.includes(ciudad)) {
                                    filtros.value.ciudad = ciudad
                                }
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error al obtener filtros previos:", error);
        }
    });

    const guardarFiltros = async () => {
        const ubicacionFinal = filtros.value.estado === 'Remoto / Home office'
            ? 'Remoto / Home office'
            : filtros.value.estado && filtros.value.ciudad
                ? `${filtros.value.ciudad}, ${filtros.value.estado}`
                : ''

        const payload = { ...filtros.value, ubicacion: ubicacionFinal }

        const valores = Object.entries(payload)
            .filter(([k]) => k !== 'estado' && k !== 'ciudad')
            .map(([, v]) => v)

        const hayVacios = valores.some(valor =>
            valor === null ||
            valor === undefined ||
            valor.toString().trim() === ""
        );

        if (hayVacios) {
            showToast("Completa todos los campos antes de continuar");
            return;
        }

        try {
            await axios.post(
                `${URL_BASE_API}/api/filtros/guardar`,
                payload
            );

            showToast("Filtros guardados.\nAhora ya podrás ver lo que encontramos para ti en Explorar ✨");
            localStorage.setItem("filtros_configurados", "si");

            setTimeout(() => {
                router.push("/candidato");
            }, 2500);

        } catch (error) {
            console.log(error.response?.data || error);
            showToast("Error al guardar filtros");
        }
    };
</script>