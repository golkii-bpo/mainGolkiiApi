import * as express from 'express';
const mainRoute = express.Router();

const 
    permisosRouter = require('../models/permisos/permisoRouter'),
    cargoRouter = require('../models/cargo/cargoRouter'),
    areaRouter = require('../models/area/areaRouter'),
    colaboradorRouter = require('../models/colaboradores/colaboradores.router'),
    rutaRouter = require('../models/rutas/rutas.routes');

mainRoute.use('/area',areaRouter);
mainRoute.use('/permiso',permisosRouter);
mainRoute.use('/cargo',cargoRouter);
mainRoute.use('/colaborador',colaboradorRouter);
mainRoute.use('/rutas',rutaRouter);

export = mainRoute;