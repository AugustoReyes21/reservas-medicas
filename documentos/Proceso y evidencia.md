# Proceso y evidencia

## Explicacion breve del proceso

El desarrollo se realizo en cuatro momentos. Primero se definio claramente el problema y el alcance minimo del sistema. Despues se organizo el diseno visual en tres pantallas para mostrar como se moveria un usuario dentro del sistema. En la tercera etapa se construyo el backend con Node.js, Express y SQLite para tener una API funcional. Por ultimo se hicieron pruebas para confirmar que la disponibilidad se consulte bien y que una doble reserva sea rechazada.

La idea fue mantener una solucion pequeña pero coherente, facil de explicar y suficientemente real para demostrar analisis, diseño, modelo de datos e implementacion tecnica en una sola entrega.

## Evidencia disponible

1. Documentacion del analisis en la carpeta `documentos`.
2. Wireframes navegables en la carpeta `public`.
3. Base de datos relacional definida en `datos/esquema.sql`.
4. API funcional en `servidor.js` y `basedatos.js`.
5. Prueba automatica en `pruebas.js`.
6. Historial de commits del proyecto.

## Como demostrar el funcionamiento

1. Ejecutar `npm install`.
2. Ejecutar `npm start`.
3. Abrir `http://localhost:3000/login.html`.
4. Probar en navegador o con una herramienta de API las rutas `/api/disponibilidad` y `/api/reservas`.
5. Ejecutar `npm test` para mostrar la validacion automatica.

## Historial de avances

Este apartado se actualiza al final con el registro real de commits generados durante el desarrollo.
