import express from 'express';
import session from 'express-session';
import router from './routers/index.js';
import db from './conf/db.js';
import dotenv from 'dotenv'; 


dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

// Configuración para procesar datos de formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de sesiones
app.use(session({
    secret: process.env.SECRET_KEY, 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Middleware para hacer la sesión accesible en las vistas
app.use((req, res, next) => {
    res.locals.usuario = req.session.cliente || null;
    next();
});

// Archivos estáticos
app.use(express.static('public'));

// Middleware para manejar el año actual en las vistas
app.use((req, res, next) => {
    res.locals.year = new Date().getFullYear();
    next();
});

// Conectar a la base de datos
db.authenticate().then(() => {
    console.log('Base de datos conectada');
}).catch(error => {
    console.log(error);
});

// Configuración del motor de vistas
app.set('view engine', 'pug');

// Rutas
app.use('/', router);

// Servidor en escucha
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
