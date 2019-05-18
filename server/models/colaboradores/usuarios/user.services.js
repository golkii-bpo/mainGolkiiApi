const
    joi = require('joi'),
    // joi = require('joi-es'),
    gnralSrv = require('../../../helpers/generalValidation'),
    ColMdl = require('../general/colaborador.model'),
    msgHandler = require('../../../helpers/msgHandler');

const
    joiUser = joi.object().keys({
        userName: joi.string().min(5).max(20),
        password: joi.string().regex(/((?=.*[a-z])(?=.*[A-Z])(?=.*\d)).{8,}/)
    })

class UserSrv extends gnralSrv{
    validarModelo(data){
        //se valida el modelo si esta correcto
        return joi.validate(data,joiUser);
    }
    async valAgregar(idColaborador,data){
        const {error,value} = this.validarModelo(data);
        if(error) return {error};

        const ColObj = await ColMdl
        .findOne({_id:idColaborado,IsCreated:false})
        .lean(true);
        if(!ColObj) return msgHandler.missingModelData('colaborador');
        return {error:null,value};
    }
}

module.exports = new UserSrv;