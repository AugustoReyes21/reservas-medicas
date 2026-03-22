const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Database = require('better-sqlite3');

let conexion;

function rutaBaseDatos() {
  if (process.env.DATABASE_FILE) {
    return path.resolve(process.cwd(), process.env.DATABASE_FILE);
  }

  return path.join(__dirname, 'datos', 'reservas.db');
}

function leerArchivo(nombre) {
  return fs.readFileSync(path.join(__dirname, 'datos', nombre), 'utf8');
}

function hashClave(clave) {
  return crypto.createHash('sha256').update(clave).digest('hex');
}

function obtenerConexion() {
  if (conexion) {
    return conexion;
  }

  const ruta = rutaBaseDatos();
  fs.mkdirSync(path.dirname(ruta), { recursive: true });

  conexion = new Database(ruta);
  conexion.pragma('foreign_keys = ON');
  conexion.exec(leerArchivo('esquema.sql'));
  conexion.exec(leerArchivo('semillas.sql'));

  return conexion;
}

function registrarUsuario({ nombre, correo, clave, rol = 'docente' }) {
  const db = obtenerConexion();
  const sentencia = db.prepare(`
    INSERT INTO usuarios (nombre, correo, clave, rol)
    VALUES (@nombre, @correo, @clave, @rol)
  `);

  const resultado = sentencia.run({
    nombre,
    correo,
    clave: hashClave(clave),
    rol
  });

  return db.prepare(`
    SELECT id, nombre, correo, rol, creado_en
    FROM usuarios
    WHERE id = ?
  `).get(resultado.lastInsertRowid);
}

function autenticarUsuario({ correo, clave }) {
  const db = obtenerConexion();
  return db.prepare(`
    SELECT id, nombre, correo, rol, creado_en
    FROM usuarios
    WHERE correo = ? AND clave = ?
  `).get(correo, hashClave(clave));
}

function obtenerEspacios() {
  return obtenerConexion().prepare(`
    SELECT id, nombre, tipo, ubicacion, capacidad, activo
    FROM espacios
    WHERE activo = 1
    ORDER BY nombre
  `).all();
}

function obtenerDisponibilidad({ fecha, horaInicio, horaFin, tipo }) {
  const db = obtenerConexion();
  const condiciones = [
    'e.activo = 1',
    `NOT EXISTS (
      SELECT 1
      FROM reservas r
      WHERE r.espacio_id = e.id
        AND r.fecha = @fecha
        AND r.estado = 'confirmada'
        AND r.hora_inicio < @horaFin
        AND r.hora_fin > @horaInicio
    )`
  ];

  if (tipo) {
    condiciones.push('e.tipo = @tipo');
  }

  const consulta = `
    SELECT e.id, e.nombre, e.tipo, e.ubicacion, e.capacidad
    FROM espacios e
    WHERE ${condiciones.join(' AND ')}
    ORDER BY e.capacidad ASC, e.nombre ASC
  `;

  return db.prepare(consulta).all({
    fecha,
    horaInicio,
    horaFin,
    tipo
  });
}

function crearReserva({ usuarioId, espacioId, fecha, horaInicio, horaFin, motivo }) {
  const db = obtenerConexion();
  const transaccion = db.transaction((datos) => {
    const usuario = db.prepare(`
      SELECT id, nombre, correo
      FROM usuarios
      WHERE id = ?
    `).get(datos.usuarioId);

    if (!usuario) {
      const error = new Error('El usuario no existe');
      error.code = 'USUARIO_NO_EXISTE';
      throw error;
    }

    const espacio = db.prepare(`
      SELECT id, nombre, tipo, ubicacion, capacidad
      FROM espacios
      WHERE id = ? AND activo = 1
    `).get(datos.espacioId);

    if (!espacio) {
      const error = new Error('El espacio no existe o no esta disponible');
      error.code = 'ESPACIO_NO_EXISTE';
      throw error;
    }

    const cruce = db.prepare(`
      SELECT id
      FROM reservas
      WHERE espacio_id = @espacioId
        AND fecha = @fecha
        AND estado = 'confirmada'
        AND hora_inicio < @horaFin
        AND hora_fin > @horaInicio
      LIMIT 1
    `).get(datos);

    if (cruce) {
      const error = new Error('El espacio ya tiene una reserva en ese horario');
      error.code = 'RESERVA_DUPLICADA';
      throw error;
    }

    const insercion = db.prepare(`
      INSERT INTO reservas (usuario_id, espacio_id, fecha, hora_inicio, hora_fin, motivo)
      VALUES (@usuarioId, @espacioId, @fecha, @horaInicio, @horaFin, @motivo)
    `).run(datos);

    return db.prepare(`
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
      WHERE r.id = ?
    `).get(insercion.lastInsertRowid);
  });

  return transaccion({
    usuarioId,
    espacioId,
    fecha,
    horaInicio,
    horaFin,
    motivo
  });
}

function obtenerReservas() {
  const db = obtenerConexion();
  return db.prepare(`
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
  `).all();
}

module.exports = {
  obtenerConexion,
  registrarUsuario,
  autenticarUsuario,
  obtenerEspacios,
  obtenerDisponibilidad,
  crearReserva,
  obtenerReservas
};
