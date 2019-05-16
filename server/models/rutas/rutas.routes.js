const 
    express = require('express'),
    rutaRoutes = express.Router(),
    rutasCtrl = require('./rutas.controller'),
    errorHandler = require('../../middleware/errorHandler');

module.exports = rutaRoutes;

rutaRoutes
.get('/',errorHandler(rutasCtrl.getObtener))
.get('/registros',errorHandler(rutasCtrl.getModelTotal))
.get('/:idRuta',errorHandler(rutasCtrl.getObtenerById))
.get('/:fechaInicio/:fechaFinal',errorHandler(rutasCtrl.getObtenerFecha))
.post('/',errorHandler(rutasCtrl.postAgregar))
.put('/:idRuta/Modificar',errorHandler(rutasCtrl.putModificar))
.put('/:idRuta/Alta',errorHandler(rutasCtrl.putDarAlta))
.delete('/:idRuta/Baja',errorHandler(rutasCtrl.deleteDarBaja));