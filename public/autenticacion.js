(function () {
  const llaveSesion = 'sesionSistemaReservas';
  const rutasProtegidas = new Set(['/dashboard.html', '/reserva.html']);
  const rutasAcceso = new Set(['/', '/index.html', '/login.html']);

  function obtenerSesion() {
    try {
      const valor = localStorage.getItem(llaveSesion);
      return valor ? JSON.parse(valor) : null;
    } catch (_error) {
      return null;
    }
  }

  function guardarSesion(usuario) {
    localStorage.setItem(llaveSesion, JSON.stringify(usuario));
  }

  function cerrarSesion() {
    localStorage.removeItem(llaveSesion);
    window.location.replace('/');
  }

  function escribirUsuarios() {
    const sesion = obtenerSesion();

    document.querySelectorAll('[data-nombre-usuario]').forEach((elemento) => {
      elemento.textContent = sesion ? sesion.nombre : 'Usuario';
    });

    document.querySelectorAll('[data-correo-usuario]').forEach((elemento) => {
      elemento.textContent = sesion ? sesion.correo : 'usuario@universidad.edu';
    });
  }

  function mostrarMensajeLogin(texto, tipo) {
    const mensaje = document.getElementById('mensajeLogin');

    if (!mensaje) {
      return;
    }

    mensaje.textContent = texto;
    mensaje.className = `mensaje activo ${tipo}`;
  }

  function protegerRutas() {
    const ruta = window.location.pathname || '/';
    const sesion = obtenerSesion();

    if (rutasProtegidas.has(ruta) && !sesion) {
      window.location.replace('/');
      return false;
    }

    if (rutasAcceso.has(ruta) && sesion) {
      window.location.replace('/dashboard.html');
      return false;
    }

    if (rutasProtegidas.has(ruta) && sesion) {
      document.body.classList.remove('protegida');
    }

    return true;
  }

  function prepararCerrarSesion() {
    document.querySelectorAll('[data-cerrar-sesion]').forEach((boton) => {
      boton.addEventListener('click', () => {
        cerrarSesion();
      });
    });
  }

  function prepararLogin() {
    const formulario = document.getElementById('formularioLogin');

    if (!formulario) {
      return;
    }

    formulario.addEventListener('submit', async (evento) => {
      evento.preventDefault();

      const entradaCorreo = formulario.querySelector('#contactoInstitucional');
      const entradaClave = formulario.querySelector('#codigoSeguro');
      const correo = entradaCorreo ? entradaCorreo.value.trim() : '';
      const clave = entradaClave ? entradaClave.value : '';

      mostrarMensajeLogin('Verificando acceso...', 'informacion');

      try {
        const respuesta = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ correo, clave })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          mostrarMensajeLogin(datos.mensaje || 'No fue posible iniciar sesion', 'error');
          return;
        }

        guardarSesion(datos.datos);
        mostrarMensajeLogin('Acceso correcto. Redirigiendo al dashboard...', 'exito');

        window.setTimeout(() => {
          window.location.replace('/dashboard.html');
        }, 500);
      } catch (_error) {
        mostrarMensajeLogin('No se pudo conectar con el servidor', 'error');
      }
    });
  }

  function despejarFocoInicial() {
    const panel = document.getElementById('panelAcceso');

    if (!panel) {
      return;
    }

    window.setTimeout(() => {
      if (document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
      }

      panel.focus({ preventScroll: true });
    }, 80);
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!protegerRutas()) {
      return;
    }

    despejarFocoInicial();
    escribirUsuarios();
    prepararCerrarSesion();
    prepararLogin();
  });

  window.autenticacionReservas = {
    obtenerSesion,
    guardarSesion,
    cerrarSesion
  };
})();
