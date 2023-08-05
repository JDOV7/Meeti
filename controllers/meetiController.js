const { check, validationResult } = require("express-validator");
const Grupos = require("../models/Grupos");
const Meeti = require("../models/Meeti");
exports.formNuevoMeeti = async (req, res) => {
  const grupos = await Grupos.findAll({ where: { usuarioId: req.user.id } });
  res.render("nuevo-meeti", { nombrePagina: "Crear Nuevo Meeti", grupos });
};

exports.crearMeeti = async (req, res) => {
  const meeti = req.body;
  meeti.usuarioId = req.user.id;
  // alamcena la ubviacion con un point
  const point = {
    type: "Point",
    coordinates: [parseFloat(req.body.lat), parseFloat(req.body.lng)],
  };
  meeti.ubicacion = point;

  if (req.body.cupo === "") {
    meeti.cupo = 0;
  }
  try {
    await Meeti.create(meeti);
    req.flash("exito", "Se ha creado el Meeti correctamente");
    return res.redirect("/administracion");
  } catch (error) {
    console.log(error);
    const erroresSequelize = error.errors.map((error) => {
      return error.message;
    });
    req.flash("error", erroresSequelize);
    return res.redirect("/nuevo-meeti");
  }
};

exports.formEditarMeeti = async (req, res) => {
  const consultas = [];
  consultas.push(Grupos.findAll({ usuarioId: req.user.id }));
  consultas.push(Meeti.findByPk(req.params.id));

  const [grupos, meeti] = await Promise.all(consultas);

  if (!grupos || !meeti) {
    req.flash("error", "Operacion no valida");
    return res.redirect("/administracion");
  }
  res.render("editar-meeti", {
    nombrePagina: `Editar Meeti: ${meeti.titulo}`,
    grupos,
    meeti,
  });
};

exports.editarMeeti = async (req, res) => {
  const meeti = await Meeti.findOne({
    where: { id: req.params.id, usuarioId: req.user.id },
  });

  if (!meeti) {
    req.flash("error", "Operacion no valida");
    return res.redirect("/administracion");
  }

  const {
    grupoId,
    titulo,
    invitado,
    fecha,
    hora,
    cupo,
    descripcion,
    direccion,
    ciudad,
    estado,
    pais,
    lat,
    lng,
  } = req.body;

  meeti.grupoId = grupoId;
  meeti.titulo = titulo;
  meeti.invitado = invitado;
  meeti.fecha = fecha;
  meeti.hora = hora;
  meeti.cupo = cupo;
  meeti.descripcion = descripcion;
  meeti.direccion = direccion;
  meeti.ciudad = ciudad;
  meeti.estado = estado;
  meeti.pais = pais;

  const point = {
    type: "Point",
    coordinates: [parseFloat(lat), parseFloat(lng)],
  };
  meeti.ubicacion = point;
  await meeti.save();
  req.flash("exito", "Cambios Guardados Correctamente");
  res.redirect("/administracion");
};

exports.formEliminarMeeti = async (req, res, next) => {
  const meeti = await Meeti.findOne({
    where: { id: req.params.id, usuarioId: req.user.id },
  });

  if (!meeti) {
    req.flash("error", "Operacion no valida");
    return res.redirect("/administracion");
    // return next();
  }
  res.render("eliminar-meeti", {
    nombrePagina: `Eliminar Meeti: ${meeti.titulo}`,
  });
};

exports.eliminarMeeti = async (req, res, next) => {
  const meeti = await Meeti.findOne({
    where: { id: req.params.id, usuarioId: req.user.id },
  });
  if (!meeti) {
    req.flash("error", "Operacion no valida");
    return res.redirect("/administracion");
    // return next();
  }
  await Meeti.destroy({ where: { id: req.params.id, usuarioId: req.user.id } });
  req.flash("exito", "Meeti Eliminado");
  res.redirect("/administracion");
};
