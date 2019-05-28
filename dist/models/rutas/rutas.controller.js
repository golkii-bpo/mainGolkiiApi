"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const rutas_model_1 = require("./rutas.model");
const rutas_services_1 = require("./rutas.services");
const msgHandler_1 = require("../../helpers/resultHandler/msgHandler");
const settings_1 = require("../../settings/settings");
exports.default = {
    /**
     * Obtiene el total de registros ingresados a la base de datos
     *
     * @param {*} req
     * @param {*} res
     */
    getModelTotal: (req, res) => __awaiter(this, void 0, void 0, function* () {
        yield rutas_model_1.default
            .find()
            .count()
            .lean(true)
            .then((data) => { return res.json(msgHandler_1.msgHandler.sendValue(data)); })
            .catch((err) => { return res.status(400).json(msgHandler_1.msgHandler.sendError(err)); });
    }),
    /**
     * Obtiene todas las rutas
     * utilizando la paginación
     *
     * @param {*} req
     * @param {*} res
     * @returns {error,value}
     */
    getObtener: (req, res) => __awaiter(this, void 0, void 0, function* () {
        let page = Number(req.query.page.toString()), size = Number(req.query.size.toString());
        page = page ? page : 1;
        /**
         * 1. Si la variable size contiene datos
         * 1.2 Entonces valida si no es mayor a la cantidad de datos que puede devolver
         * 1.2.1 Si la Cantidad es mayor entonces devuelve el numero de datos que se pueden devolver
         * 1.2.2 Si la cantidad es menor se devuelve el numero que se esta solicitando
         * 2. Si la variable size no contiene datos se devuelve la cantidad maxima de datos permitada
         */
        size = size ? size > settings_1.Rutas.maxData ? settings_1.Rutas.maxData : size : settings_1.Rutas.maxData;
        let skipData = (size * (page - 1));
        yield rutas_model_1.default
            .find()
            .select({ FechaData: false })
            .skip(skipData)
            .limit(size)
            .lean(true)
            .then((data) => { return res.json(msgHandler_1.msgHandler.sendValue(data)); })
            .catch((err) => { ; return res.status(400).json(msgHandler_1.msgHandler.sendError(err)); });
    }),
    /**
     * Obtiene todas las rutas
     * utilizando filtro de fechas
     *
     * @param {*} req
     * @param {*} res
     * @returns {error,value}
     */
    getObtenerFecha: (req, res) => __awaiter(this, void 0, void 0, function* () {
        let page = Number(req.query.page.toString()), size = Number(req.query.size.toString());
        page = page ? page : 1;
        /**
         * 1. Si la variable size contiene datos
         * 1.2 Entonces valida si no es mayor a la cantidad de datos que puede devolver
         * 1.2.1 Si la Cantidad es mayor entonces devuelve el numero de datos que se pueden devolver
         * 1.2.2 Si la cantidad es menor se devuelve el numero que se esta solicitando
         * 2. Si la variable size no contiene datos se devuelve la cantidad maxima de datos permitada
         */
        size = size ? size > settings_1.Rutas.maxData ? settings_1.Rutas.maxData : size : settings_1.Rutas.maxData;
        let skipData = (size * (page - 1));
        let _fi = Number(req.params.fechaInicio.toString()), _ff = Number(req.params.fechaFinal.toString());
        let fi = _fi ? new Date(_fi) : new Date(), ff = _ff ? new Date(_ff) : new Date();
        yield rutas_model_1.default
            .find({
            FechaSalida: {
                $lte: ff,
                $gte: fi
            }
        })
            .select({ FechaData: false })
            .skip(skipData)
            .limit(size)
            .lean(true)
            .then((data) => { return res.json(msgHandler_1.msgHandler.sendValue(data)); })
            .catch((err) => { return res.status(400).json(msgHandler_1.msgHandler.sendError(err)); });
    }),
    /**
     * Obtiene todas las rutas
     *
     * @param {*} req
     * @param {*} res
     * @returns {error,value}
     */
    getObtenerActivos: (req, res) => __awaiter(this, void 0, void 0, function* () {
        let page = Number(req.query.page.toString()), size = Number(req.query.size.toString());
        page = page ? page : 1;
        /**
         * 1. Si la variable size contiene datos
         * 1.2 Entonces valida si no es mayor a la cantidad de datos que puede devolver
         * 1.2.1 Si la Cantidad es mayor entonces devuelve el numero de datos que se pueden devolver
         * 1.2.2 Si la cantidad es menor se devuelve el numero que se esta solicitando
         * 2. Si la variable size no contiene datos se devuelve la cantidad maxima de datos permitada
         */
        size = size ? size > settings_1.Rutas.maxData ? settings_1.Rutas.maxData : size : settings_1.Rutas.maxData;
        let skipData = (size * (page - 1));
        yield rutas_model_1.default
            .find({ Estado: true })
            .select({ FechaData: false })
            .skip(skipData)
            .size(size)
            .lean(true)
            .then((data) => {
            return res.json(msgHandler_1.msgHandler.sendValue(data));
        })
            .catch((err) => {
            return res.json(msgHandler_1.msgHandler.sendError(err));
        });
    }),
    /**
     * Se obtiene una ruta en especifica por medio de un Id
     *
     * @param {*} req
     * @param {*} res
     * @returns {error,value}
     */
    getObtenerById: (req, res) => __awaiter(this, void 0, void 0, function* () {
        yield rutas_model_1.default
            .findById(req.params.idRuta.toString())
            .select({ FechaData: false })
            .lean(true)
            .then((data) => {
            return res.json(msgHandler_1.msgHandler.sendValue(data));
        })
            .catch((err) => {
            return res.status(400).json(msgHandler_1.msgHandler.sendError(err));
        });
    }),
    /**
     *  Agrega una nueva ruta
     *
     * @param {*} req
     * @param {*} res
     * @returns {error,value}
     */
    postAgregar: (req, res) => __awaiter(this, void 0, void 0, function* () {
        const _model = req.body;
        const { error, value } = rutas_services_1.rutaSrv.valPostAgregar(_model);
        if (error)
            return res.status(400).json(msgHandler_1.msgHandler.sendError(error));
        const _result = yield rutas_model_1.default.create(value);
        return res.json(msgHandler_1.msgHandler.sendError(_result));
    }),
    /**
     * Modifica generalidades de una ruta, hay que proporcionar el idRuta para poder modificar a la persona
     *
     * @param {*} req
     * @param {*} res
     * @returns {error,value}
     */
    putModificar: (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { error, value } = rutas_services_1.rutaSrv.valPutModificar(req.params.idRuta, req.body);
        if (error)
            return msgHandler_1.msgHandler.sendError(error);
        const idRuta = req.params.idRuta, model = value;
        yield rutas_model_1.default.updateOne({
            _id: idRuta
        }, {
            $set: {
                Colaborador: model.Colaborador,
                Descripcion: model.Descripcion,
                Casos: model.Casos,
                Insumo: model.Insumos,
                FechaSalida: model.FechaSalida
            }
        })
            .then((data) => {
            return res.json(msgHandler_1.msgHandler.resultCrud(data, 'rutas', msgHandler_1.crudType.actualizar));
        })
            .catch((err) => {
            return res.status(400).json(msgHandler_1.msgHandler.sendError(err));
        });
    }),
    /**
     * Da de alta a una ruta, por medio de un IdRuta
     *
     * @param {*} req
     * @param {*} res
     * @returns {error,value}
     */
    putDarAlta: (req, res) => __awaiter(this, void 0, void 0, function* () {
        //FIXME: Se tiene que modificar el retorno de la informacion.
        const idRuta = req.params.idRuta;
        //se realiza la validacion para saber si el idRuta es un ObjectId
        if (!rutas_services_1.rutaSrv.validarObjectId(idRuta))
            return res.status(400).json(msgHandler_1.msgHandler.errorIdObject('Id de Ruta'));
        yield rutas_model_1.default
            .updateOne({
            _id: idRuta
        }, {
            $set: {
                Estado: true
            }
        }).then((data) => {
            return res.json(msgHandler_1.msgHandler.resultCrud(data, 'rutas', msgHandler_1.crudType.actualizar));
        }).catch((err) => {
            return res.status(400).json(msgHandler_1.msgHandler.sendError(err));
        });
    }),
    /**
     * Da de baja a una ruta, por medio de un idRuta.
     * Si este id no es propocionado no se va a poder efectuar el cambio
     *
     * @param {*} req
     * @param {*} res
     * @returns {error,value}
     */
    deleteDarBaja: (req, res) => __awaiter(this, void 0, void 0, function* () {
        //FIXME: Se tiene que modificar el retorno de la informacion.
        const idRuta = req.params.idRuta;
        //se realiza la validacion para saber si el idRuta es un ObjectId
        if (!rutas_services_1.rutaSrv.validarObjectId(idRuta))
            return res.status(400).json(msgHandler_1.msgHandler.errorIdObject('Id de Ruta'));
        yield rutas_model_1.default
            .updateOne({
            _id: idRuta
        }, {
            $set: {
                Estado: false
            }
        }).then((data) => {
            return res.json(msgHandler_1.msgHandler.resultCrud(data, 'rutas', msgHandler_1.crudType.actualizar));
        }).catch((err) => {
            return res.status(400).json(msgHandler_1.msgHandler.sendError(err));
        });
    })
};