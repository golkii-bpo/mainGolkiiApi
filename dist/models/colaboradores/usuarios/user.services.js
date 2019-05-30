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
const mongoose_1 = require("mongoose");
const JWT = require("jsonwebtoken");
const settings_1 = require("../../../settings/settings");
const basicValidations_1 = require("../../../helpers/validation/basicValidations");
const colaborador_model_1 = require("../general/colaborador.model");
const msgHandler_1 = require("../../../helpers/resultHandler/msgHandler");
const pwdService_1 = require("../../../security/pwdService");
//FIXME: Crear un nuevo archivo con todas las interfaces a utilizar
const pwdRegex = new RegExp(/((?=.*[a-z])(?=.*[A-Z])(?=.*\d)).{8,}/), joiUser = joi.object().keys({
    username: joi.string().min(5).max(20),
    password: joi.string().regex(pwdRegex)
}), joiChangeUserName = joi.object().keys({
    OldUser: joi.string().min(5).max(20),
    NewUser: joi.string().min(5).max(20)
}), joiChangePwd = joi.object().keys({
    username: joi.string().min(5).max(20),
    OldPwd: joi.string(),
    NewPwd: joi.string().regex(pwdRegex)
}), joiAbleUser = joi.object().keys({
    username: joi.string()
}), joiDisableUser = joi.object().keys({
    username: joi.string()
}), joiReset = joi.object().keys({
    Email: joi.string().email()
}), joiPwdReset = joi.object().keys({
    Token: joi.string(),
    Pwd: joi.string().regex(pwdRegex),
    PwdConfirm: joi.string().regex(pwdRegex)
});
class UserSrv extends basicValidations_1.default {
    valUserModel(data) {
        var { error, value } = joi.validate(data, joiUser);
        return { error, value };
    }
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
            let { error, value } = this.valUserModel(data);
            if (error)
                return msgHandler_1.msgHandler.sendError(error);
            let _r = yield this.validarUserName(value.username, null);
            if (_r.error)
                return msgHandler_1.msgHandler.sendError(_r.error);
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
            var { error: any, value: Object } = this.valUserModel(data);
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
            const { error, value } = joi.validate(data, joiChangePwd);
            if (error)
                return { error, value: null };
            const User = yield colaborador_model_1.default.aggregate([{ $match: { _id: new mongoose_1.Types.ObjectId(idColaborador), 'User.User': value.User } }, { $replaceRoot: { 'newRoot': '$User' } }]);
            if (!User)
                return msgHandler_1.msgHandler.sendError('El usuario no existe');
            if (!pwdService_1.default.comparePwd(value.password, value.OldPwd))
                return msgHandler_1.msgHandler.sendError('La contraseña ingresada es incorrecta.');
            value.NewPassword = pwdService_1.default.encrypPwd(value.NewPwd);
            return msgHandler_1.msgHandler.sendValue(value);
        });
    }
    valUserDisable(idColaborador, data) {
        return __awaiter(this, void 0, void 0, function* () {
            //Se valida si el idColaboador es un ObjectId
            if (this.validarObjectId(idColaborador))
                return msgHandler_1.msgHandler.errorIdObject('idColaborador');
            //Se valida el Objeto si corresponde con lo que desamos
            const { error, value } = joiDisableUser.validate(data);
            if (error)
                return msgHandler_1.msgHandler.sendError(error);
            //Validamos si el usuario existe
            let User = value;
            const userExist = yield colaborador_model_1.default.findOne({ 'User.username': User.username, 'User.Disable': false }).lean(true);
            if (!userExist)
                return msgHandler_1.msgHandler.missingModelData("usuario");
            //Si todo esta correcto devolvemos el modelo de datos del usuario
            return msgHandler_1.msgHandler.sendValue(User);
        });
    }
    valUserAble(idColaborador, data) {
        return __awaiter(this, void 0, void 0, function* () {
            //Se valida si el idColaboador es un ObjectId
            if (this.validarObjectId(idColaborador))
                return msgHandler_1.msgHandler.errorIdObject('idColaborador');
            //Se valida el Objeto si corresponde con lo que desamos
            const { error, value } = joiAbleUser.validate(data);
            if (error)
                return msgHandler_1.msgHandler.sendError(error);
            //Validamos si el usuario existe
            let User = value;
            const userExist = yield colaborador_model_1.default.findOne({ 'User.username': User.username, 'User.Disable': false }).lean(true);
            if (!userExist)
                return msgHandler_1.msgHandler.missingModelData("usuario");
            //Si todo esta correcto devolvemos el modelo de datos del usuario
            return msgHandler_1.msgHandler.sendValue(User);
        });
    }
    valPwdReset(data) {
        return __awaiter(this, void 0, void 0, function* () {
            //validacion de modelo de datos recibidos
            const { error, value } = joiReset.validate(data);
            if (error)
                return msgHandler_1.msgHandler.errorJoi(error);
            const _value = value;
            //validacion 
            const User = yield colaborador_model_1.default.findOne({ 'General.Email': _value.Email }).lean(true);
            if (!User)
                return msgHandler_1.msgHandler.sendError('Lo sentimos el correo electronico ingresado no se encuentra registrado.');
            return msgHandler_1.msgHandler.sendValue(_value);
        });
    }
    valRestablecerPwd(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pwdReset = joiPwdReset.validate(data);
                if (pwdReset.error)
                    return msgHandler_1.msgHandler.sendError(pwdReset.error);
                const value = pwdReset.value;
                const tokenVerification = JWT.verify(value.Token, settings_1.SettingsToken.privateKey);
                console.log(typeof (tokenVerification));
                value.TokenDecode = tokenVerification;
                return msgHandler_1.msgHandler.sendValue(value);
            }
            catch (error) {
                return msgHandler_1.msgHandler.sendError(error);
            }
        });
    }
}
exports.default = new UserSrv;
