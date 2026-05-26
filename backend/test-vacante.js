const pool = require('./src/config/db');

async function simularPublicarVacante() {
  // 1. Simulamos el JSON que enviará PublicarVacanteView.vue al hacer submit
  const datosDelFrontend = {
    titulo: 'Senior Frontend',
    modalidad: 'Híbrido',
    ubicacion: 'Guadalajara',
    descripcion: 'Buscamos experto en Vue.js y Tailwind CSS para unirse a Code Divas.',
    sueldo: 45000.00, 
    tags: ['Vue', 'Tailwind', 'Node.js']
  };

  const idReclutador = '9287608c-bb46-42e0-b514-ceaf44cec938'; 

  const client = await pool.connect(); // Usamos un cliente específico para transacciones

  try {
    console.log('Iniciando transacción segura en Supabase...');
    await client.query('BEGIN'); // Bloqueamos la BD para evitar datos incompletos

    // PASO A: Crear al reclutador si no existe (Solo para la prueba)
    await client.query(`
      INSERT INTO reclutadores (id, nombre_empresa) 
      VALUES ($1, $2) ON CONFLICT (id) DO NOTHING
    `, [idReclutador, 'Tech Solutions GDL']);

    // PASO B: Insertar la Vacante
    const resVacante = await client.query(`
      INSERT INTO vacantes (id_reclutador, titulo, descripcion, sueldo, estatus)
      VALUES ($1, $2, $3, $4, 'Activa') 
      RETURNING id_vacante
    `, [idReclutador, datosDelFrontend.titulo, datosDelFrontend.descripcion, datosDelFrontend.sueldo]);
    
    const nuevaVacanteId = resVacante.rows[0].id_vacante;
    console.log(` Vacante creada con ID: ${nuevaVacanteId}`);

    // PASO C: Procesar las Etiquetas (Tags)
    for (const tag of datosDelFrontend.tags) {
      // 1. Insertamos la etiqueta (si ya existe, Postgres la ignora)
      const resTag = await client.query(`
        INSERT INTO etiquetas (nombre) VALUES ($1) 
        ON CONFLICT (nombre) DO UPDATE SET nombre = EXCLUDED.nombre
        RETURNING id_etiqueta
      `, [tag.toUpperCase()]);
      
      const idTag = resTag.rows[0].id_etiqueta;

      // 2. Conectamos la etiqueta con la vacante en la tabla intermedia
      await client.query(`
        INSERT INTO vacante_etiquetas (id_vacante, id_etiqueta) 
        VALUES ($1, $2)
      `, [nuevaVacanteId, idTag]);
    }

    await client.query('COMMIT'); // Confirmamos y guardamos todo permanentemente
    console.log(' Simulación exitosa: Las etiquetas y la vacante están enlazadas.');

  } catch (error) {
    await client.query('ROLLBACK'); // Si algo falla, deshacemos todo por seguridad
    console.error(' Error crítico, revirtiendo cambios:', error.message);
  } finally {
    client.release(); // Liberamos la conexión
    pool.end();
  }
}

simularPublicarVacante();