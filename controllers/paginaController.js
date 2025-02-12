import {Viaje} from "../models/Viaje.js";
import {Testimonial} from "../models/Testimoniales.js";
import moment from 'moment';

const paginaInicio = async (req, res) => {

    const promiseDB=[];

    promiseDB.push(Viaje.findAll({limit: 3}));

    promiseDB.push(Testimonial.findAll({
        limit: 3,
        order: [["Id", "DESC"]],
    }));

    //Consultar 3 viajes del modelo de Viaje
    try{
        const resultado = await Promise.all(promiseDB);


        res.render('inicio', {
            pagina: 'Inicio',
            clase: 'home',
            viajes: resultado[0],
            testimonios: resultado[1],
            moment: moment,
        });

    }catch(err){
        console.log(err);
    }


}

const paginaNosotros = (req, res) => {
    res.render('nosotros', {
        pagina: 'Nosotros',
        moment: moment,
    });
}

const paginaViajes = async (req, res) => {
    //Consultar BD
    const viajes = await Viaje.findAll();
    // Formateamos las fechas antes de pasarlas a la vista


    res.render('viajes', {
        pagina: 'Viajes Disponibles',
        viajes: viajes,
        moment: moment,

    });
}

const paginaTestimonios = async (req, res) => {
    try{
        const testimonios = await Testimonial.findAll({
            limit: 6,
            order: [["Id", "DESC"]],
        });
        res.render('testimonios', {
            pagina: 'Testimonios',
            testimonios: testimonios,
            moment: moment,
        });
    }catch(err){
        console.log(err);
    }


}

//Muestra una página por su Detalle
const paginaDetallesViajes = async (req, res) => {
    // req.params te va a dar los :slug que ponemos al pasarlo del router
    const {slug} = req.params;
    //console.log(slug);
    //por si falla la consulta lo mejor es try catch
    try{
        //Me traigo una sola columna y lo hago con un where donde coincida el slug
        const resultado = await Viaje.findOne({where: {slug: slug}});
        res.render('viaje', {
            pagina: 'Información del Viaje',
            resultado: resultado,
            moment: moment,
        })
    }catch (error){
        console.log(error);
    }
}



const guardarTestimonios =  async (req, res) => {

    const nombre=req.body.nombre;
    const correo=req.body.correo;
    const mensaje=req.body.mensaje;

    const errores = [];

    if (nombre.trim()===''){
        errores.push({mensaje: 'El nombre está vacío'});
    }
    if (correo.trim()===''){
        errores.push({mensaje: 'El correo está vacío'});
    }
    if (mensaje.trim()===''){
        errores.push({mensaje: 'El mensaje está vacío'});
    }

    if (errores.length>0){ //Debemos volver a la vista y mostrar los errores

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
    }else{//Almacenar el mensaje en la BBDD
        try{

            await Testimonial.create({nombre: nombre, correoelectronico: correo,mensaje: mensaje,});
            res.redirect('/testimonios'); //Guardo en la base de datos y lo envío a la misma vista
        }catch(error){
            console.log(error);
        }
    }



}


export {
    paginaInicio,
    paginaViajes,
    paginaTestimonios,
    paginaNosotros,
    paginaDetallesViajes,
    guardarTestimonios
}