'use strict'
var bcrypt = require('bcrypt-nodejs')
var Usuario = require('../models/usuario')
var jwt = require('../services/jwt')
var Prestamo = require('../models/prestamos')

// funcion para crear admin
function admin(req, res) {
    Usuario.find({}, (err, usuarios) => {
        if (err) return res.status(500).send({ message: "Error en la peticion de listar" })
        if (usuarios && usuarios.length == 0) {
            var user = new Usuario();
            user.nombre = "admin";
            user.apellido = "admin";
            user.usuario = "admin";
            user.rol = "admin";
            bcrypt.hash("admin", null, null, (err, hash) => {
                user.password = hash;

                user.save((err, usuarioGuardado) => {
                    if (err) return res.status(500).send({ message: 'Error al guardar el usuario' })
                    return res.status(200).send({ message: "administrador creado con exito" })
                })
            })

        } else {
            return res.status(500).send({ message: "Ya existe un administrador" })
        }
    })
}

//funcion de Admin
function registrar(req, res) {
    var user = new Usuario();
    var params = req.body;
    if (req.user.rol == "admin") {
        if (params.nombre && params.rol && params.password) {
            user.nombre = params.nombre
            user.apellido = params.apellido
            user.usuario = params.usuario
            user.prestamosRealizados = []
            user.limiteDeLibros = 0;
            if (params.rol == "estudiante" || params.rol == "catedratico") {
                user.rol = params.rol
                if (params.rol == "estudiante") {
                    user.carnet = params.carnet
                } else if (params.rol == "catedratico") {
                    user.cui = parmas.cui
                }
            }

            Usuario.find({ $or: [{ usuario: user.usuario }] }).exec((err, usuarios) => {
                if (err) return res.status(500).send({ message: "Error en la peticion de usuarios" })
                if (usuarios && usuarios.length >= 1) {
                    return res.status(500).send({ message: "El usuario ya existe " + user.usuario })
                } else {
                    bcrypt.hash(params.password, null, null, (err, hash) => {
                        user.password = hash;

                        user.save((err, usuarioGuardado) => {
                            if (err) return res.status(500).send({ message: 'Error al guardar el usuario' })
                            return res.status(200).send({ usuario: usuarioGuardado })
                        })
                    })
                }
            })
        } else {
            return res.status(500).send({ message: "ingrese todos los datos requeridos" })
        }
    } else {
        return res.status(500).send({ message: "No tiene permiso para agregar otro usuario" })
    }
}
//funcion de Admin
function listar(req, res) {
    if (req.user.rol == "admin") {
        Usuario.find({}, (err, usuarios) => {
            if (err) return res.status(500).send({ message: "Error en la peticion de listar" })
            if (!usuarios) return res.status(404).send({ message: "No existe ningun usuario actualmente" })
            return res.status(200).send({ Usuarios: usuarios })
        })
    } else {
        return res.status(500).send({ message: "No tiene los permisos para ver los usuarios" })
    }
}

//funcion de Ambos
function login(req, res) {
    var params = req.body
    Usuario.findOne({ usuario: params.usuario }, (err, usuario) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })
        if (usuario) {
            bcrypt.compare(params.password, usuario.password, (err, check) => {
                if (err) return res.status(500).send({ message: "Error en la peticion de desencriptacion " + err })
                if (check) {
                    return res.status(200).send({ token: jwt.createToken(usuario) })
                } else {
                    return res.status(400).send({ message: 'no se ha podido identificar el usuario ' + usuario })
                }
            })
        } else {
            return res.status(404).send({ message: "El usuario no se ha podido logear " })
        }
    })
}

//funcion de Admin
function editar(req, res) {
    if (req.user.rol == "admin") {
        var id = req.params.id;
        var params = req.body;
        Usuario.findByIdAndUpdate(id, params, { new: true }, (err, usuarioModificado) => {
            if (err) return res.status(500).send({ message: "Error en la peticion de actualizar" })
            if (!usuarioModificado) return res.status(404).send({ message: "El usuario no ha sido encontrado" })
            return res.status(200).send({ actualizado: usuarioModificado })
        })
    } else {
        return res.status(500).send({ message: "No tiene los permisos para editar a los usuarios" })
    }
}

//funcion de Admin
function eliminar(req, res) {

    if (req.user.rol == "admin") {
        var id = req.params.id;
        var params = req.body;

        Usuario.findByIdAndDelete(id, (err, usuarioEliminado) => {
            if (err) return res.status(500).send({ message: "Error en la peticion de eliminar" })
            if (!usuarioEliminado) return res.status(404).send({ message: "El usuario no ha sido encontrado" })
            return res.status(200).send({ Se_elimino_a: usuarioEliminado })
        })
    } else {
        return res.status(500).send({ message: "No tiene los permisos para eliminar al usuario" })
    }
}



module.exports = {
    registrar,
    login,
    editar,
    eliminar,
    listar,
    admin
}