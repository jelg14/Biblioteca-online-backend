'use strict'
var express = require("express");
var lYr = require("../controllers/libros_y_revistasController");
var md_auth = require("../middlewares/Authenticated");

var api = express.Router();
api.post("/agregarLibroORevista", md_auth.ensureAuth, lYr.agregar);
api.put("/editarLibroORevista/:id", md_auth.ensureAuth, lYr.editar);
api.delete("/eliminarLibroORevista/:id", md_auth.ensureAuth, lYr.eliminar);
api.get("/BusquedaLibroORevistaPorId/:id", md_auth.ensureAuth, lYr.buscar_por_id);
api.get("/BusquedaLibroORevistaPorTitulo/:titulo", md_auth.ensureAuth, lYr.buscar_por_titulo);
api.get("/BusquedaLibroORevistaPorAutor/:autor", md_auth.ensureAuth, lYr.buscar_por_autor);
api.get("/BusquedaLibroORevistaPorPalabrasClave/:palabrasClave", md_auth.ensureAuth, lYr.buscar_palabras_clave);
api.get("/BusquedaLibroORevistaPorTemas/:temas", md_auth.ensureAuth, lYr.buscar_por_temas);
api.put("/prestamo/:id", md_auth.ensureAuth, lYr.prestarLibroOrevista);
api.put("/devolucion/:idLibro", md_auth.ensureAuth, lYr.devolverLibroOrevista);
module.exports = api;