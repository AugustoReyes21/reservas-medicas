const path = require('path');
const express = require('express');
const cors = require('cors');
const {
  obtenerConexion,
  registrarUsuario,
  autenticarUsuario,
  obtenerEspacios,
  obtenerDisponibilidad,
  crearReserva,
  obtenerReservas
} = require('./basedatos');

const app = express();
const puerto = Number(process.env.PORT || 3000);

obtenerConexion();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function fechaValida(fecha) {
  return /^\d{4}-\d{2}-\d{2}$/.test(fecha);
}

function horaValida(hora) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(hora);
}

function correoValido(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

function responderError(res, status, mensaje) {
  return res.status(status).json({
    ok: false,
    mensaje
  });
}

app.get('/api', (_req, res) => {
  res.json({
    ok: true,
    mensaje: 'API de reservas academicas activa'
  });
});

app.post('/api/usuarios', (req, res) => {
  const { nombre, correo, clave, rol } = req.body;

  if (!nombre || !correo || !clave) {
    return responderError(res, 400, 'Nombre, correo y clave son obligatorios');
  }

  if (!correoValido(correo)) {
    return responderError(res, 400, 'El correo no tiene un formato valido');
  }

  if (String(clave).length < 6) {
    return responderError(res, 400, 'La clave debe tener al menos 6 caracteres');
  }

  try {
    const usuario = registrarUsuario({ nombre, correo, clave, rol });
    return res.status(201).json({
      ok: true,
      mensaje: 'Usuario registrado correctamente',
      datos: usuario
    });
  } catch (error) {
    if (String(error.message).includes('UNIQUE')) {
      return responderError(res, 409, 'Ya existe un usuario con ese correo');
    }

    return responderError(res, 500, 'No fue posible registrar el usuario');
  }
});

app.post('/api/login', (req, res) => {
  const { correo, clave } = req.body;

  if (!correo || !clave) {
    return responderError(res, 400, 'Correo y clave son obligatorios');
  }

  if (!correoValido(correo)) {
    return responderError(res, 400, 'El correo no tiene un formato valido');
  }

  const usuario = autenticarUsuario({ correo, clave });

  if (!usuario) {
    return responderError(res, 401, 'Credenciales incorrectas');
  }

  return res.json({
    ok: true,
    mensaje: 'Inicio de sesion correcto',
    datos: usuario
  });
});

app.get('/api/espacios', (_req, res) => {
  res.json({
    ok: true,
    datos: obtenerEspacios()
  });
});

app.get('/api/disponibilidad', (req, res) => {
  const { fecha, horaInicio, horaFin, tipo } = req.query;

  if (!fecha || !horaInicio || !horaFin) {
    return responderError(res, 400, 'Debe enviar fecha, horaInicio y horaFin');
  }

  if (!fechaValida(fecha) || !horaValida(horaInicio) || !horaValida(horaFin)) {
    return responderError(res, 400, 'El formato de fecha u hora es invalido');
  }

  if (horaInicio >= horaFin) {
    return responderError(res, 400, 'La hora de inicio debe ser menor a la hora final');
  }

  const datos = obtenerDisponibilidad({ fecha, horaInicio, horaFin, tipo });

  return res.json({
    ok: true,
    filtros: { fecha, horaInicio, horaFin, tipo: tipo || null },
    cantidad: datos.length,
    datos
  });
});

app.get('/api/reservas', (_req, res) => {
  res.json({
    ok: true,
    datos: obtenerReservas()
  });
});

app.post('/api/reservas', (req, res) => {
  const { usuarioId, espacioId, fecha, horaInicio, horaFin, motivo } = req.body;

  if (!usuarioId || !espacioId || !fecha || !horaInicio || !horaFin || !motivo) {
    return responderError(res, 400, 'Todos los campos de la reserva son obligatorios');
  }

  if (!fechaValida(fecha) || !horaValida(horaInicio) || !horaValida(horaFin)) {
    return responderError(res, 400, 'El formato de fecha u hora es invalido');
  }

  if (horaInicio >= horaFin) {
    return responderError(res, 400, 'La hora de inicio debe ser menor a la hora final');
  }

  try {
    const reserva = crearReserva({
      usuarioId: Number(usuarioId),
      espacioId: Number(espacioId),
      fecha,
      horaInicio,
      horaFin,
      motivo
    });

    return res.status(201).json({
      ok: true,
      mensaje: 'Reserva creada correctamente',
      datos: reserva
    });
  } catch (error) {
    if (error.code === 'USUARIO_NO_EXISTE' || error.code === 'ESPACIO_NO_EXISTE') {
      return responderError(res, 404, error.message);
    }

    if (error.code === 'RESERVA_DUPLICADA') {
      return responderError(res, 409, error.message);
    }

    return responderError(res, 500, 'No fue posible crear la reserva');
  }
});

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

if (require.main === module) {
  app.listen(puerto, () => {
    console.log(`Servidor activo en http://localhost:${puerto}`);
  });
}

module.exports = app;
