const { body, validationResult } = require("express-validator");
const multer = require("multer");
const shortid = require("shortid");
const fs = require("fs");
const Categorias = require("../models/Categorias");
const Grupos = require("../models/Grupos");

const configuracionMulter = {
  limits: {
    fileSize: 1000000,
  },
  storage: (fileStorage = multer.diskStorage({
    destination: (req, file, next) => {
      next(null, __dirname + "/../public/uploads/grupos/");
    },
    filename: (req, file, next) => {
      const extension = file.mimetype.split("/")[1];
      next(null, `${shortid.generate()}.${extension}`);
    },
  })),
  fileFilter(req, file, next) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      next(null, true);
    } else {
      next(new Error("Formato no valido"), false);
    }
  },
};

const upload = multer(configuracionMulter).single("imagen");

//subr imagen en el servidor
exports.subirImagen = (req, res, next) => {
  upload(req, res, function (error) {
    if (error) {
      console.log(error);
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          req.flash("error", "El archivo es muy grande");
        } else {
          req.flash("error", error.message);
        }
      } else if (error.hasOwnProperty("message")) {
        req.flash("error", error.message);
      }
      return res.redirect("back");
    } else {
      next();
    }
  });
};

exports.formNuevoGrupo = async (req, res) => {
  const categorias = await Categorias.findAll();
  res.render("nuevo-grupo", {
    nombrePagina: "Crea un nuevo grupo",
    categorias,
  });
};

exports.crearGrupo = async (req, res) => {
  const grupo = req.body;
  grupo.usuarioId = req.user.id;
  // console.log(grupo);
  if (req.file) {
    grupo.imagen = req.file.filename;
  }
  try {
    await Grupos.create(grupo);
    req.flash("exito", "Se ha creado correctamente el Grupo");
    res.redirect("/administracion");
  } catch (error) {
    const erroresSequelize = error.errors.map((error) => {
      return error.message;
    });
    req.flash("error", erroresSequelize);
    res.redirect("/nuevo-grupo");
  }
};

exports.formEditarGrupo = async (req, res) => {
  const [grupo, categorias] = await Promise.all([
    Grupos.findByPk(req.params.grupoId),
    Categorias.findAll(),
  ]);
  // console.log(grupo);
  res.render("editar-grupo", {
    nombrePagina: `Editar Grupo: ${grupo.nombre}`,
    grupo,
    categorias,
  });
};

exports.editarGrupo = async (req, res, next) => {
  const grupo = await Grupos.findOne({
    where: { id: req.params.grupoId, usuarioId: req.user.id },
  });
  // console.log(grupo);
  if (!grupo) {
    req.flash("error", "Operacion no valida");
    res.redirect("/administracion");
    return next();
  }
  // console.log(req.body);
  const { nombre, descripcion, categoriaId, url } = req.body;
  grupo.nombre = nombre;
  grupo.descripcion = descripcion;
  grupo.categoriaId = categoriaId;
  grupo.url = url;

  await grupo.save();
  req.flash("exito", "Cambios almacenados correctamente");
  return res.redirect("/administracion");
};

exports.formEditarImagen = async (req, res) => {
  const grupo = await Grupos.findOne({
    where: { id: req.params.grupoId, usuarioId: req.user.id },
  });
  console.log(grupo);
  res.render("imagen-grupo", {
    nombrePagina: `Editar Imagen Grupo: ${grupo.nombre}`,
    grupo,
  });
};

exports.editarImagen = async (req, res, next) => {
  const grupo = await Grupos.findOne({
    where: { id: req.params.grupoId, usuarioId: req.user.id },
  });
  if (!grupo) {
    req.flash("error", "Operacion no valida");
    return res.redirect("/iniciar-sesion");
  }
  // if (req.file) {
  //   console.log(req.file.filename);
  // }
  // if (grupo.imagen) {
  //   console.log(grupo.imagen);
  // }
  if (req.file && grupo.imagen) {
    const imagenAnteriorPath =
      __dirname + `/../public/uploads/grupos/${grupo.imagen}`;
    console.log(imagenAnteriorPath);
    //eliminar archivo con fs
    fs.unlink(imagenAnteriorPath, (error) => {
      if (error) {
        console.log(error);
      }
      return;
    });
  }
  if (req.file) {
    grupo.imagen = req.file.filename;
  }
  await grupo.save();
  req.flash("exito", "Cambios almacenados correctamente");
  res.redirect("/administracion");
};

exports.formEliminarGrupo = async (req, res, next) => {
  const grupo = await Grupos.findOne({
    where: { id: req.params.grupoId, usuarioId: req.user.id },
  });

  if (!grupo) {
    req.flash("error", "Operacion no valida");
    return res.redirect("/iniciar-sesion");
  }
  return res.render("eliminar-grupo", {
    nombrePagina: `Eliminar Grupo: ${grupo.nombre}`,
  });
};

exports.eliminarGrupo = async (req, res) => {
  const grupo = await Grupos.findOne({
    where: { id: req.params.grupoId, usuarioId: req.user.id },
  });

  if (!grupo) {
    req.flash("error", "Operacion no valida");
    return res.redirect("/administracion");
  }
  // console.log(grupo.imagen);
  if (grupo.imagen) {
    const imagenAnteriorPath =
      __dirname + `/../public/uploads/grupos/${grupo.imagen}`;
    console.log(imagenAnteriorPath);
    //eliminar archivo con fs
    fs.unlink(imagenAnteriorPath, (error) => {
      if (error) {
        console.log(error);
      }
      return;
    });
  }

  await Grupos.destroy({
    where: { id: req.params.grupoId, usuarioId: req.user.id },
  });
  req.flash("exito", "Grupo Eliminado");
  return res.redirect("/administracion");
};
