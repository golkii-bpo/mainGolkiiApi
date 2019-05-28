const express = require('express');
const areaRouter = express.Router();
const areaController = require('./areaController');
const errorHandler = require('../../middleware/errorHandler');

areaRouter
.get('',errorHandler(areaController.getObtener))
.get('/:IdArea',errorHandler(areaController.getBuscarById))
.post('/',errorHandler(areaController.postAgregar))
.put('/:IdArea',errorHandler(areaController.putModificar))
.put('/:IdArea/DarBaja',errorHandler(areaController.putDarBaja))
.put('/:IdArea/DarAlta',errorHandler(areaController.putDarAlta));

export default areaRouter;