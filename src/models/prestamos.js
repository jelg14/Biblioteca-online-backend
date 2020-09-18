'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PrestamosSchema = new Schema({
    Prestamos: [],
    CantidadDisponible: Number,
    id: { type: Schema.ObjectId, ref: 'user' },
    usuario: String
})

module.exports = mongoose.model('Prestamos', PrestamosSchema);