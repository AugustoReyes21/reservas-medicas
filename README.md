# Sistema de reservas academicas

Este proyecto contiene la base estructural de un sistema para gestionar reservas de espacios academicos como salones, laboratorios y auditorios.

## Lo que incluye

- Analisis del problema y requerimientos
- Diseno inicial con wireframes de tres pantallas
- Modelo de datos con tres tablas relacionadas
- API REST con login, registro de usuarios, consulta de espacios, consulta de disponibilidad y creacion de reservas
- Validacion para evitar reservas cruzadas en el mismo horario
- Evidencia de trabajo basada en commits
- Base de datos en PostgreSQL

## Como ejecutar

```bash
npm install
npm start
```

La base configurada para este proyecto se llama:

```text
reservas academicas
```

Si necesitas crearla manualmente, puedes usar el archivo:

```text
datos/crear base.sql
```

Configuracion esperada por defecto:

```text
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=reservas academicas
```

Si prefieres usar `DATABASE_URL`, recuerda que el espacio debe ir codificado:

```text
postgres://usuario:clave@localhost:5432/reservas%20academicas
```

El sistema inicia desde:

```text
http://localhost:3000
```

La entrada principal es la pantalla de login. El dashboard y la vista de reserva se habilitan solo despues de iniciar sesion.

## Credenciales de demostracion

```text
Correo: coordinacion@universidad.edu
Clave: clave123
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

### Iniciar sesion

```http
POST /api/login
Content-Type: application/json

{
  "correo": "coordinacion@universidad.edu",
  "clave": "clave123"
}
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

La prueba levanta el servidor con PostgreSQL en memoria, valida el login, registra un usuario, crea una reserva y confirma que una segunda reserva en horario cruzado sea rechazada.
