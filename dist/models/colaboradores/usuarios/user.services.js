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
const joi = require("joi");
// import * as joi from 'joi-es';
const basicValidations_1 = require("../../../helpers/validation/basicValidations");
const colaborador_model_1 = require("../general/colaborador.model");
const msgHandler_1 = require("../../../helpers/resultHandler/msgHandler");
const pwdService_1 = require("../../../security/pwdService");
const objectid_1 = require("mongoose/lib/types/objectid");
//FIXME: Crear un nuevo archivo con todas las interfaces a utilizar
const joiUser = joi.object().keys({
    User: joi.string().min(5).max(20),
    password: joi.string().regex(/((?=.*[a-z])(?=.*[A-Z])(?=.*\d)).{8,}/)
}), joiChangeUserName = joi.object().keys({
    OldUser: joi.string().min(5).max(20),
    NewUser: joi.string().min(5).max(20)
}), joiChangePwd = joi.object().keys({
    User: joi.string().min(5).max(20),
    OldPwd: joi.string(),
    NewPwd: joi.string().regex(/((?=.*[a-z])(?=.*[A-Z])(?=.*\d)).{8,}/)
});
class UserSrv extends basicValidations_1.default {
    validarModelo(data) {
        //se valida el modelo si esta correcto
        var { error, value } = joi.validate(data, joiUser);
        return { error, value };
    }
    //FIXME:Validar si los métodos estan bien creados
    validarUserName(newUser, idColaborador) {
        return __awaiter(this, void 0, void 0, function* () {
            const _r = !idColaborador ?
                yield colaborador_model_1.default.findOne({ 'User:User': newUser }).lean(true) :
                yield colaborador_model_1.default.findOne({ _id: { $ne: { idColaborador } }, 'User:User': newUser }).lean(true);
            if (_r)
                return msgHandler_1.msgHandler.sendError('Usuario ya se encuentra registrado');
            return msgHandler_1.msgHandler.sendValue(true);
        });
    }
    valAgregar(idColaborador, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.validarObjectId(idColaborador))
                msgHandler_1.msgHandler.errorIdObject('Id Colaborador');
            var { error: any, value: Object } = this.validarModelo(data);
            if (error)
                return msgHandler_1.msgHandler.sendError(error);
            var { error, value } = yield this.validarUserName(data.User, null);
            if (error)
                return msgHandler_1.msgHandler.sendError(error);
            //Se valida que el usuario existe
            const ColObj = yield colaborador_model_1.default
                .findOne({ _id: idColaborador, 'User.IsCreated': false })
                .lean(true);
            if (!ColObj)
                return msgHandler_1.msgHandler.missingModelData('colaborador');
            return msgHandler_1.msgHandler.sendValue(value);
        });
    }
    valModUsr(idColaborador, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.validarObjectId(idColaborador))
                return msgHandler_1.msgHandler.errorIdObject('Id Colaborador');
            var { error: any, value: Object } = this.validarModelo(data);
            if (error)
                return { error, value: null };
            var { error, value } = yield this.validarUserName(value.User, idColaborador);
            if (error)
                return { error, value: null };
            const ColObj = yield colaborador_model_1.default
                .findOne({ _id: idColaborador, 'User.IsCreated': false })
                .lean(true);
            if (!ColObj)
                return msgHandler_1.msgHandler.missingModelData('colaborador');
            value.password = pwdService_1.default.encrypPwd(value.password);
            return { error: null, value };
        });
    }
    //FIXME: Puede validarse de alguna mejor forma
    valModUsrName(idColaborador, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error, value } = joi.validate(data, joiChangeUserName);
            if (error)
                return msgHandler_1.msgHandler.sendError(error);
            if (!this.validarObjectId(idColaborador))
                msgHandler_1.msgHandler.errorIdObject('Id Colaborador');
            return yield this.validarUserName(data.newUser, idColaborador);
        });
    }
    valChangePwd(idColaborador, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.validarObjectId(idColaborador))
                return msgHandler_1.msgHandler.errorIdObject('Id Colaborador');
            //Se valida la estructura de la data
            const { error, value } = joi.validate(data, joiChangePwd);
            if (error)
                return { error, value: null };
            const User = yield colaborador_model_1.default.aggregate([{ $match: { _id: new objectid_1.default(idColaborador), 'User.User': value.User } }, { $replaceRoot: { 'newRoot': '$User' } }]);
            if (!User)
                return msgHandler_1.msgHandler.sendError('El usuario no existe');
            if (!pwdService_1.default.comparePwd(User.password, value.OldPwd))
                return msgHandler_1.msgHandler.sendError('La contraseña ingresada es incorrecta.');
            value.NewPassword = pwdService_1.default.encrypPwd(value.NewPwd);
            return msgHandler_1.msgHandler.sendValue(value);
        });
    }
}
exports.default = new UserSrv;
