'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var librosRevistasSchema = new Schema({
    tipo: String,
    autor: String,
    titulo: String,
    edicion: String,
    descripcion: String,
    temas: [],
    copias: Number,
    disponibles: Number,
    palabras_clave: [],
    ejemplares: Number,
    frecuencia: String
})

module.exports = mongoose.model('librosRevistas', librosRevistasSchema);