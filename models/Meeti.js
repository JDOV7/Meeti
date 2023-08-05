const Sequelize = require("sequelize");
const db = require("../config/db");
const slug = require("slug");
const shortid = require("shortid");
const Usuarios = require("../models/Usuarios");
const Grupos = require("../models/Grupos");
const Meeti = db.define(
  "meeti",
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    },
    titulo: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Agrega un titulo",
        },
      },
    },
    slug: {
      type: Sequelize.STRING,
    },
    invitado: Sequelize.STRING,
    cupo: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    descripcion: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Agrega una descripcion",
        },
      },
    },
    fecha: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Agrega una fecha",
        },
      },
    },
    hora: {
      type: Sequelize.TIME,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Agrega una hora",
        },
      },
    },
    direccion: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Agrega una direccion",
        },
      },
    },
    ciudad: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Agrega un ciudad",
        },
      },
    },
    estado: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Agrega un estado",
        },
      },
    },
    pais: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Agrega un pai",
        },
      },
    },
    ubicacion: {
      type: Sequelize.GEOMETRY("POINT"),
    },
    interesados: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
  },
  {
    hooks: {
      async beforeCreate(meeti) {
        const url = slug(meeti.titulo).toLowerCase();
        meeti.slug = `${url}-${shortid.generate()}`;
      },
    },
  }
);

Meeti.belongsTo(Usuarios);
Meeti.belongsTo(Grupos);

module.exports = Meeti;
