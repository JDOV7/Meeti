const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const usuariosController = require("../controllers/usuariosController");
const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");
const gruposController = require("../controllers/gruposController");
module.exports = function () {
  router.get("/", homeController.home);

  router.get("/crear-cuenta", usuariosController.formCrearCuenta);
  router.post("/crear-cuenta", usuariosController.crearNuevaCuenta);
  router.get("/confirmar-cuenta/:correo", usuariosController.confirmarCuenta);

  router.get("/iniciar-sesion", usuariosController.formIniciarSesion);
  router.post("/iniciar-sesion", authController.autenticarUsuario);

  router.get(
    "/administracion",
    authController.usuarioAutenticado,
    adminController.panelAdministracion
  );

  router.get(
    "/nuevo-grupo",
    authController.usuarioAutenticado,
    gruposController.formNuevoGrupo
  );

  return router;
};
