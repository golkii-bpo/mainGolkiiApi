import * as joi from 'joi';
// import * as joi from 'joi-es';
import general from '../../../helpers/validation/basicValidations';
import ColMdl from '../general/colaborador.model';
import {msgHandler,crudType as  enumCrud,msgResult} from '../../../helpers/resultHandler/msgHandler';
import pwdHandler from '../../../security/pwdService';
import ObjectId from 'mongoose/lib/types/objectid';

//FIXME: Crear un nuevo archivo con todas las interfaces a utilizar
const
    joiUser = joi.object().keys({
        User: joi.string().min(5).max(20),
        password: joi.string().regex(/((?=.*[a-z])(?=.*[A-Z])(?=.*\d)).{8,}/)
    }),
    joiChangeUserName = joi.object().keys({
        OldUser: joi.string().min(5).max(20),
        NewUser: joi.string().min(5).max(20)
    }),
    joiChangePwd = joi.object().keys({
        User: joi.string().min(5).max(20),
        OldPwd: joi.string(),
        NewPwd: joi.string().regex(/((?=.*[a-z])(?=.*[A-Z])(?=.*\d)).{8,}/)
    })


class UserSrv extends general{
    validarModelo(data):msgResult{
        //se valida el modelo si esta correcto
        var {error,value} = joi.validate(data,joiUser);
        return {error,value};
    }

    //FIXME:Validar si los métodos estan bien creados
    async validarUserName(newUser:any,idColaborador:any){
        const _r = 
            !idColaborador? 
                await ColMdl.findOne({'User:User':newUser}).lean(true):
                await ColMdl.findOne({_id:{$ne:{idColaborador}},'User:User':newUser}).lean(true);
        if(_r) return msgHandler.sendError('Usuario ya se encuentra registrado');
        return msgHandler.sendValue(true);
    }

    async valAgregar(idColaborador,data): Promise<msgResult>{
        if(!this.validarObjectId(idColaborador)) msgHandler.errorIdObject('Id Colaborador');

        var {error:any,value:Object} = this.validarModelo(data);
        if(error) return msgHandler.sendError(error);

        var {error,value} = await this.validarUserName(data.User,null)
        if(error) return msgHandler.sendError(error);

        //Se valida que el usuario existe
        const ColObj = await 
        ColMdl
        .findOne({_id:idColaborador,'User.IsCreated':false})
        .lean(true);
        if(!ColObj) return msgHandler.missingModelData('colaborador');
        return msgHandler.sendValue(value);
    }

    async valModUsr(idColaborador,data){

        if(!this.validarObjectId(idColaborador)) return msgHandler.errorIdObject('Id Colaborador');

        var {error:any,value:Object} = this.validarModelo(data);
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

    //FIXME: Puede validarse de alguna mejor forma
    async valModUsrName(idColaborador:string,data) {
        const {error,value} = joi.validate(data,joiChangeUserName);
        if(error) return msgHandler.sendError(error);
        if(!this.validarObjectId(idColaborador)) msgHandler.errorIdObject('Id Colaborador');
        return await this.validarUserName(data.newUser,idColaborador);
    }

    async valChangePwd(idColaborador,data){
        if(!this.validarObjectId(idColaborador)) return msgHandler.errorIdObject('Id Colaborador');
        //Se valida la estructura de la data
        const {error,value} = joi.validate(data,joiChangePwd);
        if(error) return {error,value:null};
        const User = await ColMdl.aggregate([{$match:{_id:new ObjectId(idColaborador),'User.User':value.User}},{$replaceRoot :{'newRoot':'$User'}}]);
        if(!User) return msgHandler.sendError('El usuario no existe');
        if(!pwdHandler.comparePwd(User.password,value.OldPwd)) return msgHandler.sendError('La contraseña ingresada es incorrecta.');
        value.NewPassword = pwdHandler.encrypPwd(value.NewPwd);
        return msgHandler.sendValue(value);
    }
}

export default new UserSrv;