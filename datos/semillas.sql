INSERT INTO usuarios (nombre, correo, clave, rol)
VALUES (
  'Coordinacion Academica',
  'coordinacion@universidad.edu',
  '5ac0852e770506dcd80f1a36d20ba7878bf82244b836d9324593bd14bc56dcb5',
  'administrador'
)
ON CONFLICT (correo) DO NOTHING;

INSERT INTO espacios (nombre, tipo, ubicacion, capacidad, activo)
VALUES
  ('Salon A101', 'salon', 'Edificio A', 35, TRUE),
  ('Laboratorio Redes', 'laboratorio', 'Edificio B', 25, TRUE),
  ('Auditorio Central', 'auditorio', 'Edificio C', 120, TRUE)
ON CONFLICT (nombre) DO NOTHING;
