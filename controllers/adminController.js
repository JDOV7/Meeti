const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const moment = require("moment");
const Grupos = require("../models/Grupos");
const Meeti = require("../models/Meeti");

exports.panelAdministracion = async (req, res) => {
  console.log();

  const [grupos, meeti, anteriores] = await Promise.all([
    Grupos.findAll({ where: { usuarioId: req.user.id } }),
    Meeti.findAll({
      where: {
        usuarioId: req.user.id,
        fecha: { [Op.gte]: moment(new Date()).format("YYYY-MM-DD") },
      },
    }),
    Meeti.findAll({
      where: {
        usuarioId: req.user.id,
        fecha: { [Op.lt]: moment(new Date()).format("YYYY-MM-DD") },
      },
    }),
  ]);

  res.render("administracion", {
    nombrePagina: "Panel de Administracion",
    grupos,
    meeti,
    moment,
    anteriores,
  });
};
