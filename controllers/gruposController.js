const { body, validationResult } = require("express-validator");
const multer = require("multer");
const shortid = require("shortid");
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
