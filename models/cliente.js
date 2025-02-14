import Sequelize from "sequelize";
import db from "../conf/db.js";

export const Cliente = db.define('Cliente', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
    },
    nombre: {
        type: Sequelize.STRING,
        allowNull: false,  
    },
    apellidos: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    correoelectronico: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false,
    }
}, {
    tableName: 'clientes',
    // timestamps: false, 
});

// Sincroniza la base de datos
Cliente.sync({ alter: true }).catch(console.error);


