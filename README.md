MATCH-YA

Web platform for job recruitment that connects candidates and recruiters through a matching-based job discovery system.

Features

+ Candidate and recruiter profiles
+ Job vacancy management
+ Personalized job matching
+ Swipe-based interactions
+ Candidate filtering
+ Applications and interviews


DEMO

+ Video DEMO:
  https://youtu.be/4Gr6XD48Lwk

<img width="690" height="788" alt="WhatsApp Image 2026-08-10 at 16 26 51" src="https://github.com/user-attachments/assets/aa87e63a-8d18-4ce8-92bd-f092c21e272f" />

<img width="557" height="747" alt="WhatsApp Image 2026-08-10 at 16 26 03 (1)" src="https://github.com/user-attachments/assets/b5d80043-4e16-4644-948b-83c9abb44202" />
<img width="584" height="858" alt="WhatsApp Image 2026-08-10 at 16 26 03" src="https://github.com/user-attachments/assets/7441f168-420d-4bb6-b16b-5e4fdd1d129a" />
<img width="763" height="880" alt="WhatsApp Image 2026-08-10 at 16 26 04" src="https://github.com/user-attachments/assets/70088b3a-0246-42db-bb13-d883b5b55a0c" />






----------------------------------------


Instrucciones para Empezar:

---

## 1. Requisitos Previos (Instalación en Windows)

Antes de descargar el código, cada integrante del equipo debe asegurarse de tener instaladas las siguientes herramientas en su computadora:

