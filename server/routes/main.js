const express = require('express');
const mainRoute = express.Router();

const permisosRouter = require('../models/permisos/permisoRouter');
const cargoRouter = require('../models/cargo/cargoRouter');
const areaRouter = require('../models/area/areaRouter');
const colaboradorRouter = require('../models/colaboradores/colaborador.Router');

mainRoute.use('/area',areaRouter);
mainRoute.use('/permiso',permisosRouter);
mainRoute.use('/cargo',cargoRouter);
mainRoute.use('/colaborador',colaboradorRouter);

module.exports = mainRoute;