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

exports.formEditarPerfil = async (req, res) => {
  const usuario = await Usuarios.findByPk(req.user.id);
  res.render("editar-perfil", {
    nombrePagina: `Editar Perfil`,
    usuario,
  });
};

exports.editarPerfil = async (req, res) => {
  const usuario = await Usuarios.findByPk(req.user.id);

  const { nombre, descripcion, email } = req.body;
  usuario.nombre = nombre;
  usuario.descripcion = descripcion;
  usuario.email = email;

  await usuario.save();

  req.flash("exito", "Cambios Guardados Correctamente");
  res.redirect("/administracion");
};

exports.formCambiarPassword = (req, res) => {
  res.render("cambiar-password", {
    nombrePagina: "Cambiar Password",
  });
};

exports.cambiarPassword = async (req, res) => {
  const usuario = await Usuarios.findByPk(req.user.id);

  if (!usuario.validarPassword(req.body.anterior)) {
    req.flash("error", "El password actual es incorrecto");
    return res.redirect("/administracion");
  }
  // console.log("pasa la validacion");
  const hash = usuario.hashPassword(req.body.nuevo);
  // console.log(hash);
  usuario.password = hash;
  await usuario.save();

  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash(
      "exito",
      "Password Modificado Correctamente, vuelve a iniciar sesion"
    );
    return res.redirect("/iniciar-sesion");
  });
};
