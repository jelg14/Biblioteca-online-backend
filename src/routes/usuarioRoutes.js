'use strict'
var express = require("express");
var usuarioController = require("../controllers/usuarioController");
var md_auth = require("../middlewares/Authenticated");

var api = express.Router();
api.post("/registrar", md_auth.ensureAuth, usuarioController.registrar);
api.post("/crearAdmin", usuarioController.admin);
api.get("/login", usuarioController.login);
api.put("/editarUsuario/:id", md_auth.ensureAuth, usuarioController.editar);
api.get("/mostrarUsuarios", md_auth.ensureAuth, usuarioController.listar);
api.delete("/eliminarUsuario/:id", md_auth.ensureAuth, usuarioController.eliminar);
module.exports = api;