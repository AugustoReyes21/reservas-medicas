INSERT OR IGNORE INTO usuarios (id, nombre, correo, clave, rol) VALUES
  (
    1,
    'Coordinacion Academica',
    'coordinacion@universidad.edu',
    '5ac0852e770506dcd80f1a36d20ba7878bf82244b836d9324593bd14bc56dcb5',
    'administrador'
  );

INSERT OR IGNORE INTO espacios (id, nombre, tipo, ubicacion, capacidad, activo) VALUES
  (1, 'Salon A101', 'salon', 'Edificio A', 35, 1),
  (2, 'Laboratorio Redes', 'laboratorio', 'Edificio B', 25, 1),
  (3, 'Auditorio Central', 'auditorio', 'Edificio C', 120, 1);
