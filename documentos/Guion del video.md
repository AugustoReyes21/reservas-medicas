# Guion del video

## Objetivo del video

Mostrar de forma natural y ordenada:

1. El problema y la idea general del sistema.
2. La base de datos PostgreSQL y la relacion entre tablas.
3. Los commits como evidencia de trabajo.
4. La explicacion breve del proceso.
5. El sistema funcionando con inicio de sesion.
6. La creacion de una nueva reserva para demostrar que si funciona.

## Duracion recomendada

Entre 6 minutos y 30 segundos y 8 minutos.

## Credenciales para la demostracion

Correo institucional: `coordinacion@universidad.edu`

Clave: `clave123`

## Datos recomendados para la nueva reserva

Usa estos datos para que la demostracion sea clara:

- Espacio: `Auditorio Central`
- Fecha: `2026-04-18`
- Hora inicio: `13:00`
- Hora fin: `15:00`
- Motivo: `Presentacion de proyecto academico`

Si esa fecha ya aparece ocupada, solo cambia a otra fecha futura.

## Comandos que vas a usar

Escribelos lento, letra por letra:

```bash
npm start
```

```bash
git log --oneline --decorate -10
```

```bash
node "mostrar base.js"
```

## Antes de grabar

1. Abre el explorador de archivos, el editor y la terminal.
2. Si ya habia una sesion abierta del sistema, cierra sesion antes de empezar.
3. Mueve el mouse con calma y sin cambios bruscos.
4. Haz scroll lento cuando enseñes documentos o codigo.
5. Haz pausas cortas de uno o dos segundos entre secciones.
6. Cuando abras un archivo, deja el cursor quieto un momento antes de hacer scroll.
7. Cuando escribas en terminal o en el login, hazlo despacio para que se vea humano.

## Guion detallado con tiempos

### 00:00 a 00:20

#### Accion en pantalla

Muestra la carpeta del proyecto y deja ver que existen las carpetas `documentos`, `datos`, `public` y los archivos principales.

#### Texto que debes decir

Hola. En este video voy a presentar la base de un sistema de reservas academicas para espacios como salones, laboratorios y auditorios.

### 00:20 a 01:10

#### Accion en pantalla

Abre `documentos/Analisis del sistema.md`.

Haz scroll suave por la definicion del problema, los requerimientos funcionales, los no funcionales y las preguntas al cliente.

#### Texto que debes decir

Primero presento el analisis del problema. La idea nace porque muchas instituciones gestionan reservas de forma manual, y eso provoca choques de horario, poca claridad sobre la disponibilidad y perdida de tiempo. Por eso plantee un sistema que centraliza tres funciones principales: registrar usuarios, consultar disponibilidad y crear reservas.

Aqui tambien deje los requerimientos funcionales, los requerimientos no funcionales y una lista de preguntas al cliente para definir mejor el alcance real del proyecto.

### 01:10 a 02:10

#### Accion en pantalla

Abre `documentos/Diseno del sistema.md`.

Baja con scroll hasta la parte de arquitectura.

Despues baja hasta el modelo de datos.

Por ultimo baja hasta la seccion `Relacion entre tablas`.

#### Texto que debes decir

En la parte de diseño propuse una arquitectura simple de tres capas: presentacion, API REST y base de datos. En este caso la base principal esta montada sobre PostgreSQL y se llama reservas academicas.

El modelo de datos tiene tres tablas principales: usuarios, espacios y reservas. La relacion importante es que un usuario puede crear muchas reservas y un espacio tambien puede recibir muchas reservas, pero cada reserva pertenece a un solo usuario y a un solo espacio.

### 02:10 a 02:50

#### Accion en pantalla

Abre `datos/esquema.sql`.

Haz scroll mostrando:

1. La tabla `usuarios`.
2. La tabla `espacios`.
3. La tabla `reservas`.
4. Las llaves foraneas `usuario_id` y `espacio_id`.

#### Texto que debes decir

Aqui se puede ver el esquema SQL real de la base de datos. La tabla usuarios guarda la informacion de acceso, la tabla espacios guarda salones, laboratorios y auditorios, y la tabla reservas conecta ambas por medio de llaves foraneas. Con eso se mantiene la integridad de los datos y se evita guardar reservas sin usuario o sin espacio valido.

### 02:50 a 03:20

#### Accion en pantalla

Ve a la terminal.

Escribe lento:

```bash
node "mostrar base.js"
```

Espera y deja visible la salida.

#### Texto que debes decir

Ahora muestro la base de datos con datos reales. Aqui se ven las tablas principales y sus registros. Tambien se puede notar que la reserva se relaciona con usuarios y espacios por medio de los campos usuario_id y espacio_id.

### 03:20 a 03:50

#### Accion en pantalla

