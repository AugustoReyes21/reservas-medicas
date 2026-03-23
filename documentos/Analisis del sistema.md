# Analisis del sistema

## Definicion del problema

La institucion necesita un sistema que organice la reserva de espacios academicos de forma clara y confiable. Hoy este tipo de gestion suele hacerse por mensajes, hojas de calculo o avisos informales, lo que provoca choques de horario, poca visibilidad sobre la disponibilidad real y perdida de tiempo al momento de coordinar clases, practicas o eventos.

El sistema propuesto busca resolver ese problema centralizando el registro de usuarios, la consulta de disponibilidad y la creacion de reservas en una sola plataforma. La idea es que un docente, coordinador o personal autorizado pueda saber que espacios estan libres en una fecha y hora especifica, y que al crear una reserva el sistema bloquee automaticamente los cruces para evitar dobles asignaciones.

## Requerimientos funcionales

1. El sistema debe permitir el registro de usuarios con nombre, correo y clave.
2. El sistema debe permitir clasificar usuarios por rol, por ejemplo docente o administrador.
3. El sistema debe almacenar los espacios academicos con nombre, tipo, ubicacion y capacidad.
4. El sistema debe mostrar el listado de espacios disponibles para consulta.
5. El sistema debe permitir buscar disponibilidad por fecha, hora de inicio y hora final.
6. El sistema debe permitir filtrar disponibilidad por tipo de espacio.
7. El sistema debe permitir crear una reserva asociando un usuario con un espacio.
8. El sistema debe registrar el motivo o uso de la reserva.
9. El sistema debe impedir reservas duplicadas o cruzadas en el mismo espacio y horario.
10. El sistema debe permitir consultar las reservas creadas.
11. El sistema debe responder con mensajes claros cuando una reserva no pueda realizarse.
12. El sistema debe guardar la fecha de creacion de usuarios y reservas para control basico.

## Requerimientos no funcionales

1. El sistema debe responder en pocos segundos para operaciones normales de consulta y registro.
2. El backend debe tener una estructura sencilla y mantenible para facilitar futuras mejoras.
3. La base de datos debe garantizar integridad referencial entre usuarios, espacios y reservas.
4. La API debe manejar errores con respuestas comprensibles y codigos HTTP coherentes.
5. El sistema debe ser compatible con navegadores modernos para visualizar los wireframes y la documentacion.
6. El proyecto debe ser facil de ejecutar localmente con pocos pasos.
7. La solucion inicial debe permitir crecer despues hacia autenticacion segura y panel administrativo.

## Preguntas al cliente

1. Que tipos de usuario reales existiran en el sistema y que permisos tendra cada uno.
2. Un usuario puede reservar cualquier espacio o algunos requieren autorizacion especial.
3. La reserva necesita aprobacion manual antes de quedar confirmada.
4. Se deben manejar horarios fijos por bloques de clase o horarios libres por minutos.
5. Que sucede si una reserva debe cancelarse o reprogramarse.
6. Se necesita historial de cambios de cada reserva.
7. Los espacios tienen horarios de disponibilidad propios segun dia o campus.
8. Se debe limitar la cantidad de reservas por usuario en un mismo periodo.
9. El sistema debe enviar correos o notificaciones al confirmar una reserva.
10. Se necesita integrar este sistema con cuentas institucionales existentes.
11. Habra restricciones por capacidad minima o tipo de actividad para cada espacio.
12. Se requiere un panel de reportes para coordinacion academica.
