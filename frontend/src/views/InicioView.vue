<template>
  <div class="flex flex-col items-center w-full pb-16">
    
    <!-- HERO SECTION -->
    <section class="w-full text-center px-6 pt-20 pb-16 bg-gradient-to-b from-transparent to-matcha/5">
      <img src="/logo.png" alt="Match-Ya Logo" class="w-36 h-36 mx-auto mb-8 drop-shadow-xl transition-transform duration-500 hover:scale-105" />
      <h1 class="text-5xl md:text-7xl font-extrabold text-cerceta tracking-tight mb-6">
        Match-Ya
      </h1>
      <p class="text-xl md:text-2xl text-cerceta-light max-w-3xl mx-auto font-medium leading-relaxed mb-10">
        Revolucionando el reclutamiento. Adiós a los procesos lentos, hola a las conexiones instantáneas. Desliza, haz match y transforma tu futuro.
      </p>
      
      <div class="flex flex-col sm:flex-row gap-5 w-full max-w-md mx-auto justify-center">
        <!-- Botón Iniciar Sesión (Secundario) -->
        <router-link to="/login" class="w-full sm:w-auto px-8 py-3.5 rounded-xl border-2 border-matcha text-matcha font-bold text-lg hover:bg-matcha hover:text-white transition-all hover:-translate-y-1 shadow-lg shadow-matcha/10 flex items-center justify-center">
          Iniciar Sesión
        </router-link>
        
        <!-- Botón Registrarse (Primario) -->
        <router-link to="/registro" class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-matcha text-white font-bold text-lg shadow-lg shadow-matcha/30 hover:bg-matcha-dark transition-all hover:-translate-y-1 flex items-center justify-center">
          Comenzar Ahora
        </router-link>
      </div>
    </section>

    <!-- SECCIÓN: ¿CÓMO FUNCIONA? -->
    <section class="w-full max-w-6xl mx-auto px-6 py-16">
      <h2 class="text-3xl md:text-4xl font-extrabold text-center text-cerceta mb-12">La nueva forma de encontrar talento</h2>
      
      <div class="grid md:grid-cols-3 gap-8">
        
        <!-- Tarjeta 1 -->
        <div class="bg-white p-8 rounded-3xl shadow-suave border border-matcha/10 hover:shadow-lg transition-all hover:-translate-y-1 text-center">
          <div class="w-16 h-16 mx-auto bg-fondo rounded-full flex items-center justify-center mb-6">
            <svg class="w-8 h-8 text-matcha" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </div>
          <h3 class="text-xl font-bold text-cerceta mb-3">1. Crea tu Perfil</h3>
          <p class="text-cerceta-light text-sm leading-relaxed">Configura tus habilidades técnicas o publica tus vacantes. El algoritmo se encarga del resto.</p>
        </div>

        <!-- Tarjeta 2 -->
        <div class="bg-white p-8 rounded-3xl shadow-suave border border-matcha/10 hover:shadow-lg transition-all hover:-translate-y-1 text-center">
          <div class="w-16 h-16 mx-auto bg-fondo rounded-full flex items-center justify-center mb-6">
            <svg class="w-8 h-8 text-matcha" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
          </div>
          <h3 class="text-xl font-bold text-cerceta mb-3">2. Desliza y Decide</h3>
          <p class="text-cerceta-light text-sm leading-relaxed">Nuestra interfaz te permite evaluar perfiles u ofertas rápidamente mediante deslizamientos ágiles.</p>
        </div>

        <!-- Tarjeta 3 -->
        <div class="bg-white p-8 rounded-3xl shadow-suave border border-matcha/10 hover:shadow-lg transition-all hover:-translate-y-1 text-center">
          <div class="w-16 h-16 mx-auto bg-fondo rounded-full flex items-center justify-center mb-6">
            <svg class="w-8 h-8 text-matcha" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <h3 class="text-xl font-bold text-cerceta mb-3">3. ¡Haz Match!</h3>
          <p class="text-cerceta-light text-sm leading-relaxed">Cuando el interés es mutuo, se habilita el contacto directo para que inicien su proceso de inmediato.</p>
        </div>
      </div>
    </section>

    <!-- SECCIÓN DIVIDIDA: BENEFICIOS POR ROL -->
    <section class="w-full max-w-5xl mx-auto px-6 py-12">
        <div class="bg-cerceta rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row">
            
            <!-- Beneficios Candidatos -->
            <div class="p-12 md:w-1/2 flex flex-col justify-center text-white border-b md:border-b-0 md:border-r border-white/10">
                <h3 class="text-3xl font-extrabold mb-6">Para Candidatos</h3>
                <ul class="space-y-4 text-base text-gray-200">
                    <li class="flex items-center gap-3">
                        <span class="bg-white/20 p-1.5 rounded-full text-white"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg></span> 
                        Encuentra ofertas afines a tus habilidades.
                    </li>
                    <li class="flex items-center gap-3">
                        <span class="bg-white/20 p-1.5 rounded-full text-white"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg></span> 
                        Conoce el estatus real de tus postulaciones.
                    </li>
                    <li class="flex items-center gap-3">
                        <span class="bg-white/20 p-1.5 rounded-full text-white"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg></span> 
                        Destaca en el mercado laboral fácilmente.
                    </li>
                </ul>
            </div>

            <!-- Beneficios Reclutadores -->
            <div class="p-12 md:w-1/2 flex flex-col justify-center bg-white">
                <h3 class="text-3xl font-extrabold text-cerceta mb-6">Para Reclutadores</h3>
                <ul class="space-y-4 text-base text-cerceta-light">
                    <li class="flex items-center gap-3">
                        <span class="bg-matcha/20 p-1.5 rounded-full text-matcha"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg></span> 
                        Filtra prospectos y acepta con un swipe.
                    </li>
                    <li class="flex items-center gap-3">
                        <span class="bg-matcha/20 p-1.5 rounded-full text-matcha"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg></span> 
                        Gestiona tus vacantes de forma centralizada.
                    </li>
                    <li class="flex items-center gap-3">
                        <span class="bg-matcha/20 p-1.5 rounded-full text-matcha"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg></span> 
                        Reduce drásticamente tus tiempos de contratación.
                    </li>
                </ul>
            </div>
            
        </div>
    </section>

  </div>
</template>