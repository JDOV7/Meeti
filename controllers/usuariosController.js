const Usuarios = require("../models/Usuarios");
exports.formCrearCuenta = (req, res) => {
  res.render("crear-cuenta", { nombrePagina: "Crea tu Cuenta" });
};

exports.crearNuevaCuenta = async (req, res) => {
  try {
    const usuario = req.body;
    // console.log(usuario);
    const usuarioNuevo = await Usuarios.create(usuario);
    // console.log(usuarioNuevo);
  } catch (error) {
    const erroresSequelize = error.errors.map((error) => {
      return error.message;
    });
    console.log(erroresSequelize);
    req.flash("error", erroresSequelize);
    res.redirect("/crear-cuenta");
  }
};
