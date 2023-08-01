const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Usuarios = require("../models/Usuarios");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, next) => {
      //se ejcuta al llenar el formulario
      const usuario = await Usuarios.findOne({ where: { email, activo: 1 } });
      if (!usuario) {
        return next(null, false, {
          message: "Ese usuario no existe, o aun no haz confirmado tu cuenta",
        });
      }
      const verificarPass = usuario.validarPassword(password);
      if (!verificarPass) {
        return next(null, false, { message: "Contraseña incorrecta" });
      }
      return next(null, usuario);
    }
  )
);

passport.serializeUser(function (usuario, cb) {
  cb(null, usuario);
});

passport.deserializeUser(function (usuario, cb) {
  cb(null, usuario);
});

module.exports = passport;
