import * as express from 'express';
import {permisosRouter} from '../models/permisos/permisoRouter';
import {cargoRouter} from '../models/cargo/cargoRouter';
import {areaRouter} from '../models/area/areaRouter';
import {colaboradorRouter} from '../models/colaboradores/colaboradores.router';
import {rutaRoutes} from '../models/rutas/rutas.route';

const mainRoute = express.Router();

mainRoute.use('/area',areaRouter);
mainRoute.use('/permiso',permisosRouter);
mainRoute.use('/cargo',cargoRouter);
mainRoute.use('/colaborador',colaboradorRouter);
mainRoute.use('/rutas',rutaRoutes);
export {mainRoute};
