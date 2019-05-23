const
    joi = require('joi'),
    // joi = require('joi-es'),
    gnralSrv = require('../../../helpers/generalValidation'),
    ColMdl = require('../general/colaborador.model'),
    msgHandler = require('../../../helpers/msgHandler'),
    pwdHandler = require('../../../security/pwdService'),
    ObjectId = require('mongoose').Types.ObjectId,
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


class UserSrv extends gnralSrv{
    validarModelo(data){
        //se valida el modelo si esta correcto
        return joi.validate(data,joiUser);
    }

    async validarUserName(newUser,idColaborador){
        const _r = 
            !idColaborador? 
                await ColMdl.findOne({'User:User':newUser}).lean(true):
                await ColMdl.findOne({_id:{$ne:{idColaborador}},'User:User':newUser}).lean(true);
        if(_r) return msgHandler.sendError('Usuario ya se encuentra registrado');
        return msgHandler.sendValue(true);
    }

    async valAgregar(idColaborador,data){
        if(!this.validarObjectId(idColaborador)) return res.status(400).json(msgHandler.errorIdObject('Id Colaborador'));

        let {error,value} = this.validarModelo(data);
        if(error) return {error};

        let {error,value} = await this.validarUserName(data.User)
        if(error) return {error};

        //Se valida que el usuario existe
        const ColObj = await 
        ColMdl
        .findOne({_id:idColaborador,'User.IsCreated':false})
        .lean(true);
        if(!ColObj) return msgHandler.missingModelData('colaborador');
        return {error:null,value};
    }

    async valModUsr(idColaborador,data){

        if(!this.validarObjectId(idColaborador)) return res.status(400).json(msgHandler.errorIdObject('Id Colaborador'));

        let {error,value} = this.validarModelo(data);
        if(error) return {error};

        let {error,value} = this.validarUserName(value.User)
         
        const ColObj = await 
        ColMdl
        .findOne({_id:idColaborador,'User.IsCreated':false})
        .lean(true);
        if(!ColObj) return msgHandler.missingModelData('colaborador');

        value.password = pwdHandler.encrypPwd(value.password);
        return {error:null,value};
    }

    //FIXME: Puede validarse de alguna mejor forma
    async valModUsrName(idColaborador,data) {
        const {error,value} = joi.validate(data,joiChangeUserName);
        if(error) return msgHandler.sendError(error);
        if(!this.validarObjectId(idColaborador)) return res.status(400).json(msgHandler.errorIdObject('Id Colaborador'));
        return await this.validarUserName(data.newUser);
    }

    async valChangePwd(idColaborador,data){
        if(!this.validarObjectId(idColaborador)) return res.status(400).json(msgHandler.errorIdObject('Id Colaborador'));
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

module.exports = new UserSrv;