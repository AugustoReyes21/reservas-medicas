const { spawn } = require('child_process');

const puerto = 3101;

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function esperarServidor(url) {
  for (let intento = 0; intento < 30; intento += 1) {
    try {
      const respuesta = await fetch(url);
      if (respuesta.ok) {
        return;
      }
    } catch (_error) {
      await esperar(300);
    }
  }

  throw new Error('El servidor no inicio a tiempo');
}

async function llamar(url, opciones = {}) {
  const respuesta = await fetch(url, opciones);
  const datos = await respuesta.json();
  return { respuesta, datos };
}

async function ejecutar() {
  const servidor = spawn(process.execPath, ['servidor.js'], {
    cwd: __dirname,
    env: {
      ...process.env,
      PORT: String(puerto),
      PGDATABASE: 'reservas academicas',
      USAR_PG_MEM: '1'
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  servidor.stdout.on('data', (data) => {
    process.stdout.write(data);
  });

  servidor.stderr.on('data', (data) => {
    process.stderr.write(data);
  });

  try {
    await esperarServidor(`http://127.0.0.1:${puerto}/api`);

    const loginDemo = await llamar(`http://127.0.0.1:${puerto}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        correo: 'coordinacion@universidad.edu',
        clave: 'clave123'
      })
    });

    const espacios = await llamar(`http://127.0.0.1:${puerto}/api/espacios`);
    const primerEspacio = espacios.datos.datos[0];

    const usuario = await llamar(`http://127.0.0.1:${puerto}/api/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Ana Lopez',
        correo: 'ana@universidad.edu',
        clave: 'clave123',
        rol: 'docente'
      })
    });

    const loginUsuario = await llamar(`http://127.0.0.1:${puerto}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        correo: 'ana@universidad.edu',
        clave: 'clave123'
      })
    });

    const disponibilidadInicial = await llamar(
      `http://127.0.0.1:${puerto}/api/disponibilidad?fecha=2026-03-25&horaInicio=08:00&horaFin=10:00`
    );

    const reserva = await llamar(`http://127.0.0.1:${puerto}/api/reservas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuarioId: usuario.datos.datos.id,
        espacioId: primerEspacio.id,
        fecha: '2026-03-25',
        horaInicio: '08:00',
        horaFin: '10:00',
        motivo: 'Clase de base de datos'
      })
    });

    const reservaDuplicada = await llamar(`http://127.0.0.1:${puerto}/api/reservas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuarioId: usuario.datos.datos.id,
        espacioId: primerEspacio.id,
        fecha: '2026-03-25',
        horaInicio: '09:00',
        horaFin: '11:00',
        motivo: 'Intento de cruce'
      })
    });

    const disponibilidadFinal = await llamar(
      `http://127.0.0.1:${puerto}/api/disponibilidad?fecha=2026-03-25&horaInicio=08:00&horaFin=10:00`
    );

    console.log('\nResumen de prueba');
    console.log(`Login demo: ${loginDemo.respuesta.status}`);
    console.log(`Usuario creado: ${usuario.respuesta.status}`);
    console.log(`Login usuario nuevo: ${loginUsuario.respuesta.status}`);
    console.log(`Disponibilidad inicial: ${disponibilidadInicial.datos.cantidad} espacios`);
    console.log(`Reserva creada: ${reserva.respuesta.status}`);
    console.log(`Reserva duplicada bloqueada: ${reservaDuplicada.respuesta.status}`);
    console.log(`Disponibilidad final: ${disponibilidadFinal.datos.cantidad} espacios`);

    if (
      loginDemo.respuesta.status !== 200 ||
      usuario.respuesta.status !== 201 ||
      loginUsuario.respuesta.status !== 200 ||
      reserva.respuesta.status !== 201 ||
      reservaDuplicada.respuesta.status !== 409 ||
      disponibilidadInicial.datos.cantidad !== 3 ||
      disponibilidadFinal.datos.cantidad !== 2
    ) {
      throw new Error('Una o mas validaciones no produjeron el resultado esperado');
    }

    console.log('Prueba completada correctamente');
  } finally {
    servidor.kill('SIGTERM');
  }
}

ejecutar().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
