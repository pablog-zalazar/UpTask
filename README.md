# Project Manager

Aplicación web para la creación y gestión de proyectos, permitiendo organizar equipos, tareas y notas en un entorno de trabajo colaborativo.

El sistema permite crear proyectos, agregar colaboradores y gestionar las tareas asociadas mediante diferentes estados, siguiendo una dinámica similar a un **tablero Kanban**.

## Funcionalidades

* Registro e inicio de sesión de usuarios.
* Autenticación mediante JWT.
* Creación y gestión de proyectos.
* Incorporación de colaboradores a los proyectos.
* Creación, edición y eliminación de tareas.
* Organización de tareas según su estado.
* Cambio de estado de las tareas mediante un tablero Kanban.
* Drag & Drop para mover tareas entre estados.
* Agregado y gestión de notas asociadas a las tareas.
* Validación de formularios.
* Protección de rutas y recursos según autenticación y proyecto.
* Envío de emails mediante SMTP.

## Tecnologías

### Frontend

* **React 19**
* **TypeScript**
* **Vite**
* **React Router**
* **TanStack React Query** — gestión del estado del servidor y consultas a la API.
* **Axios** — comunicación con el backend.
* **React Hook Form** — gestión de formularios.
* **Zod** — validación y definición de esquemas.
* **dnd-kit** — implementación de Drag & Drop para el tablero Kanban.
* **Tailwind CSS** — estilos y diseño de la interfaz.
* **React Toastify** — notificaciones.

### Backend

* **Node.js**
* **Express 5**
* **TypeScript**
* **MongoDB / Mongoose** — persistencia y modelado de datos.
* **JWT (JSON Web Token)** — autenticación.
* **bcrypt** — hashing de contraseñas.
* **Express Validator** — validación de datos recibidos por la API.
* **Nodemailer** — envío de emails mediante SMTP.
* **CORS** — configuración de acceso entre frontend y backend.
* **Morgan** — logging de peticiones HTTP.

## Arquitectura

El proyecto está dividido en dos aplicaciones independientes:

```text
project-manager/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── .env.example
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## Requisitos

Antes de ejecutar el proyecto necesitás tener instalado:

* Node.js
* npm
* MongoDB

### Backend

Ingresar al directorio:

```bash
cd backend
```

Instalar dependencias:

```bash
npm install
```

Crear un archivo `.env` tomando como referencia `.env.example`:

```env
DATABASE_URL=
FRONTEND_URL=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
JWT_SECRET=
```

Iniciar el servidor en desarrollo:

```bash
npm run dev
```

### Frontend

Desde la raíz del proyecto:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

Crear `.env.local` tomando como referencia `.env.example`:

```env
VITE_API_URL=
```

Iniciar el frontend:

```bash
npm run dev
```

## Variables de entorno

### Frontend

| Variable       | Descripción                    |
| -------------- | ------------------------------ |
| `VITE_API_URL` | URL base de la API del backend |

### Backend

| Variable        | Descripción                                          |
| --------------- | ---------------------------------------------------- |
| `DATABASE_URL`  | URL de conexión a MongoDB                            |
| `FRONTEND_URL`  | URL permitida para las solicitudes desde el frontend |
| `SMTP_HOST`     | Servidor SMTP utilizado para el envío de emails      |
| `SMTP_PORT`     | Puerto del servidor SMTP                             |
| `SMTP_USER`     | Usuario del servidor SMTP                            |
| `SMTP_PASSWORD` | Contraseña del servidor SMTP                         |
| `JWT_SECRET`    | Clave utilizada para firmar los tokens JWT           |

> Los archivos `.env` y `.env.local` contienen información sensible y no forman parte del repositorio. Se incluyen archivos `.env.example` como referencia para configurar el proyecto.

## Scripts

### Frontend

```bash
npm run dev
npm run build
npm run lint
```

### Backend

```bash
npm run dev
npm run build
```

Los scripts disponibles pueden variar según la configuración de cada aplicación.

## Objetivo del proyecto

Este proyecto fue desarrollado como una aplicación full-stack para poner en práctica conceptos de desarrollo web moderno, incluyendo:

* Desarrollo frontend con React y TypeScript.
* Desarrollo de APIs REST con Node.js y Express.
* Autenticación y autorización mediante JWT.
* Persistencia de datos con MongoDB.
* Manejo de formularios y validaciones.
* Gestión de estado del servidor.
* Comunicación entre frontend y backend.
* Organización de aplicaciones full-stack.
* Gestión de tareas mediante una interfaz Kanban.
* Interacción Drag & Drop.
* Integración con servicios externos mediante SMTP.
