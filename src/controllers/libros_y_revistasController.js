'use strict'
var LR = require('../models/libros_y_revistas')
const Usuario = require('../models/usuario');

//funcion de Admin
function agregar(req, res) {
    var lr = new LR();
    var params = req.body;

    if (req.user.rol == "admin") {
        if (params.tipo && params.autor && params.titulo && params.edicion) {
            lr.tipo = params.tipo.toUpperCase()
            if (params.tipo == "libro" || params.tipo == "revista") {
                lr.autor = params.autor
                lr.titulo = params.titulo
                lr.edicion = params.edicion
                lr.palabras_clave = params.palabras_clave
                lr.descripcion = params.descripcion
                lr.temas = params.temas
                lr.copias = params.copias
                lr.disponibles = params.disponibles
                if (params.tipo == "revista") {
                    lr.frecuencia = params.frecuencia
                    lr.ejemplares = params.ejemplares
                }
                lr.save((err, libroIngresado) => {
                    if (err) return res.status(500).send({ message: "Error al ingresar el libro" })
                    return res.status(200).send({ Libro_ingresado: libroIngresado })
                })
            } else {
                return res.status(500).send({ message: "Los tipos de documento que puede ingresar solamente son:'libro' o 'revista' " })
            }
        } else {
            return res.status(500).send({ message: "rellene todos los campos correspondientes" })
        }
    }
}
//funcion de Admin
function editar(req, res) {
    var id = req.params.id
    var params = req.body
    if (req.user.rol == "admin") {
        LR.findByIdAndUpdate(id, params, { new: true }, (err, edicionCorrecta) => {
            if (err) return res.status(500).send({ message: "Error en la peticio de edicion" })
            if (!edicionCorrecta) return res.status(404).send({ message: "El libro o revista que busca no esta disponible" })
            return res.status(200).send({ Se_edito: edicionCorrecta })
        })
    } else {
        return res.status(500).send({ message: "No tiene autorizacion para editar datos" })
    }
}

//funcion de Admin
function eliminar(req, res) {
    var params = req.body
    var id = req.params.id

    if (req.user.rol == "admin") {
        LR.findByIdAndDelete(id, (err, eliminado) => {
            if (err) return res.status(500).send({ message: "Error en la peticio de eliminacion" })
            if (!edicionCorrecta) return res.status(404).send({ message: "El libro o revista que busca no esta disponible" })
            return res.status(200).send({ Se_elimino: eliminado })
        })
    } else {
        return res.status(500).send({ message: "No tiene autorizacion para eliminar" })
    }
}

//funcion de ambos
function buscar_por_id(req, res) {
    var params = req.body
    var id = req.params.id

    LR.findById(id, (err, resultado) => {
        if (err) return res.status(500).send({ message: "Error en la peticio de busqueda" })
        if (!resultado) return res.status(404).send({ message: "El libro o revista que busca no esta disponible" })
        return res.status(200).send({ Resultado: resultado })
    })

}

//funcion de ambos
function buscar_por_titulo(req, res) {
    var params = req.body;
    var titulo = req.params.titulo;

    LR.find({ $or: [{ titulo: { $regex: titulo, $options: "i" } }] }, (err, encontrado) => {
        if (err) return res.status(500).send({ message: "Error en la peticion de busqueda" })
        if (!encontrado) return res.status(404).send({ message: "No fue posible encontrar su criterio de busqueda" })
        return res.status(200).send({ Se_encontro: encontrado })
    })
}

//funcion de ambos
function buscar_por_autor(req, res) {
    var autor = req.params.autor
    var params = req.body
    LR.find({ autor: { $regex: autor, $options: "i" } }, (err, encontrado) => {
        if (err) return res.status(500).send({ message: "Error en la peticion de busqueda" })
        if (!encontrado) return res.status(404).send({ message: "No fue posible encontrar su criterio de busqueda" })
        return res.status(200).send({ Se_encontro: encontrado })
    })
}

//funcion de usuario comun
function buscar_palabras_clave(req, res) {
    var params = req.body
    var palabras = req.params.palabrasClave

    LR.find({ palabras_clave: { $regex: palabras, $options: "i" } }, (err, encontrado) => {
        if (err) return res.status(500).save({ message: "Error en la peticion de busqueda por palabras clave" });
        if (!encontrado) return res.status(404).save({ message: "Lo que solicita no coincide con los criterios de busqueda" })
        return res.status(200).send({ Se_encontro: encontrado })
    })
}

