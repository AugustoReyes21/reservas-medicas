# Pruebas automatizadas con Selenium

## Alcance cubierto

Las pruebas Selenium cubren los modulos principales del sistema:

1. Login: rechazo de credenciales invalidas e ingreso con el usuario de demostracion.
2. Dashboard: carga de resumen, espacios activos y consulta de disponibilidad.
3. Reserva: seleccion de espacio, fecha, horario, motivo y guardado de una reserva.
4. Validacion de cruce: bloqueo de una segunda reserva en horario traslapado.
5. Seguridad de vistas: cierre de sesion y redireccion de rutas protegidas.

## Requisitos

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

Selenium Manager descarga o localiza automaticamente el driver del navegador. Por defecto se usa Chrome en modo headless.

## Ejecucion

```bash
npm test
npm run test:selenium
```

Tambien se puede ejecutar directamente:

```bash
python -m unittest discover -s pruebas_selenium -p 'test_*.py' -v
```

## Video de evidencia

El script `video/generar_video_demo.py` levanta el sistema con PostgreSQL en memoria, ejecuta el flujo principal en el navegador y genera un MP4 en:

```text
documentos/evidencias/video-demo-selenium.mp4
```

Para regenerarlo:

```bash
python video/generar_video_demo.py
```