1. **Node.js (Versión LTS):** Es el motor indispensable para correr el proyecto.
   * Descárgalo de: [nodejs.org](https://nodejs.org/es/)
   * *Nota para Windows:* Durante la instalación, deja marcadas todas las opciones por defecto (siguiente, siguiente, instalar).
2. **Git:** Para poder clonar el repositorio y subir sus cambios.
   * Descarga la Extensión del VS Code
3. **Visual Studio Code (VS Code):** Nuestro editor de código principal.
4. **Axios:** Instalar Axios en el Frontend con: npm install axios
5. **Multer** Instalar Multer en el Backend con: npm install multer

---

## 2. Extensiones Obligatorias para VS Code

Para que el código se formatee igual para todos y no tengamos conflictos al juntar nuestras partes, abran VS Code, vayan a la pestaña de Extensiones (`Ctrl + Shift + X`) e instalen estas 4:

* **Vue - Official (antiguo Volar):** Fundamental para que VS Code entienda los archivos `.vue` y marque los errores correctamente.
* **Tailwind CSS IntelliSense:** Te autocompleta las clases de diseño y te muestra los colores exactos de nuestra paleta.
* **Prettier - Code formatter:** Para que el código se acomode automáticamente al guardar.
* **ESLint:** Subraya errores de lógica en JavaScript antes de correr el programa.

---

## 3. ¿Cómo empezar a usar el código? (Primeros pasos)

Una vez que tengan todo instalado, sigan estos pasos exactos en la terminal de VS Code:

### Paso 1: Clonar el repositorio
Abre una terminal en VS Code y descarga el proyecto a tu computadora:
```bash
git clone <AQUÍ-PONDREMOS-EL-LINK-DEL-REPOSITORIO

### Paso 2: Entrar a la carpeta correcta
MUY IMPORTANTE: Todo el código actual vive dentro de la carpeta frontend. Debes entrar a ella antes de ejecutar cualquier otro comando:
cd frontend

### Paso 3: Instalar las dependencias (Librerías)
Como la carpeta node_modules no se sube a GitHub porque es muy pesada, debes descargar las librerías localmente: npm install

### Paso 4: Encender el servidor
Una vez que termine la instalación, levanta el proyecto para verlo en tu navegador: npm run dev

TODO DENTRO DE LA CARPETA FRONTEND POR FAVOR (si no no va a servir :D)

Este proyecto usa hasta la fecha:
Node.JS
Vue.JS
Vite
TailWind CSS

Organización del Proyecto:

Match-Ya/
│
├── 📁 frontend/                   <-- CAPA DE PRESENTACIÓN (Vue.js + Vite)
│   ├── 📁 node_modules/           <-- (Se genera solo) Librerías descargadas por npm.
│   ├── 📁 public/                 <-- Archivos públicos que no cambian.
│   │   ├── 🖼️ logo.png            <-- Tu logotipo principal.
│   │   └── 🖼️ favicon.ico         <-- El iconito de la pestaña del navegador.
│   ├── 📁 src/                    <-- CÓDIGO FUENTE DE LA INTERFAZ
│   │   ├── 📁 assets/             <-- Recursos estáticos internos.
│   │   │   ├── 📄 base.css        <-- Estilos globales de Vue.
│   │   │   └── 📄 main.css        <-- Aquí integrarás Tailwind CSS y tu paleta.
│   │   ├── 📁 components/         <-- Piezas pequeñas y reusables de diseño.
│   │   │   ├── 📄 MatchCard.vue   <-- La tarjeta individual de la vacante/candidato.
│   │   │   └── 📄 NavBar.vue      <-- La barra de navegación superior.
│   │   ├── 📁 router/             <-- Configuración de navegación.
│   │   │   └── 📄 index.js        <-- Conecta las URLs (/swipe, /estatus) con las Vistas.
│   │   ├── 📁 views/              <-- Pantallas completas (Pestañas).
│   │   │   ├── 📄 HomeView.vue    <-- Pantalla de inicio/login.
│   │   │   ├── 📄 SwipeView.vue   <-- Pantalla del algoritmo de matching.
│   │   │   └── 📄 EstatusView.vue <-- Pantalla de seguimiento de postulaciones.
│   │   ├── 📄 App.vue             <-- El cascarón principal de la aplicación.
│   │   └── 📄 main.js             <-- Archivo que arranca Vue e inyecta la app.
│   ├── 📄 .eslintrc.cjs           <-- Reglas del linter para evitar errores de código.
│   ├── 📄 .prettierrc.json        <-- Reglas para que el código se auto-formatee.
│   ├── 📄 index.html              <-- El HTML principal que carga Vite.
│   ├── 📄 package.json            <-- Lista de dependencias del frontend.
│   └── 📄 vite.config.js          <-- Configuración del servidor local.
│
├── 📁 backend/                    <-- CAPA LÓGICA Y DE SEGURIDAD (Node.js + Express)
│   ├── 📁 src/                    <-- CÓDIGO FUENTE DEL SERVIDOR
│   │   ├── 📁 config/             <-- Conexiones a servicios externos.
│   │   │   └── 📄 db.js           <-- Conexión a tu base de datos PostgreSQL.
│   │   ├── 📁 controllers/        <-- La lógica fuerte del sistema.
│   │   │   ├── 📄 auth.js         <-- Lógica para iniciar sesión y registrar.
│   │   │   └── 📄 match.js        <-- Lógica del algoritmo de compatibilidad.
│   │   ├── 📁 middlewares/        <-- Filtros de seguridad.
│   │   │   └── 📄 verifyToken.js  <-- Valida que el usuario tenga acceso permitido.
│   │   ├── 📁 routes/             <-- Las URLs de tu API (Endpoints).
│   │   │   ├── 📄 authRoutes.js   
│   │   │   └── 📄 matchRoutes.js  
│   │   └── 📄 index.js            <-- Archivo principal que enciende el servidor Node.
│   ├── 📄 .env                    <-- Variables ocultas (Contraseña de BD, Secretos JWT).
│   └── 📄 package.json            <-- Lista de dependencias del backend.
│
├── 📁 database/                   <-- CAPA DE DATOS (PostgreSQL)
│   ├── 📄 schema.sql              <-- Script para crear las tablas (Usuarios, Vacantes).
│   └── 📄 triggers.sql            <-- Scripts para automatizar movimientos de listas.
│
├── 📁 docs/                       <-- DOCUMENTACIÓN DEL PROYECTO
│   ├── 📄 Actividad 1 - Conformación del Equipo.docx
│   ├── 📄 Actividad 8 - Planificacion de Proyectos.docx
│   └── 📄 Actividad 10 - Diseño Arquitectonico.docx
│
└── 📄 .gitignore                  <-- Le dice a Git qué carpetas NO subir (ej. node_modules, .env).
│   └── 📄 schema.sql            <-- Tus scripts para crear las tablas en PostgreSQL
