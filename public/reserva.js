let espacios = [];

async function leerJson(url, opciones) {
  const respuesta = await fetch(url, opciones);
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.mensaje || 'No fue posible completar la solicitud');
  }

  return datos;
}

function fechaHoy() {
  return new Date().toISOString().slice(0, 10);
}

function mostrarMensajeReserva(texto, tipo) {
  const mensaje = document.getElementById('mensajeReserva');
  mensaje.textContent = texto;
  mensaje.className = `mensaje activo ${tipo}`;
}

function espacioActual() {
  const selector = document.getElementById('espacioId');
  return espacios.find((espacio) => String(espacio.id) === selector.value) || null;
}

function actualizarFichaEspacio() {
  const espacio = espacioActual();

  if (!espacio) {
    return;
  }

  document.getElementById('capacidadEspacio').textContent = `${espacio.capacidad} personas`;
  document.getElementById('ubicacionEspacio').textContent = espacio.ubicacion;
  document.getElementById('tipoEspacio').textContent = espacio.tipo;
}

async function revisarDisponibilidad() {
  const espacio = espacioActual();
  const fecha = document.getElementById('fechaReserva').value;
  const horaInicio = document.getElementById('horaInicioReserva').value;
  const horaFin = document.getElementById('horaFinReserva').value;
  const estado = document.getElementById('estadoEspacio');
  const detalle = document.getElementById('detalleDisponibilidad');

  actualizarFichaEspacio();

  if (!espacio || !fecha || !horaInicio || !horaFin) {
    estado.textContent = 'Sin revisar';
    detalle.textContent = 'Completa todos los datos para validar el horario.';
    return;
  }

  if (horaInicio >= horaFin) {
    estado.textContent = 'Horario invalido';
    detalle.textContent = 'La hora final debe ser mayor que la hora inicial.';
    return;
  }

  try {
    const datos = await leerJson(
      `/api/disponibilidad?fecha=${encodeURIComponent(fecha)}&horaInicio=${encodeURIComponent(horaInicio)}&horaFin=${encodeURIComponent(horaFin)}`
    );

    const disponible = datos.datos.some((item) => item.id === espacio.id);

    estado.textContent = disponible ? 'Libre' : 'Ocupado';
    detalle.textContent = disponible
      ? `El espacio esta libre para ${fecha} de ${horaInicio} a ${horaFin}.`
      : `El espacio ya tiene una reserva cruzada para ${fecha} en ese horario.`;
  } catch (error) {
    estado.textContent = 'Error';
    detalle.textContent = error.message;
  }
}

async function cargarEspacios() {
  const selector = document.getElementById('espacioId');
  const datos = await leerJson('/api/espacios');
  espacios = datos.datos;

  selector.innerHTML = espacios
    .map((espacio) => `<option value="${espacio.id}">${espacio.nombre}</option>`)
    .join('');

  actualizarFichaEspacio();
  await revisarDisponibilidad();
}

async function guardarReserva(evento) {
  evento.preventDefault();

  const sesion = window.autenticacionReservas.obtenerSesion();
  const espacioId = document.getElementById('espacioId').value;
  const fecha = document.getElementById('fechaReserva').value;
  const horaInicio = document.getElementById('horaInicioReserva').value;
  const horaFin = document.getElementById('horaFinReserva').value;
  const motivo = document.getElementById('motivoReserva').value.trim();

  if (!espacioId || !fecha || !horaInicio || !horaFin || !motivo) {
    mostrarMensajeReserva('Completa todos los campos antes de guardar.', 'error');
    return;
  }

  if (horaInicio >= horaFin) {
    mostrarMensajeReserva('La hora final debe ser mayor que la hora inicial.', 'error');
    return;
  }

  try {
    const datos = await leerJson('/api/reservas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        usuarioId: sesion.id,
        espacioId: Number(espacioId),
        fecha,
        horaInicio,
        horaFin,
        motivo
      })
    });

    mostrarMensajeReserva(`Reserva creada correctamente para ${datos.datos.espacio}.`, 'exito');
    document.getElementById('motivoReserva').value = '';
    await revisarDisponibilidad();
  } catch (error) {
    mostrarMensajeReserva(error.message, 'error');
    await revisarDisponibilidad();
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  if (!window.autenticacionReservas || !window.autenticacionReservas.obtenerSesion()) {
    return;
  }

  document.getElementById('fechaReserva').value = fechaHoy();

  try {
    await cargarEspacios();
  } catch (error) {
    mostrarMensajeReserva(error.message, 'error');
  }

  ['espacioId', 'fechaReserva', 'horaInicioReserva', 'horaFinReserva'].forEach((id) => {
    document.getElementById(id).addEventListener('change', revisarDisponibilidad);
  });

  document.getElementById('formularioReserva').addEventListener('submit', guardarReserva);
});
