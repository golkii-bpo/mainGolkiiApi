const 
    bcrypt = require('bcrypt'),
    UsrSrv = require('./user.services'),
    ColMdl = require('../general/colaborador.model'),
    msgHandler = require('../../../helpers/msgHandler');

module.exports = {
    postAgregarPublic: async (req,res) => {
        if(!UsrSrv.validarObjectId(req.params.idColaborador)) return msgHandler.errorIdObject('Id Colaborador')
        const 
            idColaborador = req.params.idColaborador,
            {error,value} = await UsrSrv.valAgregar(req.body);

        if(error) return res.status(400).json(msgHandler.sendError(error));

        const
            pwdSalt = await bcrypt.genSaltSync(10),
            pwdCrypted = await bcrypt.hashSync(value.password,pwdSalt);

        await
        ColMdl
        .updateOne(
            {
                _id:idColaborador
            },
            {
                $set:{
                    User:{
                        User:value.User,
                        password: pwdCrypted,
                        IsCreated:true
                    }
                }
            }
        )
        .then((data)=>{
            return res.json(msgHandler.resultCrud(data,'Usuario','actualización'))
        })
        .catch((err)=>{
            return res.status(400).json(msgHandler.sendError(err));
        })
    }
}