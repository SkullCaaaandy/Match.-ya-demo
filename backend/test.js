const pool = require('./src/config/db'); // Ajusta la ruta si tu db.js está en otra carpeta

async function probarConexion() {
  try {
    // Intentamos hacer una consulta básica a PostgreSQL
    const res = await pool.query('SELECT NOW() AS hora_actual');
    console.log(' ¡Conexión exitosa a Match-Ya!');
    console.log('La hora en el servidor de Supabase es:', res.rows[0].hora_actual);
  } catch (error) {
    console.error(' Error al conectar con la base de datos:', error.message);
  } finally {
    // Cerramos la conexión para que el programa termine
    pool.end();
  }
}

probarConexion();