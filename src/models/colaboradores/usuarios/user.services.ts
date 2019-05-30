import * as joi from 'joi';
// import * as joi from 'joi-es';
import {Types} from 'mongoose';
import * as JWT from 'jsonwebtoken';
import {SettingsToken as Sttng}  from '../../../settings/settings';
import general from '../../../helpers/validation/basicValidations';
import ColMdl from '../general/colaborador.model';
import {iUser, iUserName, iUserDisable, IPwdReset,IPwdChange} from './user.interface';
import {msgHandler,crudType as  enumCrud,msgResult, msgCustom} from '../../../helpers/resultHandler/msgHandler';
import pwdHandler from '../../../security/pwdService';
import { Token } from 'nodemailer/lib/xoauth2';
import { type } from 'os';

//FIXME: Crear un nuevo archivo con todas las interfaces a utilizar
const
pwdRegex = new RegExp(/((?=.*[a-z])(?=.*[A-Z])(?=.*\d)).{8,}/),
joiUser = joi.object().keys({
    username: joi.string().min(5).max(20),
    password: joi.string().regex(pwdRegex)
}),
joiChangeUserName = joi.object().keys({
    OldUser: joi.string().min(5).max(20),
    NewUser: joi.string().min(5).max(20)
}),
joiChangePwd = joi.object().keys({
    username: joi.string().min(5).max(20),
    OldPwd: joi.string(),
    NewPwd: joi.string().regex(pwdRegex)
}),
joiAbleUser = joi.object().keys({
    username:joi.string()
}),
joiDisableUser = joi.object().keys({
    username:joi.string()
}),
joiReset = joi.object().keys({
    Email:joi.string().email()
}),
joiPwdReset = joi.object().keys({
    Token:joi.string(),
    Pwd:joi.string().regex(pwdRegex),
    PwdConfirm: joi.string().regex(pwdRegex)
})

class UserSrv extends general{
    valUserModel(data):msgCustom<iUser>{
        var {error,value} = joi.validate(data,joiUser);
        return {error,value};
    }

    async validarUserName(newUser:any,idColaborador:any):Promise<msgResult>{
        const _r = 
            !idColaborador? 
                await ColMdl.findOne({'User:User':newUser}).lean(true):
                await ColMdl.findOne({_id:{$ne:{idColaborador}},'User:User':newUser}).lean(true);
        if(_r) return msgHandler.sendError('Usuario ya se encuentra registrado');
        return msgHandler.sendValue(true);
    }

    async valAgregar(idColaborador,data): Promise<msgResult>{
        if(!this.validarObjectId(idColaborador)) msgHandler.errorIdObject('Id Colaborador');
        let {error,value} = this.valUserModel(data);
        if(error) return msgHandler.sendError(error);

        let _r = await this.validarUserName(value.username,null)
        if(_r.error) return msgHandler.sendError(_r.error);

        //Se valida que el usuario existe
        const ColObj = await 
        ColMdl
        .findOne({_id:idColaborador,'User.IsCreated':false})
        .lean(true);
        if(!ColObj) return msgHandler.missingModelData('colaborador');
        return <msgCustom<iUser>>msgHandler.sendValue(value);
    }

    async valModUsr(idColaborador,data):Promise<msgResult>{

        if(!this.validarObjectId(idColaborador)) return msgHandler.errorIdObject('Id Colaborador');

        var {error:any,value:Object} = this.valUserModel(data);
        if(error) return {error,value:null};
        var {error,value} = await this.validarUserName(value.User,idColaborador)
        if(error) return {error,value:null};
         
        const ColObj = await 
        ColMdl
        .findOne({_id:idColaborador,'User.IsCreated':false})
        .lean(true);
        if(!ColObj) return msgHandler.missingModelData('colaborador');

        value.password = pwdHandler.encrypPwd(value.password);
        return {error:null,value};
    }

