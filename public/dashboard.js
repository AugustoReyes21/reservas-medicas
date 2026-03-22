async function leerJson(url) {
  const respuesta = await fetch(url);
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.mensaje || 'No fue posible cargar la informacion');
  }

  return datos;
}

function fechaHoy() {
  return new Date().toISOString().slice(0, 10);
}

function pintarReservas(reservas) {
  const tabla = document.getElementById('tablaReservas');
  const nota = document.getElementById('notaReservas');

  if (!tabla || !nota) {
    return;
  }

  if (!reservas.length) {
    tabla.innerHTML = `
      <tr>
        <td colspan="4">Aun no hay reservas registradas.</td>
      </tr>
    `;
    nota.textContent = 'Cuando se cree una reserva aparecera aqui automaticamente.';
    return;
  }

  tabla.innerHTML = reservas
    .slice(0, 6)
    .map((reserva) => `
      <tr>
        <td>${reserva.espacio}</td>
        <td>${reserva.usuario}</td>
        <td>${reserva.fecha} ${reserva.hora_inicio} - ${reserva.hora_fin}</td>
        <td>${reserva.estado}</td>
      </tr>
    `)
    .join('');

  nota.textContent = `Mostrando ${Math.min(reservas.length, 6)} de ${reservas.length} reservas almacenadas.`;
}

async function actualizarDisponibilidad() {
  const fecha = document.getElementById('fechaConsulta').value;
  const horaInicio = document.getElementById('horaInicioConsulta').value;
  const horaFin = document.getElementById('horaFinConsulta').value;
  const estado = document.getElementById('estadoConsulta');
  const conteo = document.getElementById('conteoDisponibles');

  if (!fecha || !horaInicio || !horaFin) {
    estado.textContent = 'Completa fecha y horario para calcular la disponibilidad.';
    conteo.textContent = '0';
    return;
  }

  if (horaInicio >= horaFin) {
    estado.textContent = 'La hora inicial debe ser menor que la hora final.';
    conteo.textContent = '0';
    return;
  }

  try {
    const datos = await leerJson(
      `/api/disponibilidad?fecha=${encodeURIComponent(fecha)}&horaInicio=${encodeURIComponent(horaInicio)}&horaFin=${encodeURIComponent(horaFin)}`
    );

    conteo.textContent = String(datos.cantidad);
    estado.textContent = `Hay ${datos.cantidad} espacios disponibles para ${fecha} entre ${horaInicio} y ${horaFin}.`;
  } catch (error) {
    conteo.textContent = '0';
    estado.textContent = error.message;
  }
}

async function cargarDashboard() {
  const fecha = document.getElementById('fechaConsulta');
  const horaInicio = document.getElementById('horaInicioConsulta');
  const horaFin = document.getElementById('horaFinConsulta');

  fecha.value = fechaHoy();
  horaInicio.value = '08:00';
  horaFin.value = '10:00';

  [fecha, horaInicio, horaFin].forEach((control) => {
    control.addEventListener('change', actualizarDisponibilidad);
  });

  try {
    const [espacios, reservas] = await Promise.all([
      leerJson('/api/espacios'),
      leerJson('/api/reservas')
    ]);

    document.getElementById('conteoEspacios').textContent = String(espacios.datos.length);
    document.getElementById('conteoReservas').textContent = String(reservas.datos.length);
    pintarReservas(reservas.datos);
  } catch (error) {
    document.getElementById('notaReservas').textContent = error.message;
  }

  await actualizarDisponibilidad();
}

document.addEventListener('DOMContentLoaded', () => {
  if (!window.autenticacionReservas || !window.autenticacionReservas.obtenerSesion()) {
    return;
  }

  cargarDashboard();
});
