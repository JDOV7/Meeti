const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const router = require("./routes/index");
const db = require("./config/db");
const passport = require("./config/passport");

require("./models/Usuarios");
require("./models/Categorias");
require("./models/Grupos");
require("./models/Meeti");

//configuracion y modelos de la bd
try {
  db.authenticate();
  db.sync();
  console.log("conexion correcta a la db");
} catch (error) {
  console.log(error);
}

//variables de desarrollo
require("dotenv").config({ path: "variables.env" });

//app principal
const app = express();

//body parser, leer forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//hablitar ejs como template engine
app.use(expressLayouts);
app.set("view engine", "ejs");

//ubicacion vistas
app.set("views", path.join(__dirname, "./views"));

//archivos estaticos
app.use(express.static("public"));

//habiitar cookie parser
app.use(cookieParser());

//crear sesion
app.use(
  session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    // store: MongoStore.create({ mongoUrl: process.env.DATABASE }),
  })
);

//inicilizar passport
app.use(passport.initialize());
app.use(passport.session());

//agrega flash messages
app.use(flash());

//middleware propio (usuarios logueado, flash messages, fecha actual)
app.use((req, res, next) => {
  res.locals.mensajes = req.flash();
  const fecha = new Date();
  res.locals.year = fecha.getFullYear();
  next();
});

//routing
app.use("/", router());

//agrega el puerto
app.listen(process.env.PORT, () => {
  console.log("El servido esta funcionando");
});
