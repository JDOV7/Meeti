const Sequelize = require("sequelize");
const db = require("../config/db");
const bcrypt = require("bcrypt-nodejs");

const Usuarios = db.define(
  "usuarios",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: Sequelize.STRING(60),
    imagen: Sequelize.STRING(60),
    descripcion: {
      type: Sequelize.TEXT,
    },
    email: {
      type: Sequelize.STRING(30),
      allowNull: false,
      validate: {
        isEmail: {
          msg: "Agrega un correo valido",
        },
      },
      unique: {
        args: true,
        msg: "Usuario ya registrado",
      },
    },
    password: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El password no puede ir vacio",
        },
      },
    },
    activo: {
      type: Sequelize.INTEGER(1),
      defaultValue: 0,
    },
    tokenPassword: Sequelize.STRING,
    expiraToken: Sequelize.DATE,
  },
  {
    hooks: {
      beforeCreate(usuario) {
        usuario.password = Usuarios.prototype.hashPassword(usuario.password);
      },
    },
  }
);

//metodo para comparar los password
Usuarios.prototype.validarPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

Usuarios.prototype.hashPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

module.exports = Usuarios;
