const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Pool } = require('pg');

let conexion;
let inicializacion;

function leerArchivoBase() {
  return fs.readFileSync(path.join(__dirname, 'reservas academicas.sql'), 'utf8');
}

function hashClave(clave) {
  return crypto.createHash('sha256').update(clave).digest('hex');
}

function configuracionPostgres() {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL
    };
  }

  return {
    host: process.env.PGHOST || 'localhost',
    port: Number(process.env.PGPORT || 5432),
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'Buenas123',
    database: process.env.PGDATABASE || 'reservas academicas'
  };
}

function configuracionMantenimiento() {
  const baseMantenimiento = process.env.PGMAINTENANCE_DB || 'postgres';

  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    url.pathname = `/${baseMantenimiento}`;
    return {
      connectionString: url.toString()
    };
  }

  return {
    ...configuracionPostgres(),
    database: baseMantenimiento
  };
}

function escaparIdentificador(valor) {
  return `"${String(valor).replace(/"/g, '""')}"`;
}

async function asegurarBaseDatos() {
  const configuracion = configuracionPostgres();
  const mantenimiento = new Pool(configuracionMantenimiento());

  try {
    const existe = await mantenimiento.query(
      'SELECT 1 FROM pg_database WHERE datname = $1 LIMIT 1',
      [configuracion.database]
    );

    if (!existe.rows[0]) {
      await mantenimiento.query(`CREATE DATABASE ${escaparIdentificador(configuracion.database)}`);
    }
  } finally {
    await mantenimiento.end();
  }
}

async function crearConexion() {
  if (conexion) {
    return conexion;
  }

  if (process.env.USAR_PG_MEM === '1') {
    const { newDb } = require('pg-mem');
    const baseMemoria = newDb({
      autoCreateForeignKeyIndices: true
    });
    const adaptador = baseMemoria.adapters.createPg();
    conexion = new adaptador.Pool();
    return conexion;
  }

  const configuracion = configuracionPostgres();
  conexion = new Pool(configuracion);

  try {
    await conexion.query('SELECT 1');
  } catch (error) {
    await conexion.end().catch(() => {});
    conexion = null;

    if (error.code === '3D000') {
      await asegurarBaseDatos();
      conexion = new Pool(configuracion);
      await conexion.query('SELECT 1');
      return conexion;
    }

    throw error;
  }

  return conexion;
}

async function ejecutarScript(pool) {
  await pool.query(leerArchivoBase());
}

async function obtenerConexion() {
  if (conexion && !inicializacion) {
    return conexion;
  }

  if (!inicializacion) {
    inicializacion = (async () => {
      const pool = await crearConexion();
      await ejecutarScript(pool);
      return pool;
    })().catch((error) => {
      conexion = null;
      inicializacion = null;
      throw error;
    });
  }

  return inicializacion;
}

async function cerrarConexion() {
  if (!conexion) {
    return;
  }

  await conexion.end();
  conexion = null;
  inicializacion = null;
}

async function registrarUsuario({ nombre, correo, clave, rol = 'docente' }) {
  const db = await obtenerConexion();
  const resultado = await db.query(
    `
      INSERT INTO usuarios (nombre, correo, clave, rol)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nombre, correo, rol, creado_en
    `,
    [nombre, correo, hashClave(clave), rol]
  );

  return resultado.rows[0];
}

async function autenticarUsuario({ correo, clave }) {
  const db = await obtenerConexion();
  const resultado = await db.query(
    `
      SELECT id, nombre, correo, rol, creado_en
      FROM usuarios
      WHERE correo = $1 AND clave = $2
      LIMIT 1
    `,
    [correo, hashClave(clave)]
  );

  return resultado.rows[0] || null;
}

async function obtenerEspacios() {
  const db = await obtenerConexion();
  const resultado = await db.query(`
    SELECT id, nombre, tipo, ubicacion, capacidad, activo
    FROM espacios
    WHERE activo = TRUE
    ORDER BY nombre
  `);

  return resultado.rows;
}

