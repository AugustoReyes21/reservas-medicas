# Guion del video

## Objetivo del video

Este video debe mostrar, en un orden claro y natural:

1. Tu presentacion personal.
2. La explicacion breve del proceso.
3. La base de datos y la relacion entre tablas.
4. Los commits como evidencia de trabajo.
5. El sistema funcionando con inicio de sesion.
6. La creacion de una nueva reserva para demostrar que si funciona.

## Duracion recomendada

Entre 3 minutos y 30 segundos y 4 minutos y 30 segundos.

## Importante para la introduccion

No digas que la idea del sistema surgio de ti.

Lo correcto es explicar que este sistema fue desarrollado como parte de la tarea asignada, cuyo objetivo era construir la base estructural de un sistema de reservas academicas.

## Credenciales para la demostracion

Correo institucional: `coordinacion@universidad.edu`

Clave: `clave123`

## Datos recomendados para la nueva reserva

Para que la demostracion salga clara, usa estos datos:

- Espacio: `Auditorio Central`
- Fecha: `2026-04-18`
- Hora inicio: `13:00`
- Hora fin: `15:00`
- Motivo: `Presentacion de proyecto academico`

Si esa fecha ya esta ocupada, solo cambia a otra fecha futura.

## Comandos que vas a usar

Escribelos lento, letra por letra:

```bash
npm start
```

```bash
node "mostrar base.js"
```

```bash
git log --oneline --decorate -10
```

## Antes de grabar

1. No muestres la carpeta del proyecto al inicio.
2. Empieza con el editor ya abierto en `documentos/Proceso y evidencia.md`.
3. Ten lista la terminal para usarla despues.
4. Ten el navegador cerrado o en otra pestaña antes de empezar la demostracion.
5. Mueve el mouse con calma.
6. Haz scroll suave hacia abajo y hacia arriba.
7. Cuando escribas en terminal o en el login, hazlo despacio.
8. Deja pausas cortas entre una parte y otra.

## Guion detallado con tiempos

### 00:00 a 00:20

#### Accion en pantalla

Ten abierto `documentos/Proceso y evidencia.md` al inicio.

No muestres la carpeta.

Deja el cursor quieto un momento y luego haz un pequeño scroll.

#### Texto que debes decir

Hola. Mi nombre es `[Tu nombre]` y mi numero de carnet es `[Tu numero de carnet]`.

En este video voy a presentar el desarrollo de la base de un sistema de reservas academicas, realizado como parte de la tarea asignada.

### 00:20 a 00:55

#### Accion en pantalla

Sigue en `documentos/Proceso y evidencia.md`.

Haz scroll corto por la explicacion breve del proceso.

#### Texto que debes decir

Primero voy a explicar brevemente el proceso de trabajo. El desarrollo se organizo por etapas. Primero se analizo el problema y el alcance minimo del sistema. Despues se hizo el diseño de las pantallas y del modelo de datos. Luego se construyo el backend junto con la base de datos en PostgreSQL. Finalmente se realizaron pruebas para validar el funcionamiento y evitar reservas duplicadas.

### 00:55 a 01:25

#### Accion en pantalla

Abre `documentos/Diseno del sistema.md`.

Baja con scroll hasta la parte del modelo de datos.

Luego baja hasta la seccion `Relacion entre tablas`.

#### Texto que debes decir

En la parte de diseño se definieron tres entidades principales: usuarios, espacios y reservas. La relacion central es que un usuario puede crear varias reservas y un espacio tambien puede tener varias reservas, pero cada reserva pertenece a un solo usuario y a un solo espacio.

### 01:25 a 01:55

#### Accion en pantalla

Abre `datos/esquema.sql`.

Haz scroll mostrando primero `usuarios`, luego `espacios` y despues `reservas`.

Detente un momento en `usuario_id` y `espacio_id`.

#### Texto que debes decir

Aqui se puede ver el esquema SQL real de la base de datos. La tabla usuarios guarda la informacion de acceso. La tabla espacios registra salones, laboratorios y auditorios. La tabla reservas conecta ambas tablas por medio de las llaves foraneas usuario_id y espacio_id. De esta manera se mantiene la integridad de la informacion.

### 01:55 a 02:20

#### Accion en pantalla

Ve a la terminal.

Escribe lento:

```bash
node "mostrar base.js"
```

Deja visible la salida.

#### Texto que debes decir

Ahora muestro la base de datos con informacion real. Aqui se observan las tablas principales y tambien las relaciones entre ellas. Esto ayuda a comprobar que la estructura tecnica del sistema ya esta implementada.

### 02:20 a 02:45

#### Accion en pantalla

En la misma terminal escribe lento:

```bash
git log --oneline --decorate -10
```

Deja la terminal quieta un momento.

#### Texto que debes decir

Como evidencia de trabajo, aqui se muestra el historial de commits. Esto permite ver que el proyecto fue avanzando por etapas, desde la documentacion inicial, pasando por la implementacion tecnica, hasta la migracion a PostgreSQL y los ajustes finales.

### 02:45 a 03:00

#### Accion en pantalla

Vuelve a la terminal.

Escribe lento:

```bash
npm start
```

