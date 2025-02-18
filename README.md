# Agencia de Viajes

Este proyecto es una aplicación web para una agencia de viajes que permite a los usuarios explorar y reservar viajes a diferentes destinos.
Página en producción: https://agenciaviajes-kxak.onrender.com
La modificación añadida ha sido implementar un registro/login usando una encriptación de contraseña y despues controlando las sesiones con express-session
## Descripción

La aplicación de Agencia de Viajes ofrece las siguientes funcionalidades:

- Explorar destinos de viaje
- Ver detalles de los viajes, incluyendo precios y fechas
- Realizar reservaciones de viajes
- Gestionar testimonios de clientes

## Tecnologías Utilizadas

- Node.js
- Express.js
- Pug (motor de plantillas)
- MySQL
- Sequelize (ORM)

## Librerías y Dependencias

- express: Framework web para Node.js
- pug: Motor de plantillas para generar HTML
- sequelize: ORM para interactuar con la base de datos MySQL
- mysql2: Driver de MySQL para Node.js
- dotenv: Para manejar variables de entorno
- bcrypt-nodejs: Para el hash de contraseñas
- express-session: Para manejar sesiones de usuario

## Estructura de Carpetas

```
agenciaviajes/
│
├── conf/
│   └── db.js
│
├── controllers/
│   └── paginasController.js
│
├── models/
│   ├── Cliente.js
│   ├── Testimonial.js
│   └── Viaje.js
│
├── public/
│   ├── css/
│   └── img/
│
├── routes/
│   └── index.js
│
├── views/
│   ├── layout/
│       ├──footer.pug
│       ├──header.pug
│       ├──index.pug
│       ├──layaout_testimonios.pug
│       └──layaout_viajes.pug
│   ├──acceder.pug
│   ├──inicio.pug
│   ├──nosotros.pug
│   ├── testimonios.pug
│   ├── viaje.pug
│   └── viajes.pug
│
├── .env
├── .gitignore
├── index.js
└── package.json
```

Instalación
Clona este repositorio:

git clone https://github.com/Mcastillol14/agenciaviajes.git
Navega al directorio del proyecto:

cd agenciaviajes
Instala las dependencias:

npm install
Configura las variables de entorno en un archivo .env basándote en el archivo .env.example.

Inicia la aplicación:

npm start
Variables de Entorno
Para ejecutar este proyecto, necesitarás añadir las siguientes variables de entorno a tu archivo .env:

Crea un archivo .env en la raíz del proyecto:

touch .env
Abre el archivo .env y añade las siguientes variables:

# Conexión a la Base de Datos
CONEXION=mysql://username:password@host:port/database_name

# Clave Secreta para Gestión de Sesiones
SECRET_KEY=your_secret_key_here
Reemplaza los valores de ejemplo con tus credenciales reales:

Para CONEXION, reemplaza con tu cadena de conexión MySQL.
Para SECRET_KEY, reemplaza con una cadena aleatoria segura para la gestión de sesiones.
Nota: Nunca metas tu archivo .env real al control de versiones. Asegúrate de que .env esté listado en tu archivo .gitignore.