    async valModUsrName(idColaborador:string,data):Promise<msgResult>{
        const {error,value} = joi.validate(data,joiChangeUserName);
        if(error) return msgHandler.sendError(error);
        if(!this.validarObjectId(idColaborador)) msgHandler.errorIdObject('Id Colaborador');
        return await this.validarUserName(data.newUser,idColaborador);
    }

    async valChangePwd(idColaborador,data):Promise<msgResult>{
        if(!this.validarObjectId(idColaborador)) return msgHandler.errorIdObject('Id Colaborador');
        const {error,value} = joi.validate(data,joiChangePwd);
        if(error) return {error,value:null};
        const User = await ColMdl.aggregate([{$match:{_id:new Types.ObjectId(idColaborador),'User.User':value.User}},{$replaceRoot :{'newRoot':'$User'}}]);
        if(!User) return msgHandler.sendError('El usuario no existe');
        if(!pwdHandler.comparePwd(value.password,value.OldPwd)) return msgHandler.sendError('La contraseña ingresada es incorrecta.');
        value.NewPassword = pwdHandler.encrypPwd(value.NewPwd);
        return msgHandler.sendValue(value);
    }
    
    async valUserDisable(idColaborador:string,data:Object): Promise<msgResult>{
        //Se valida si el idColaboador es un ObjectId
        if(this.validarObjectId(idColaborador)) return msgHandler.errorIdObject('idColaborador');
        
        //Se valida el Objeto si corresponde con lo que desamos
        const {error,value} = joiDisableUser.validate(data);
        if(error) return msgHandler.sendError(error);
        
        //Validamos si el usuario existe
        let User = <iUserDisable>value;
        const userExist = await ColMdl.findOne({'User.username':User.username,'User.Disable':false}).lean(true);
        if(!userExist) return msgHandler.missingModelData("usuario");

        //Si todo esta correcto devolvemos el modelo de datos del usuario
        return msgHandler.sendValue(User);
    }

    async valUserAble(idColaborador:string,data:Object): Promise<msgResult>{
        //Se valida si el idColaboador es un ObjectId
        if(this.validarObjectId(idColaborador)) return msgHandler.errorIdObject('idColaborador');
        
        //Se valida el Objeto si corresponde con lo que desamos
        const {error,value} = joiAbleUser.validate(data);
        if(error) return msgHandler.sendError(error);
        
        //Validamos si el usuario existe
        let User = <iUserDisable>value;
        const userExist = await ColMdl.findOne({'User.username':User.username,'User.Disable':false}).lean(true);
        if(!userExist) return msgHandler.missingModelData("usuario");

        //Si todo esta correcto devolvemos el modelo de datos del usuario
        return msgHandler.sendValue(User);
    }

    async valPwdReset(data:Object):Promise<msgResult>{
        //validacion de modelo de datos recibidos
        const {error,value} = joiReset.validate(data);
        if(error) return msgHandler.errorJoi(error);
        const _value = <IPwdReset>value;
        //validacion 
        const User = await ColMdl.findOne({'General.Email':_value.Email}).lean(true);
        if(!User) return msgHandler.sendError('Lo sentimos el correo electronico ingresado no se encuentra registrado.');
        
        return msgHandler.sendValue(_value); 
    }
    async valRestablecerPwd(data:Object):Promise<msgResult>{
        try {
            const pwdReset = joiPwdReset.validate(data);
            if(pwdReset.error) return msgHandler.sendError(pwdReset.error);
            const value: IPwdChange = <IPwdChange>pwdReset.value;
            let Token:object|string = JWT.verify(value.Token,Sttng.privateKey);
            // if(typeof(Token) == Object)
            if(!Token.hasOwnProperty('Coldt')) return msgHandler.sendError("Token no valido");
            let UserReq = await ColMdl.findOne({_id:Token["Coldt"]})

            //Valido que el usuario que esta pidiendo el cambio sea el indicado
            return msgHandler.sendValue(value)

        } catch (error) {
            console.log(error);
            return msgHandler.sendError(error);
        }
    }
}

export default new UserSrv;