Cuando el servidor levante, cambia al navegador.

#### Texto que debes decir

Ahora voy a mostrar el sistema funcionando directamente en el navegador.

### 03:00 a 03:30

#### Accion en pantalla

Abre `http://localhost:3000/`.

En el login escribe despacio:

- Correo institucional: `coordinacion@universidad.edu`
- Clave: `clave123`

Haz clic en `Entrar`.

Espera a que cargue el dashboard.

#### Texto que debes decir

En esta parte inicio sesion con el usuario administrador. El acceso al dashboard y a la reserva esta protegido por login, por lo que primero se debe ingresar con credenciales validas.

### 03:30 a 04:05

#### Accion en pantalla

En el dashboard mueve el mouse lentamente sobre la vista principal.

Despues haz clic en `Nueva reserva`.

Llena el formulario despacio con estos datos:

- Espacio: `Auditorio Central`
- Fecha: `2026-04-18`
- Motivo: `Presentacion de proyecto academico`
- Hora inicio: `13:00`
- Hora fin: `15:00`

Luego presiona `Guardar reserva`.

Espera a que aparezca el mensaje de confirmacion.

#### Texto que debes decir

Ahora registro una nueva reserva para demostrar que la funcionalidad principal si funciona. Selecciono el espacio, la fecha, el horario y el motivo. Al guardar, el sistema valida los datos y comprueba que no exista una reserva cruzada en el mismo espacio y horario.

Como se puede observar, la reserva se crea correctamente.

### 04:05 a 04:20

#### Accion en pantalla

Vuelve al dashboard o deja visible el mensaje de confirmacion.

Haz un pequeño scroll si es necesario y deja el mouse quieto al final.

#### Texto que debes decir

En conclusion, esta entrega incluye analisis, diseño, modelo de datos, backend, base de datos PostgreSQL, evidencia de trabajo y una demostracion funcional del sistema. Gracias.

## Version corta del texto completo

Si quieres leerlo casi seguido, este es el texto continuo:

Hola. Mi nombre es `[Tu nombre]` y mi numero de carnet es `[Tu numero de carnet]`. En este video voy a presentar el desarrollo de la base de un sistema de reservas academicas, realizado como parte de la tarea asignada.

Primero explico brevemente el proceso de trabajo. El desarrollo se organizo por etapas. Primero se analizo el problema y el alcance minimo del sistema. Despues se hizo el diseño de las pantallas y del modelo de datos. Luego se construyo el backend junto con la base de datos en PostgreSQL. Finalmente se realizaron pruebas para validar el funcionamiento y evitar reservas duplicadas.

En la parte de diseño se definieron tres entidades principales: usuarios, espacios y reservas. La relacion central es que un usuario puede crear varias reservas y un espacio tambien puede tener varias reservas, pero cada reserva pertenece a un solo usuario y a un solo espacio.

Aqui se puede ver el esquema SQL real de la base de datos. La tabla usuarios guarda la informacion de acceso. La tabla espacios registra salones, laboratorios y auditorios. La tabla reservas conecta ambas tablas por medio de las llaves foraneas usuario_id y espacio_id. De esta manera se mantiene la integridad de la informacion.

Ahora muestro la base de datos con informacion real. Aqui se observan las tablas principales y tambien las relaciones entre ellas. Esto ayuda a comprobar que la estructura tecnica del sistema ya esta implementada.

Como evidencia de trabajo, aqui se muestra el historial de commits. Esto permite ver que el proyecto fue avanzando por etapas, desde la documentacion inicial, pasando por la implementacion tecnica, hasta la migracion a PostgreSQL y los ajustes finales.

Ahora voy a mostrar el sistema funcionando directamente en el navegador. En esta parte inicio sesion con el usuario administrador. El acceso al dashboard y a la reserva esta protegido por login, por lo que primero se debe ingresar con credenciales validas.

Ahora registro una nueva reserva para demostrar que la funcionalidad principal si funciona. Selecciono el espacio, la fecha, el horario y el motivo. Al guardar, el sistema valida los datos y comprueba que no exista una reserva cruzada en el mismo espacio y horario. Como se puede observar, la reserva se crea correctamente.

En conclusion, esta entrega incluye analisis, diseño, modelo de datos, backend, base de datos PostgreSQL, evidencia de trabajo y una demostracion funcional del sistema. Gracias.

## Indicaciones para que el video se vea humano

1. No empieces mostrando la carpeta.
2. Empieza directamente en el documento del proceso.
3. Mueve el mouse lento y con trayectorias suaves.
4. Haz scroll con pausas, no de un solo golpe.
5. Escribe los comandos y credenciales letra por letra.
6. Deja silencios pequeños entre una seccion y otra.
7. Si haces una pausa natural antes de cambiar de ventana, se vera mejor.

## Cuando me envies tu audio

Cuando me pases el archivo de voz, voy a usar este guion para generar el video con:

1. Inicio sin mostrar carpeta.
2. Presentacion personal con nombre y carnet.
3. Enfoque primero en proceso, base de datos, relaciones y commits.
4. Demostracion funcional al final.
5. Movimiento de mouse, scroll y escritura con ritmo humano.
