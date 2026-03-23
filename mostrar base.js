const { obtenerConexion, cerrarConexion } = require('./basedatos');

async function consultar(titulo, sql) {
  const db = await obtenerConexion();
  const resultado = await db.query(sql);

  console.log(`\n${titulo}`);
  console.log('-'.repeat(titulo.length));
  console.table(resultado.rows);
}

async function ejecutar() {
  try {
    await consultar(
      'Tabla usuarios',
      `
        SELECT id, nombre, correo, rol, creado_en
        FROM usuarios
        ORDER BY id
      `
    );

    await consultar(
      'Tabla espacios',
      `
        SELECT id, nombre, tipo, ubicacion, capacidad, activo
        FROM espacios
        ORDER BY id
      `
    );

    await consultar(
      'Tabla reservas',
      `
        SELECT id, usuario_id, espacio_id, fecha, hora_inicio, hora_fin, motivo, estado, creado_en
        FROM reservas
        ORDER BY id
      `
    );

    console.log('\nRelaciones principales');
    console.log('reservas.usuario_id -> usuarios.id');
    console.log('reservas.espacio_id -> espacios.id');
  } catch (error) {
    console.error('No fue posible mostrar la base de datos');
    console.error(error.message);
  } finally {
    await cerrarConexion().catch(() => {});
  }
}

ejecutar();
