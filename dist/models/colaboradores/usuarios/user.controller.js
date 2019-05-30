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
const mongoose_1 = require("mongoose");
const settings_1 = require("../../../settings/settings");
const JWT = require("jsonwebtoken");
const msgHandler_1 = require("../../../helpers/resultHandler/msgHandler");
const pwdService_1 = require("../../../security/pwdService");
const mailTemplate_1 = require("../../../helpers/templates/mailTemplate");
const server_mail_1 = require("../../../mail/server.mail");
const colaborador_model_1 = require("../general/colaborador.model");
const user_services_1 = require("./user.services");
const user_services_2 = require("./user.services");
exports.default = {
    postAgregarUsuario: (req, res) => __awaiter(this, void 0, void 0, function* () {
        let { error, value } = yield user_services_2.default.valAgregar(req.params.idColaborador, req.body);
        if (error)
            return res.status(400).json(msgHandler_1.msgHandler.sendError(error));
        const idColaborador = new mongoose_1.Types.ObjectId(req.params.idColaborador), Crypted = pwdService_1.default.encrypPwd(value.password);
        console.log(Crypted);
        return yield colaborador_model_1.default
            .updateOne({
            _id: idColaborador,
            'User.IsCreated': false,
            Estado: true
        }, {
            $set: {
                'User.username': value.username,
                'User.password': Crypted,
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
        let { error, value } = yield user_services_2.default.valModUsr(req.params.idColaborador, req.body);
        if (error)
            return res.status(400).json(msgHandler_1.msgHandler.sendError(error));
        const idColaborador = new mongoose_1.Types.ObjectId(req.params.idColaborador.toString()), data = req.body, pwdCrypted = pwdService_1.default.encrypPwd(value.password);
        let UserData = yield colaborador_model_1.default.findById(idColaborador).lean(true);
        if (!UserData.hasOwnProperty('User'))
            throw new Error('Este modelo no se puede actualizar debido a la insuficiencia de datos del modelo');
        UserData = UserData.User;
        return yield colaborador_model_1.default
            .updateOne({
            _id: idColaborador,
            Estado: true
        }, {
            $set: {
                'User.username': value.username,
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
        let { error, value } = yield user_services_2.default.valModUsrName(req.params.idColaborador, req.body);
        if (error)
            return res.status(400).json(msgHandler_1.msgHandler.sendError(error));
        const idColaborador = new mongoose_1.Types.ObjectId(req.params.idColaborador);
        return yield colaborador_model_1.default
            .updateOne({
            _id: idColaborador,
            'User.User': value.OldUser
        }, {
            $set: {
                'User.User': value.NewUser,
                'User.FechaModificacion': Date.now()
            }
        })
            .then((data) => { return res.json(msgHandler_1.msgHandler.sendValue(data)); })
            .catch((err) => { return res.status(400).json(msgHandler_1.msgHandler.sendError(err)); });
    }),
    putChangePwd: (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { error, value } = yield user_services_2.default.valChangePwd(req.params.idColaborador, req.body);
        if (error)
            return res.status(400).json(msgHandler_1.msgHandler.sendError(error));
        let idColaborador = new mongoose_1.Types.ObjectId(req.params.idColaborador), data = value;
        return yield colaborador_model_1.default
            .updateOne({
            _id: idColaborador, 'User.username': value.username
        }, {
            $set: {
                'User.password': value.NewPwd,
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
        const { error, value } = yield user_services_2.default.valUserDisable(req.params.idColaborador, req.body);
        if (error)
            return res.status(400).json(msgHandler_1.msgHandler.sendError(error));
        const idColaborador = new mongoose_1.Types.ObjectId(req.params.idColaborador);
        return yield colaborador_model_1.default
            .updateOne({
            _id: idColaborador,
            'User.username': value.username
        }, {
            $set: {
                'User.Disable': true,
                'User.FechaModificacion': Date.now()
            }
        }).then((data) => {
            return res.json(msgHandler_1.msgHandler.sendValue(data));
        }).catch((err) => {
            return res.status(400).json(msgHandler_1.msgHandler.sendError(err));
        });
    }),
    putAbleUser: (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { error, value } = yield user_services_2.default.valUserAble(req.params.idColaborador, req.body);
        if (error)
            return res.status(400).json(msgHandler_1.msgHandler.sendError(error));
        const idColaborador = new mongoose_1.Types.ObjectId(req.params.idColaborador);
        return yield colaborador_model_1.default
            .updateOne({
            _id: idColaborador,
            'User.username': value.username
        }, {
            $set: {
                'User.Disable': false,
                'User.FechaModificacion': Date.now()
            }
        }).then((data) => {
            return res.json(msgHandler_1.msgHandler.sendValue(data));
        }).catch((err) => {
            return res.status(400).json(msgHandler_1.msgHandler.sendError(err));
        });
    }),
    postLinkResetPwd: (req, res) => __awaiter(this, void 0, void 0, function* () {
        //correo electronico => Body
        //validacion del correo electronico
        const { error, value } = yield user_services_1.default.valPwdReset(req.body);
        if (error)
            return res.status(400).json(msgHandler_1.msgHandler.errorJoi(error));
        //obtener el usuario
        const ColDb = yield colaborador_model_1.default.findOne({ "General.Email": value.Email }).lean(true), Token = JWT.sign({
            Coldt: ColDb["_id"],
            Fecha: Date.now()
        }, settings_1.SettingsToken.privateKey, {
            expiresIn: '20m'
        }), linkReset = `${settings_1.App.hostUrl()}/account/reset/${Token}`, Recovery = {
            IpSend: req.ip,
            EmailSend: ColDb.General.Email,
            Solicitud: true,
            Token: Token,
            Estado: true
        };
        //Todo se guarda en el usuario
        yield colaborador_model_1.default.updateOne({
            _id: ColDb._id
        }, {
            'User.Recovery': Recovery
        }).catch((error) => {
            return res.status(400).json(msgHandler_1.msgHandler.sendError(error.message));
        });
        //TODO: Link de cancelacion
        //Enviar mensaje por correo electronico
        return yield server_mail_1.default.sendMail({
            from: 'appgolkii@golkiibpo.com',
            to: ColDb.General.Email,
            subject: `${ColDb.General.Nombre} aquí tienes el enlace para restablecer tu contraseña!`,
            html: mailTemplate_1.mailPwdResetTemplate(linkReset, null)
        })
            .then((data) => {
            return res.json(msgHandler_1.msgHandler.sendValue(data));
        })
            .catch((err) => {
            return res.status(400).json(msgHandler_1.msgHandler.sendError(err));
        });
    }),
    postRestablecerPwd: (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { error, value } = yield user_services_1.default.valRestablecerPwd(req.body);
        return res.json(msgHandler_1.msgHandler.sendValue(value));
    })
};
