import Sequelize from "sequelize";
import db from "../conf/db.js";

export const Testimonial = db.define("testimoniales", {
    nombre: {
        type: Sequelize.STRING
    },
    correoelectronico: {
        type: Sequelize.STRING
    },
    mensaje: {
        type: Sequelize.STRING
    },
});
Testimonial.sync({ alter: true }).catch(console.error);