En la terminal escribe lento:

```bash
git log --oneline --decorate -10
```

Deja quieto el mouse un momento y luego sube un poco la terminal si hace falta.

#### Texto que debes decir

Como evidencia de trabajo, aqui muestro el historial de commits. Esto permite ver que el proyecto se fue construyendo por etapas: primero la documentacion y wireframes, luego la API y base de datos, despues las pruebas, y finalmente la migracion a PostgreSQL junto con los ajustes finales.

### 03:50 a 04:15

#### Accion en pantalla

Abre `documentos/Proceso y evidencia.md`.

Haz scroll corto por la explicacion breve del proceso.

#### Texto que debes decir

En este documento resumi el proceso de trabajo. Primero defini el problema y el alcance, despues hice el diseño, luego implemente el backend y la base de datos, y por ultimo realice pruebas para validar disponibilidad y bloqueo de reservas duplicadas.

### 04:15 a 04:40

#### Accion en pantalla

Ve a la terminal.

Escribe lento:

```bash
npm start
```

Cuando el servidor levante, mueve el mouse al navegador.

#### Texto que debes decir

Ahora voy a mostrar el sistema funcionando. Primero levanto el servidor y luego entro al sistema con el usuario administrador de demostracion.

### 04:40 a 05:20

#### Accion en pantalla

Abre `http://localhost:3000/`.

En el login escribe despacio:

- Correo: `coordinacion@universidad.edu`
- Clave: `clave123`

Haz clic en `Entrar`.

Espera a que cargue el dashboard.

#### Texto que debes decir

En esta parte inicio sesion con el usuario administrador. El login funciona como puerta de entrada obligatoria, por lo que antes de entrar no se puede ver ni el dashboard ni la pantalla de reservas.

### 05:20 a 05:50

#### Accion en pantalla

En el dashboard mueve el mouse lentamente sobre las tarjetas y la tabla de reservas.

Haz un pequeño scroll si la pantalla lo necesita.

#### Texto que debes decir

Aqui ya se puede ver el dashboard del sistema. Esta vista resume la informacion principal, muestra el estado general y permite ir rapidamente al registro de una nueva reserva.

### 05:50 a 06:50

#### Accion en pantalla

Haz clic en `Nueva reserva`.

Llena el formulario lento y campo por campo con estos valores:

- Espacio: `Auditorio Central`
- Fecha: `2026-04-18`
- Motivo: `Presentacion de proyecto academico`
- Hora inicio: `13:00`
- Hora fin: `15:00`

Haz una pausa corta.

Luego presiona `Guardar reserva`.

Espera a que aparezca el mensaje de confirmacion.

#### Texto que debes decir

Ahora voy a registrar una nueva reserva para demostrar que la funcionalidad principal ya esta operativa. Selecciono el espacio, la fecha, el horario y el motivo. Al guardar, el sistema valida que los datos sean correctos y que no exista un cruce en el mismo espacio y horario.

Como se puede ver, la reserva se crea correctamente.

### 06:50 a 07:20

#### Accion en pantalla

Vuelve al dashboard.

Muestra la tabla de reservas recientes.

Despues ve a la terminal y ejecuta otra vez:

```bash
node "mostrar base.js"
```

Deja visible la parte de `reservas`.

#### Texto que debes decir

Ahora confirmo el resultado tanto en el sistema como en la base de datos. La nueva reserva aparece en el panel y tambien queda almacenada en la tabla reservas, relacionada con el usuario y con el espacio seleccionado.

### 07:20 a 07:40

#### Accion en pantalla

Regresa al editor o deja visible el dashboard unos segundos.

Mantén el mouse quieto y cierra con calma.

#### Texto que debes decir

En resumen, esta entrega incluye analisis, diseño, modelo de datos, implementacion del backend, base de datos PostgreSQL, validaciones y evidencia de trabajo. Gracias.

## Notas para que el video se vea humano

1. No hagas clics demasiado rapidos ni muy exactos.
2. Mueve el mouse en trayectorias un poco curvas, no siempre rectas.
3. Entre una accion y otra deja pausas cortas.
4. Cuando abras un archivo, espera medio segundo antes de hacer scroll.
5. Si escribes una fecha o una clave, hazlo con ritmo natural, no instantaneo.
6. Si necesitas corregir algo pequeño durante la grabacion, incluso eso ayuda a que se vea mas real.

## Cuando me envies tu audio

Cuando me pases el archivo de voz, voy a usar este guion para montar el video con:

1. Movimientos lentos de mouse.
2. Scroll suave hacia abajo y hacia arriba.
3. Escritura letra por letra.
4. Pausas naturales entre escenas.
5. Enfoque en base de datos, relaciones, commits, proceso y demostracion funcional.
