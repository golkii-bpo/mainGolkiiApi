var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const ObjectId = (require('mongoose')).Types.ObjectId, permisoMdl = require('./permisoModel'), colMdl = require('../colaboradores/general/colaborador.model'), cargoMdl = require('../cargo/cargoModel'), permisoSrv = require('./permisoServices'), msgHandler = require('../../helpers/msgHandler'), Task = (require('../../db/transactions')).Task();
// let 
//     Task = new Fawn.Task();
module.exports = {
    /**
     *  Método que devuelve todos los permisos activos
     *
     * @param {*} req
     * @param {*} res
     * @returns Array<permisoModel>
     */
    getBuscar: (req, res) => __awaiter(this, void 0, void 0, function* () {
        yield permisoMdl
            .find({ Estado: true })
            .select({
            Descripcion: true,
            Area: true,
            Tree: true,
            Path: true,
            IsTag: true,
            Titulo: true
        })
            .lean(true)
            .then((data) => { return res.json(msgHandler.sendValue(data)); })
            .catch((err) => { return res.status(400).json(msgHandler.sendError(err)); });
    }),
    /**
     * Devuelve todos los permisos
     *
     * @param {*} req
     * @param {*} res
     * @returns Array<permisoModel>
     */
    getBuscarAll: (req, res) => __awaiter(this, void 0, void 0, function* () {
        yield permisoMdl
            .find()
            .lean(true)
            .then((data) => { return res.json(msgHandler.sendValue(data)); })
            .catch((err) => { return res.status(400).json(msgHandler.sendError(err)); });
    }),
    /**
     * Metodo que permíte buscar un permiso por su Id
     *
     * @param {*} req
     * @param {*} res
     * @returns permisoModel
     */
    getBuscarById: (req, res) => __awaiter(this, void 0, void 0, function* () {
        const id = req.params.idPermiso;
        yield permisoMdl
            .find({ _id: id, Estado: true })
            .select({
            Descripcion: true,
            Area: true,
            Tree: true,
            Path: true
        })
            .lean(true)
            .then((data) => { return res.json(msgHandler.sendValue(data)); })
            .catch((err) => { return res.status(400).json(msgHandler.sendError(err)); });
    }),
    /**
     * Método que agrega un permiso a la base de datos
     *
     * @param {*} req
     * @param {*} res
     * @returns permisoModel
     */
    postAgregar: (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { error, value } = yield permisoSrv.validarModelo(req.body);
        if (error)
            return res.status(400).json(msgHandler.sendError(error));
        yield permisoMdl
            .create(value)
            .then((data) => { return res.json(msgHandler.sendValue(data)); })
            .catch((err) => { return res.status(400).sendError(err); });
    }),
    /**
     * Método que modifica un modelo de Permiso
     *
     * @param {*} req
     * @param {*} res
     * @returns permisoModel
     */
    putModificar: (req, res) => __awaiter(this, void 0, void 0, function* () {
        if (!req.params.hasOwnProperty('idPermiso'))
            return res.status(400).json(msgHandler.sendError('La propiedad idPermiso no ha sido especificada'));
        const _idPermiso = req.params.idPermiso;
        if (!permisoSrv.validarObjectId(_idPermiso))
            return res.status(400).json(msgHandler.sendError('El id ingresado no cumple con el formato requerido'));
        const { error, value } = yield permisoSrv.validarModelo(req.body);
        if (error)
            return res.status(400).json(msgHandler.sendValue(error));
        yield permisoMdl
            .updateOne({ id: _idPermiso }, {
            $set: {
                Titulo: value.Titulo,
                Descripcion: value.Descripcion,
                Area: value.Area,
                Titulo: value.Titulo,
                Tree: value.Tree,
                Path: value.Path,
                FechaModificacion: Date.now()
            }
        })
            .then((data) => { return res.json(msgHandler.resultCrud(data, 'Permiso', 'Actualizar')); })
            .catch((err) => { return res.status(400).json(msgHandler.sendError(err)); });
    }),
    /**
     *
     * Método que da de baja a un permiso
     *
     * @param {*} req
     * @param {*} res
     * @returns permisoModel
     */
    putDarBaja: (req, res) => __awaiter(this, void 0, void 0, function* () {
        if (!req.params.hasOwnProperty('idPermiso'))
            return res.status(400).json(msgHandler.sendError('La propiedad idPermiso no ha sido especificada'));
        const _idPermiso = req.params.idPermiso;
        if (!permisoSrv.validarObjectId(_idPermiso))
            return res.status(400).json(msgHandler.sendError('El id ingresado no cumple con el formato requerido'));
        const Permiso = yield permisoMdl.findOne({ _id: _idPermiso });
        Permiso.set({
            Estado: false
        });
        yield permisoMdl
            .updateOne({
            _id: _idPermiso
        }, {
            $set: {
                Estado: false
            }
        })
            .then((data) => { return res.json(msgHandler.resultCrud(data, 'Permiso', 'Actualizar')); })
            .catch((err) => { return res.status(400).sendError(err); });
    }),
    /**
     * Método que da de alta a un permiso
     *
     * @param {*} req
     * @param {*} res
     * @returns permisoModel
     */
    putDarAlta: (req, res) => __awaiter(this, void 0, void 0, function* () {
        if (!req.params.hasOwnProperty('idPermiso'))
            return res.status(400).json(msgHandler.sendError('La propiedad idPermiso no ha sido especificada'));
        const id = req.params.idPermiso;
        if (!permisoSrv.validarObjectId(id))
            return res.status(400).json(msgHandler.sendError('El id ingresado no cumple con el formato requerido'));
        yield permisoMdl
            .updateOne({ _id: id }, {
            $set: {
                Estado: true
            }
        })
            .then((data) => { return res.json(msgHandler.resultCrud(data, 'Permisos', 'Actualizar')); })
            .catch((err) => { return res.status(400).json(msgHandler.sendError(err)); });
    }),
    /**
     * Procedimiento que permite dar de baja a un Permiso
     *
     * @param {*} req
     * @param {*} res
     * @returns
     */
    delPermiso: (req, res) => __awaiter(this, void 0, void 0, function* () {
        if (!permisoSrv.validarObjectId(req.params.idPermiso))
            return res.status(400).json(msgHandler.errorIdObject('IdPermiso'));
        const _idPermiso = new ObjectId(req.params.idPermiso);
        Task
            .remove(permisoMdl, { _id: _idPermiso })
            .update(colMdl, { 'Permisos.IdPermiso': { $eq: _idPermiso } }, { $pull: { Permisos: { IdPermiso: _idPermiso } } })
            .update(cargoMdl, { 'Permisos.IdPermiso': { $eq: _idPermiso } }, { $pull: { Permisos: { IdPermiso: _idPermiso } } });
        Task
            .run({ useMongoose: true })
            .then((data) => { return res.json(msgHandler.sendValue(data)); })
            .catch((err) => { return res.status(400).json(msgHandler.sendError(err)); });
    })
};
