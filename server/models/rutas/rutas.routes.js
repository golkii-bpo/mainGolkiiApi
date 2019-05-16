const 
    express = require('express'),
    rutaRoutes = express.Router(),
    rutasCtrl = require('./rutas.controller'),
    errorHandler = require('../../middleware/errorHandler');

module.exports = rutaRoutes;

rutaRoutes
.get('/Registros',errorHandler(rutasCtrl.getTotalRuta))
.get('/',errorHandler(rutasCtrl.getObtenerTodos))
.get('/:idRuta',errorHandler(rutasCtrl.getObtenerById))
.post('/',errorHandler(rutasCtrl.postAgregar))
.put('/:idRuta/Modificar',errorHandler(rutasCtrl.putModificar))
.put('/:idRuta/Alta',errorHandler(rutasCtrl.putDarAlta))
.delete('/:idRuta/Eliminar',errorHandler(rutasCtrl.deleteDarBaja));