async function obtenerDisponibilidad({ fecha, horaInicio, horaFin, tipo }) {
  const db = await obtenerConexion();
  const valores = [fecha, horaFin, horaInicio];
  let filtroTipo = '';

  if (tipo) {
    valores.push(tipo);
    filtroTipo = 'AND e.tipo = $4';
  }

  const resultado = await db.query(
    `
      SELECT e.id, e.nombre, e.tipo, e.ubicacion, e.capacidad
      FROM espacios e
      LEFT JOIN reservas r
        ON r.espacio_id = e.id
       AND r.fecha = $1::date
       AND r.estado = 'confirmada'
       AND r.hora_inicio < $2::time
       AND r.hora_fin > $3::time
      WHERE e.activo = TRUE
        ${filtroTipo}
        AND r.id IS NULL
      ORDER BY e.capacidad ASC, e.nombre ASC
    `,
    valores
  );

  return resultado.rows;
}

async function crearReserva({ usuarioId, espacioId, fecha, horaInicio, horaFin, motivo }) {
  const db = await obtenerConexion();
  const cliente = await db.connect();

  try {
    await cliente.query('BEGIN');

    const usuario = await cliente.query(
      `
        SELECT id, nombre, correo
        FROM usuarios
        WHERE id = $1
        LIMIT 1
      `,
      [usuarioId]
    );

    if (!usuario.rows[0]) {
      const error = new Error('El usuario no existe');
      error.code = 'USUARIO_NO_EXISTE';
      throw error;
    }

    const espacio = await cliente.query(
      `
        SELECT id, nombre, tipo, ubicacion, capacidad
        FROM espacios
        WHERE id = $1 AND activo = TRUE
        LIMIT 1
      `,
      [espacioId]
    );

    if (!espacio.rows[0]) {
      const error = new Error('El espacio no existe o no esta disponible');
      error.code = 'ESPACIO_NO_EXISTE';
      throw error;
    }

    const cruce = await cliente.query(
      `
        SELECT id
        FROM reservas
        WHERE espacio_id = $1
          AND fecha = $2::date
          AND estado = 'confirmada'
          AND hora_inicio < $4::time
          AND hora_fin > $3::time
        LIMIT 1
      `,
      [espacioId, fecha, horaInicio, horaFin]
    );

    if (cruce.rows[0]) {
      const error = new Error('El espacio ya tiene una reserva en ese horario');
      error.code = 'RESERVA_DUPLICADA';
      throw error;
    }

    const insercion = await cliente.query(
      `
        INSERT INTO reservas (usuario_id, espacio_id, fecha, hora_inicio, hora_fin, motivo)
        VALUES ($1, $2, $3::date, $4::time, $5::time, $6)
        RETURNING id
      `,
      [usuarioId, espacioId, fecha, horaInicio, horaFin, motivo]
    );

    const reserva = await cliente.query(
      `
        SELECT
          r.id,
          r.fecha,
          r.hora_inicio,
          r.hora_fin,
          r.motivo,
          r.estado,
          u.nombre AS usuario,
          u.correo AS correo_usuario,
          e.nombre AS espacio,
          e.tipo,
          e.ubicacion
        FROM reservas r
        INNER JOIN usuarios u ON u.id = r.usuario_id
        INNER JOIN espacios e ON e.id = r.espacio_id
        WHERE r.id = $1
      `,
      [insercion.rows[0].id]
    );

    await cliente.query('COMMIT');
    return reserva.rows[0];
  } catch (error) {
    await cliente.query('ROLLBACK');
    throw error;
  } finally {
    cliente.release();
  }
}

async function obtenerReservas() {
  const db = await obtenerConexion();
  const resultado = await db.query(`
    SELECT
      r.id,
      r.fecha,
      r.hora_inicio,
      r.hora_fin,
      r.motivo,
      r.estado,
      u.nombre AS usuario,
      e.nombre AS espacio
    FROM reservas r
    INNER JOIN usuarios u ON u.id = r.usuario_id
    INNER JOIN espacios e ON e.id = r.espacio_id
    ORDER BY r.fecha ASC, r.hora_inicio ASC
  `);

  return resultado.rows;
}

module.exports = {
  obtenerConexion,
  cerrarConexion,
  registrarUsuario,
  autenticarUsuario,
  obtenerEspacios,
  obtenerDisponibilidad,
  crearReserva,
  obtenerReservas
};
