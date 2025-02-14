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

const paginaAcceder= async(req,res)=>{
    try{
        if(req.session.cliente){
            return res.redirect('/')
        }
        res.render('acceder',{pagina: 'Acceder'})
    }catch(err){
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
        errores.push('El campo de email es obligatorio ')
    }

    if (password.trim() === "") {
        errores.push('El campo de contraseña es obligatorio')
    }

    try {
        const existeUsuario = await Cliente.findOne({ where: { correoelectronico: email } })
        if (existeUsuario) {
                return res.status(400).json({ mensaje: "El correo electronico ya esta registrado" })
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
        res.status(500).json({ mensaje: "Error inesperado en el servidor" })
    }

}
const iniciarSesion= async(req,res)=>{
 try {
    const {emailIniciar, passwordIniciar}=req.body;
    console.log(emailIniciar)
    console.log(passwordIniciar)
    const errores=[]
    if(emailIniciar.trim()===""){
        errores.push('El campo email es obligatorio')
    }
    if(passwordIniciar.trim()===""){
        errores.push('El campo de contraseña es obligatorio')
    }

    const emailLogin= await Cliente.findOne({where:{correoelectronico:emailIniciar}})
    if(!emailLogin){
        return res.status(400).json({mensaje:"El correo electronico no esta registrado"})
    }

    const passwordCorrecta= await bcrypt.compare(passwordIniciar, emailLogin.password)
    if(!passwordCorrecta){
        return res.status(400).json({mensaje:"La contaseña es incorrecta"})
    }
    req.session.cliente={
        id:emailLogin.id,
        nombre:emailLogin.nombre,
        email:emailLogin.correoelectronico
    };
    res.redirect('/')
 } catch (error) {
    res.status(500).json({mensaje:"Error inesperado con el servidor"})
    console.log(error)
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