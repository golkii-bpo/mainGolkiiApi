import * as express from 'express';
import rutasCtrl from './rutas.controller';
import errorHandler from '../../middleware/errorHandler';

const rutaRoutes = express.Router();

rutaRoutes
.get('/',errorHandler(rutasCtrl.getObtener))
.get('/registros',errorHandler(rutasCtrl.getModelTotal))
.get('/:idRuta',errorHandler(rutasCtrl.getObtenerById))
.get('/:fechaInicio/:fechaFinal',errorHandler(rutasCtrl.getObtenerFecha))
.post('/',errorHandler(rutasCtrl.postAgregar))
.put('/:idRuta/Modificar',errorHandler(rutasCtrl.putModificar))
.put('/:idRuta/Alta',errorHandler(rutasCtrl.putDarAlta))
.delete('/:idRuta/Baja',errorHandler(rutasCtrl.deleteDarBaja));

export {rutaRoutes}; 