//funcion de usuario comun
function buscar_por_temas(req, res) {
    var temas = req.params.temas
    var params = req.body
    LR.find({ temas: { $regex: temas, $options: 'i' } }, (err, encontrado) => {
        if (err) return res.status(500).save({ message: "Error en la peticion de busqueda por temas" });
        if (!encontrado) return res.status(404).save({ message: "Lo que solicita no coincide con los criterios de busqueda" })
        return res.status(200).send({ Se_encontro: encontrado })
    })
}


//funcion de usuario comun
function prestarLibroOrevista(req, res) {
    var params = req.body;
    var idUsuario = req.user.sub
    var id = req.params.id;

    Usuario.findById(idUsuario, (err, modificado) => {
        if (err) return res.status(500).send({ message: "ERROR_BusquedaUsuario: " + err })
        if (!modificado) return res.status(404).send({ message: "Usuario no identificado" })
        if (modificado.limiteDeLibros >= 10) return res.status(500).send({ message: "Ha alcanzado el limite de prestamos" })

        LR.findById(id, (err, libroModificado) => {
            if (err) return res.status(500).send({ message: "ERROR_Libros: " + err })
            if (!libroModificado) return res.status(404).send({ message: "Archivo no encontrado" });
            if (libroModificado.disponibles == 0) return res.status(500).send({ message: "No hay copias disponibles" })

            Usuario.find({ $or: [{ prestamosRealizados: libroModificado.titulo }] }).exec((err, u) => {
                if (err) return res.send({ err });
                if (u.length >= 1) {
                    return res.send({ message: "Solamente puede prestar una copia del libro" })
                } else {
                    Usuario.findByIdAndUpdate(idUsuario, { $inc: { limiteDeLibros: 1 }, $addToSet: { prestamosRealizados: libroModificado.titulo } }, { new: true }, (err, prestamoHecho) => {
                        if (err) return res.status(500).send({ message: "ERROR_Prestamo: " + err })

                        LR.findByIdAndUpdate(id, { $inc: { disponibles: -1 } }, (err, libroModificado) => {
                            if (err) return res.status(500).send({ message: "ERROR_Libros: " + err })
                            if (!libroModificado) return res.status(404).send({ message: "Archivo no encontrado" });
                            console.log(libroModificado);
                        })
                        return res.status(200).send({ Datos_del_usuario: prestamoHecho })
                    })

                }
            })

        })
    })
}

//funcion de usuario comun
function devolverLibroOrevista(req, res) {
    var params = req.body;
    var id = req.params.idLibro;

    Usuario.findById(req.user.sub, (err, usuarioLocalizado) => {
        if (err) console.log(err)
        if (!usuarioLocalizado) return res.status(404).send({ message: "Usuario no localizado" })
        LR.findById(id, (err, libro) => {
            if (err) return res.status(500).send({ ERROR: err })
            if (!libro) return res.status(404).send({ message: "documento no disponible" })
            Usuario.find({ $or: [{ prestamosRealizados: libro.titulo }] }).exec((err, u) => {
                if (err) return res.status(500).send(err)
                if (u.length == 1) {
                    LR.findByIdAndUpdate(id, { $inc: { disponibles: 1 } }, (err, devuelto) => {
                        if (err) return res.status(500).send({ message: "Error en la peticion de devolucion" })
                        Usuario.findByIdAndUpdate(req.user.sub, { $inc: { limiteDeLibros: -1 }, $pull: { prestamosRealizados: devuelto.titulo } }, { new: true }, (err, devolucionCompleta) => {
                            if (err) return res.status(500).send({ message: "Error durante la finalizacion de la devolucion" })
                            console.log("Devolucion Completada")
                            console.log(devuelto.titulo)
                            return res.status(200).send({ Datos_del_usuario: devolucionCompleta })
                        })
                    })
                } else {
                    return res.send("No se encontro el documento solicitado")
                }
            })
        })


    })
}

module.exports = {
    agregar,
    editar,
    eliminar,
    buscar_por_id,
    buscar_por_titulo,
    buscar_por_autor,
    buscar_palabras_clave,
    buscar_por_temas,
    prestarLibroOrevista,
    devolverLibroOrevista
}