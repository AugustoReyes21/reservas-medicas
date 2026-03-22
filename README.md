# Sistema de reservas academicas

Este proyecto contiene la base estructural de un sistema para gestionar reservas de espacios academicos como salones, laboratorios y auditorios.

## Lo que incluye

- Analisis del problema y requerimientos
- Diseno inicial con wireframes de tres pantallas
- Modelo de datos con tres tablas relacionadas
- API REST con registro de usuarios, consulta de espacios, consulta de disponibilidad y creacion de reservas
- Validacion para evitar reservas cruzadas en el mismo horario
- Evidencia de trabajo basada en commits

## Como ejecutar

```bash
npm install
npm start
```

El servidor queda disponible en:

```text
http://localhost:3000
```

## Endpoints principales

### Registrar usuario

```http
POST /api/usuarios
Content-Type: application/json

{
  "nombre": "Ana Lopez",
  "correo": "ana@universidad.edu",
  "clave": "clave123",
  "rol": "docente"
}
```

### Consultar disponibilidad

```http
GET /api/disponibilidad?fecha=2026-03-25&horaInicio=08:00&horaFin=10:00
```

### Crear reserva

```http
POST /api/reservas
Content-Type: application/json

{
  "usuarioId": 1,
  "espacioId": 1,
  "fecha": "2026-03-25",
  "horaInicio": "08:00",
  "horaFin": "10:00",
  "motivo": "Clase de base de datos"
}
```

## Prueba automatica

```bash
npm test
```

La prueba levanta el servidor con una base temporal, registra un usuario, crea una reserva y confirma que una segunda reserva en horario cruzado sea rechazada.
