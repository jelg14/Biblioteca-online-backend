'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    nombre: String,
    apellido: String,
    usuario: String,
    password: String,
    rol: String,
    carnet: String,
    cui: String,
    prestamosRealizados: [],
    limiteDeLibros: Number
});

module.exports = mongoose.model('user', UserSchema);