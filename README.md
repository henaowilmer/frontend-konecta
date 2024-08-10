# Frontend React Konecta

## Descripción
Este proyecto es una aplicación frontend desarrollada en React, diseñada para ejecutarse en un entorno Docker. La aplicación se conecta con un backend a través de API para proporcionar una interfaz de usuario interactiva y dinámica.

## Requisitos de Instalación
### Prerrequisitos
Docker y Docker Compose instalados en tu sistema.
Node.js v16.x o superior.
NPM como gestor de paquetes.

## Variables de Entorno
Por petición de la prueba técnica las variables de entorno fueron incluidas en el repositorio de esta proyecto.

## Instalación
### Clona el repositorio:
```
git clone https://github.com/henaowilmer/frontend-konecta.git
cd frontend-konecta
```
### Construye y ejecuta los contenedores Docker:
```
docker-compose up --build
```
La aplicación estará disponible en http://localhost:3000.

## Pruebas
La aplicación incluye pruebas automatizadas para asegurar la calidad del código y el correcto funcionamiento de las funcionalidades. Utilizamos Jest y React Testing Library para realizar pruebas basicas.

Para la ejecución de pruebas:
```
npm test
```
Esto ejecutará todas las pruebas definidas en el proyecto y mostrará los resultados en la terminal.


## Mejores Prácticas
Modularización: El código está dividido en módulos separados para cada funcionalidad, lo que facilita el mantenimiento y la escalabilidad.

Gestión del Estado: Utilizamos herramientas como Context API para gestionar el estado de la aplicación de manera eficiente.

Validación de Formularios: Implementamos validación en los formularios para garantizar la integridad de los datos del usuario.

Pruebas Automatizadas: Incluimos pruebas automatizadas para asegurar la calidad y el correcto funcionamiento de la aplicación.

## Seguridad
Autenticación y Autorización: La aplicación se comunica con el backend a través de API protegidas, utilizando tokens JWT para la autenticación y autorización de usuarios.

Variables de Entorno: Las configuraciones sensibles y credenciales están gestionadas a través de variables de entorno.

Política de Seguridad de Contenidos (CSP): Se recomienda configurar CSP en el servidor backend para mitigar ataques XSS (Cross-Site Scripting).