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
const user_services_1 = require("./user.services");
const colaborador_model_1 = require("../general/colaborador.model");
const objectid_1 = require("mongoose/lib/types/objectid");
const bcrypt = require("bcrypt");
const msgHandler_1 = require("../../../helpers/resultHandler/msgHandler");
exports.default = {
    postAgregarUsuario: (req, res) => __awaiter(this, void 0, void 0, function* () {
        let { error, value } = yield user_services_1.default.valAgregar(req.params.idColaborador, req.body);
        if (error)
            return res.status(400).json(msgHandler_1.msgHandler.sendError(error));
        const idColaborador = new objectid_1.default(req.params.idColaborador);
        yield colaborador_model_1.default
            .updateOne({
            _id: idColaborador,
            'User.IsCreated': false,
            Estado: true
        }, {
            $set: {
                'User.User': value["User"],
                'User.password': value["password"],
                'User.IsCreated': true
            }
        })
            .then((data) => {
            return res.json(msgHandler_1.msgHandler.resultCrud(data, 'Usuario', msgHandler_1.crudType.agregar));
        })
            .catch((err) => {
            return res.status(400).json(msgHandler_1.msgHandler.sendError(err));
        });
    }),
    putModUser: (req, res) => __awaiter(this, void 0, void 0, function* () {
        let { error, value } = yield user_services_1.default.valModUsr(req.params.idColaborador, req.body);
        if (error)
            return res.status(400).json(msgHandler_1.msgHandler.sendError(error));
        const idColaborador = new objectid_1.default(req.params.idColaborador.toString()), data = req.body, pwdSalt = yield bcrypt.genSaltSync(10), pwdCrypted = yield bcrypt.hashSync(value.password, pwdSalt);
        let UserData = yield colaborador_model_1.default.findById(idColaborador).lean(true);
        if (!UserData.hasOwnProperty('User'))
            throw new Error('Este modelo no se puede actualizar debido a la insuficiencia de datos del modelo');
        UserData = UserData.User;
        yield colaborador_model_1.default
            .updateOne({
            _id: idColaborador,
            Estado: true
        }, {
            $set: {
                'User.User': value.User,
                'User.password': pwdCrypted,
                'User.FechaModificacion': Date.now()
            },
            $push: {
                Log: {
                    Propiedad: 'User',
                    Data: {
                        User: UserData.User
                    },
                    FechaModificacion: Date.now()
                }
            }
        })
            .then((data) => {
            return res.json(msgHandler_1.msgHandler.sendValue(data));
        })
            .catch((err) => {
            return res.status(400).json(msgHandler_1.msgHandler.sendError(err));
        });
    }),
    putModUserName: (req, res) => __awaiter(this, void 0, void 0, function* () {
        let { error, value } = yield user_services_1.default.valModUsrName(req.params.idColaborador, req.body);
        if (error)
            return res.status(400).json(msgHandler_1.msgHandler.sendError(error));
        const idColaborador = new objectid_1.default(req.params.idColaborador), newUser = value["NewUser"], oldUser = value["OldUser"];
        yield colaborador_model_1.default
            .updateOne({
            _id: idColaborador,
            'User.User': oldUser
        }, {
            $set: {
                'User.User': newUser,
                'User.FechaModificacion': Date.now()
            }
        })
            .then((data) => { return res.json(msgHandler_1.msgHandler.sendValue(data)); })
            .catch((err) => { return res.status(400).json(msgHandler_1.msgHandler.sendError(err)); });
    }),
    putChangePwd: (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { error, value } = yield user_services_1.default.valChangePwd(req.params.idColaborador, req.body);
        if (error)
            return res.status(400).json(msgHandler_1.msgHandler.sendError(error));
        let idColaborador = new objectid_1.default(req.params.idColaborador), data = value;
        yield colaborador_model_1.default
            .updateOne({
            _id: idColaborador, 'User.User': value["User"]
        }, {
            $set: {
                'User.password': value["NewPassword"],
                'User.FechaModificacion': Date.now()
            }
        })
            .then((data) => {
            return res.json(msgHandler_1.msgHandler.resultCrud(data, 'Usuario', msgHandler_1.crudType.actualizar));
        })
            .catch((err) => {
            return res.status(400).json(msgHandler_1.msgHandler.sendError(err));
        });
    }),
    putDisableUser: (req, res) => __awaiter(this, void 0, void 0, function* () {
        return res.json(null);
    })
};
