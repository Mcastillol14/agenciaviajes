import { Viaje } from "../models/Viaje.js";
import { Testimonial } from "../models/Testimoniales.js";
import { Cliente } from "../models/cliente.js";
import moment from 'moment';
import bcrypt from 'bcrypt';

const paginaInicio = async (req, res) => {

    const promiseDB = [];

    promiseDB.push(Viaje.findAll({ limit: 3 }));

    promiseDB.push(Testimonial.findAll({
        limit: 3,
        order: [["Id", "DESC"]],
    }));

    try {
        const resultado = await Promise.all(promiseDB);


        res.render('inicio', {
            pagina: 'Inicio',
            clase: 'home',
            viajes: resultado[0],
            testimonios: resultado[1],
            moment: moment,
        });

    } catch (err) {
        res.status(500).json({ mensaje: "Error al cargar la página" });
    }


}

const paginaNosotros = (req, res) => {
    res.render('nosotros', {
        pagina: 'Nosotros',
        moment: moment,
    });
}

const paginaViajes = async (req, res) => {
    const viajes = await Viaje.findAll();


    res.render('viajes', {
        pagina: 'Viajes Disponibles',
        viajes: viajes,
        moment: moment,

    });
}

const paginaTestimonios = async (req, res) => {
    try {
        const testimonios = await Testimonial.findAll({
            limit: 6,
            order: [["Id", "DESC"]],
        });
        res.render('testimonios', {
            pagina: 'Testimonios',
            testimonios: testimonios,
            moment: moment,
        });
    } catch (err) {
        res.status(500).json({ mensaje: "Error al cargar la página" });
    }


}

const paginaAcceder = async (req, res) => {
    try {
        if (req.session.cliente) {
            return res.redirect('/')
        }
        res.render('acceder', { pagina: 'Acceder' })
    } catch (err) {
        res.status(500).json({ mensaje: "Error al cargar la página" });

    }
}

const paginaDetallesViajes = async (req, res) => {
    const { slug } = req.params;

    try {
        const resultado = await Viaje.findOne({ where: { slug: slug } });
        res.render('viaje', {
            pagina: 'Información del Viaje',
            resultado: resultado,
            moment: moment,
        })
    } catch (error) {
        console.log(error);
    }
}


const guardarTestimonios = async (req, res) => {

    const nombre = req.body.nombre;
    const correo = req.body.correo;
    const mensaje = req.body.mensaje;

    const errores = [];

    if (nombre.trim() === '') {
        errores.push({ mensaje: 'El nombre está vacío' });
    }
    if (correo.trim() === '') {
        errores.push({ mensaje: 'El correo está vacío' });
    }
    if (mensaje.trim() === '') {
        errores.push({ mensaje: 'El mensaje está vacío' });
    }

    if (errores.length > 0) {

        const testimonios = await Testimonial.findAll({
            limit: 6,
            order: [["Id", "DESC"]],
        });

        res.render('testimonios', {
            pagina: 'Testimonios',
            errores: errores,
            nombre: nombre,
            correo: correo,
            mensaje: mensaje,
            testimonios: testimonios,
        })
    } else {
        try {

            await Testimonial.create({ nombre: nombre, correoelectronico: correo, mensaje: mensaje, });
            res.redirect('/testimonios');
        } catch (error) {
            res.status(500).json({ mensaje: "Error al cargar la página" });
        }
    }



}

const registrarUsuario = async (req, res) => {
    const { nombre, apellidos, email, password } = req.body;
    const errores = []

    if (nombre.trim() === "") {
        errores.push('El campo de nombre es obligatorio')
    }
    if (apellidos.trim() === "") {
        errores.push('El campo de apellidos es obligatorio')
    }
    if (email.trim() === "") {
        errores.push('El campo de email es obligatorio')
    }
    if (password.trim() === "") {
        errores.push('El campo de contraseña es obligatorio')
    }

    if (errores.length > 0) {
        return res.render('acceder', { errores, nombre, apellidos, email });
    }

    try {
        const existeUsuario = await Cliente.findOne({ where: { correoelectronico: email } })
        if (existeUsuario) {
            errores.push('El correo electrónico ya está registrado')
            return res.render('acceder', { errores, nombre, apellidos, email });
        }

        const passwordEncriptada = await bcrypt.hash(password, 12)
        await Cliente.create({
            nombre,
            apellidos,
            correoelectronico: email,
            password: passwordEncriptada
        })
        res.redirect('/acceder')
    } catch (error) {
        errores.push('Error inesperado en el servidor')
        return res.render('acceder', { errores, nombre, apellidos, email });
    }
}


const iniciarSesion = async (req, res) => {
    try {
        const { emailIniciar, passwordIniciar } = req.body;
        const errores = []

        if (emailIniciar.trim() === "") {
            errores.push('El campo email es obligatorio')
        }
        if (passwordIniciar.trim() === "") {
            errores.push('El campo de contraseña es obligatorio')
        }

        if (errores.length > 0) {
            return res.render('acceder', { errores, emailIniciar });
        }

        const emailLogin = await Cliente.findOne({ where: { correoelectronico: emailIniciar } })
        if (!emailLogin) {
            errores.push("El correo electrónico no está registrado")
            return res.render('acceder', { errores, emailIniciar });
        }

        const passwordCorrecta = await bcrypt.compare(passwordIniciar, emailLogin.password)
        if (!passwordCorrecta) {
            errores.push("La contraseña es incorrecta")
            return res.render('acceder', { errores, emailIniciar });
        }

        req.session.cliente = {
            id: emailLogin.id,
            nombre: emailLogin.nombre,
            email: emailLogin.correoelectronico
        };

        res.redirect('/')
    } catch (error) {
        errores.push('Error inesperado con el servidor')
        return res.render('acceder', { errores, emailIniciar });
    }
}


const cerrarSesion = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al cerrar sesión:", err);
            return res.status(500).json({ mensaje: "Error al cerrar sesión" });
        }
        res.redirect('/');
    });
}



export {
    paginaInicio,
    paginaViajes,
    paginaTestimonios,
    paginaNosotros,
    paginaAcceder,
    paginaDetallesViajes,
    guardarTestimonios,
    registrarUsuario,
    iniciarSesion,
    cerrarSesion
}