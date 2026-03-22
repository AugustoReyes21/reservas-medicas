CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  correo TEXT NOT NULL UNIQUE,
  clave TEXT NOT NULL,
  rol TEXT NOT NULL DEFAULT 'docente',
  creado_en TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS espacios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE,
  tipo TEXT NOT NULL,
  ubicacion TEXT NOT NULL,
  capacidad INTEGER NOT NULL CHECK (capacidad > 0),
  activo INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS reservas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  espacio_id INTEGER NOT NULL,
  fecha TEXT NOT NULL,
  hora_inicio TEXT NOT NULL,
  hora_fin TEXT NOT NULL,
  motivo TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'confirmada',
  creado_en TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (espacio_id) REFERENCES espacios(id)
);

CREATE INDEX IF NOT EXISTS indice_reservas_espacio_fecha
ON reservas (espacio_id, fecha, hora_inicio, hora_fin);
