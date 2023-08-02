const Sequelize = require("sequelize");
const db = require("../config/db");
const uuid = require("uuid");
const Categorias = require("./Categorias");
const Usuarios = require("./Usuarios");

const Grupos = db.define("grupos", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: Sequelize.UUIDV4,
  },
  nombre: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "El grupo no puede ir vacio",
      },
    },
  },
  descripcion: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Coloca una descripcion",
      },
    },
  },
  url: Sequelize.STRING,
  imagen: Sequelize.STRING,
});

Grupos.belongsTo(Categorias);
Grupos.belongsTo(Usuarios);

module.exports = Grupos;
