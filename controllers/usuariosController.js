const { body, validationResult } = require("express-validator");
const Usuarios = require("../models/Usuarios");
const enviarEmail = require("../handlers/emails");
exports.formCrearCuenta = (req, res) => {
  res.render("crear-cuenta", { nombrePagina: "Crea tu Cuenta" });
};

exports.crearNuevaCuenta = async (req, res) => {
  await body("confirmar", "El password confirmado no puede ir vacio")
    .trim()
    .escape()
    .notEmpty()
    .run(req);

  await body("confirmar", "El password es diferente")
    .trim()
    .escape()
    .equals(req.body.password)
    .run(req);

  let errores = validationResult(req);
  try {
    const usuario = req.body;
    // console.log(errores.errors);
    // console.log(usuario);
    const usuarioNuevo = await Usuarios.create(usuario);

    //general url de confirmacion
    const url = `http://${req.headers.host}/confirmar-cuenta/${usuario.email}`;

    //enviar correo de validacion
    await enviarEmail.enviarEmail({
      usuario,
      url,
      subject: "Confirma tu cuenta de Meeti",
      archivo: "confirmar-cuenta",
    });

    req.flash("exito", "Hemos enviado un email, confirma tu cuenta");
    res.redirect("/iniciar-sesion");
    // console.log(usuarioNuevo);
  } catch (error) {
    const erroresSequelize = error.errors.map((error) => {
      return error.message;
    });
    const errExp = errores.errors.map((error) => {
      return error.msg;
    });
    const listaErrores = [...erroresSequelize, ...errExp];
    // console.log(listaErrores);
    req.flash("error", listaErrores);
    res.redirect("/crear-cuenta");
  }
};

exports.formIniciarSesion = (req, res) => {
  res.render("iniciar-sesion", { nombrePagina: "Iniciar Sesion" });
};

exports.confirmarCuenta = async (req, res, next) => {
  const usuario = await Usuarios.findOne({
    where: {
      email: req.params.correo,
    },
  });
  console.log(usuario);
  if (!usuario) {
    req.flash("error", "No existe esa cuenta");
    res.redirect("/crear-cuenta");
    return next();
  }
  usuario.activo = 1;
  await usuario.save();

  req.flash("exito", "La cuenta se ha confirmado, ya puedes iniciar sesion");
  res.redirect("/iniciar-sesion");
};
