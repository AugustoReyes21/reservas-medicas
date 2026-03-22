# Guion del video

## Antes de grabar

1. Ten abierto el explorador de archivos, el editor y la terminal.
2. Mueve el mouse con calma y evita cambios bruscos.
3. Haz scroll suave cuando muestres los documentos.
4. Cuando escribas comandos, hazlo lento, letra por letra.
5. Deja pausas cortas entre cada parte para que se vea natural.

## Texto sugerido para decir

Hola. En este video voy a presentar la base de un sistema de reservas academicas para espacios como salones, laboratorios y auditorios.

Primero explico rapidamente el problema. En muchas instituciones las reservas se hacen de forma manual y eso genera choques de horario, poca claridad sobre la disponibilidad y perdida de tiempo al coordinar actividades. Por eso plantee un sistema que centraliza tres funciones principales: registrar usuarios, consultar disponibilidad y crear reservas.

En la carpeta de documentos prepare el analisis del sistema. Aqui se puede ver la definicion del problema, los requerimientos funcionales, los no funcionales y tambien una lista de preguntas clave que yo le haria al cliente para entender mejor el alcance real del proyecto.

Ahora paso a la parte de diseño. Cree tres pantallas principales. La primera es el login, que ahora funciona como puerta de entrada obligatoria. Eso significa que antes de iniciar sesion no se puede ver ni el dashboard ni la pantalla de reserva. La segunda es el dashboard, que resume espacios, reservas y accesos rapidos. La tercera es la pantalla de reserva, donde se selecciona el espacio, la fecha, el horario y el motivo de uso.

En la parte tecnica implemente un backend con Node.js y Express, y use SQLite como base de datos. El modelo tiene tres tablas relacionadas: usuarios, espacios y reservas. Esto permite mantener la integridad de la informacion y deja una base sencilla pero funcional.

La API ya incluye rutas para iniciar sesion, registrar usuarios, listar espacios, consultar disponibilidad y crear reservas. Una validacion importante es que el sistema evita dobles reservas. Si ya existe una reserva en el mismo espacio y horario, la API responde con un error y no permite guardar el cruce.

Ahora voy a mostrar una prueba. Primero levanto el servidor con npm start. Luego entro con el usuario de demostracion. Despues consulto la disponibilidad con la ruta GET. Luego creo una reserva con la ruta POST. Finalmente intento crear otra reserva que se cruza con la anterior para demostrar que la validacion funciona correctamente.

Tambien deje una prueba automatica con npm test. Esa prueba valida el login, crea un usuario, revisa la disponibilidad, registra una reserva y confirma que una segunda reserva cruzada sea rechazada. Con eso queda evidencia de que la base del sistema ya funciona.

En resumen, esta entrega cubre el analisis, el diseño y una implementacion inicial coherente del backend y la base de datos. Gracias.

## Orden recomendado para grabar

1. Mostrar la carpeta del proyecto.
2. Abrir `documentos/Analisis del sistema.md`.
3. Hacer scroll lento por requerimientos y preguntas al cliente.
4. Abrir `documentos/Diseno del sistema.md`.
5. Levantar el proyecto con `npm start`.
6. Abrir `login.html`, `dashboard.html` y `reserva.html`.
7. Mostrar `servidor.js` y `datos/esquema.sql`.
8. Ejecutar `npm test`.
9. Cerrar con una vista rapida de `documentos/Proceso y evidencia.md`.
