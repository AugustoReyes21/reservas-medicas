# Guion del video

## Objetivo del video

Este video debe mostrar, en un orden claro y natural:

1. Presentacion personal.
2. Explicacion breve del proceso.
3. Base de datos y relacion entre tablas.
4. Pruebas automatizadas con Selenium y Python.
5. Sistema funcionando con inicio de sesion.
6. Creacion de una nueva reserva y bloqueo de horario cruzado.

## Credenciales de demostracion

```text
Correo institucional: coordinacion@universidad.edu
Clave: clave123
```

## Comandos sugeridos

```bash
npm test
```

```bash
source .venv/bin/activate
npm run test:selenium
```

```bash
python video/generar_video_demo.py
```

## Flujo recomendado

1. Abrir `documentos/Proceso y evidencia.md` y explicar el alcance de la tarea.
2. Mostrar `datos/esquema.sql` para explicar las tablas `usuarios`, `espacios` y `reservas`.
3. Mostrar `pruebas_selenium/test_modulos_reservas.py` para explicar que Selenium valida todos los modulos.
4. Ejecutar `npm test` para validar la API y la base de datos en memoria.
5. Ejecutar `npm run test:selenium` para validar login, dashboard, reserva, cruce y cierre de sesion.
6. Abrir el sistema en `http://localhost:3000/`, iniciar sesion y crear una reserva.
7. Mostrar el video generado en `documentos/evidencias/video-demo-selenium.mp4`.

## Datos para la reserva

```text
Espacio: Auditorio Central
Fecha: 2026-04-18
Hora inicio: 13:00
Hora fin: 15:00
Motivo: Presentacion de proyecto academico
```

## Texto base

Hola. Mi nombre es `[Tu nombre]` y mi numero de carnet es `[Tu numero de carnet]`.
En este video presento el sistema de reservas medicas o academicas entregado como software minimo.

Primero se definio el problema, el alcance y el modelo de datos. El sistema usa tres tablas principales:
usuarios, espacios y reservas. Cada reserva pertenece a un usuario y a un espacio, y el backend valida
que no existan reservas cruzadas en el mismo horario.

Tambien se agregaron pruebas automatizadas. La prueba de Node valida la API, y la prueba con Selenium
y Python valida el recorrido completo en el navegador: inicio de sesion, dashboard, consulta de disponibilidad,
creacion de reserva, bloqueo de horario cruzado y cierre de sesion.

Finalmente muestro el sistema funcionando. Inicio sesion, reviso el dashboard, entro a nueva reserva,
selecciono el Auditorio Central, ingreso fecha, horario y motivo, y guardo la reserva. El mensaje de confirmacion
demuestra que la funcionalidad principal funciona correctamente.

En conclusion, la entrega incluye documentacion, base de datos, API, interfaz web, pruebas automatizadas
con Selenium y video de demostracion.
