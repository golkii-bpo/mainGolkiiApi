const 
    UsrSrv = require('./user.services'),
    ColMdl = require('../general/colaborador.model'),
    ObjectId = require('mongoose').Types.ObjectId,
    msgHandler = require('../../../helpers/msgHandler');

module.exports = {
    postAgregarUsuario: async (req,res) => {
        let {error,value} = await UsrSrv.valAgregar(idColaborador,req.body);
        if(error) return res.status(400).json(msgHandler.sendError(error));

        const idColaborador = new ObjectId(req.params.idColaborador.toString());

        await
        ColMdl
        .updateOne(
            {
                _id:idColaborador,
                'User.IsCreated':false,
                Estado:true
            },
            {
                $set:{
                    'User.User':value.User,
                    'User.password':value.password,
                    'User.IsCreated':true
                }
            }
        )
        .then((data)=>{
            return res.json(msgHandler.resultCrud(data,'Usuario','actualización'))
        })
        .catch((err)=>{
            return res.status(400).json(msgHandler.sendError(err));
        })
    },

    putModUser: async(req,res) =>{
        let {error,value} = await UsrSrv.valModUsr(idColaborador,data);
        if(error) return res.status(400).json(msgHandler.sendError(error));

        const 
            idColaborador = new ObjectId(req.params.idColaborador.toString()),
            data = req.body
            pwdSalt = await bcrypt.genSaltSync(10),
            pwdCrypted = await bcrypt.hashSync(value.password,pwdSalt);
            
        let 
            UserData = await ColMdl.findById(idColaborador).lean(true);
        if(!UserData.hasOwnProperty('User')) throw new Error('Este modelo no se puede actualizar debido a la insuficiencia de datos del modelo');
            UserData = UserData.User;

        await
        ColMdl
        .updateOne(
            {
                _id:idColaborador,
                Estado:true
            },
            {
                $set:{
                    'User.User':value.User,
                    'User.password':pwdCrypted,
                    'User.FechaModificacion':Date.now()
                },
                $push:{
                    Log:{
                        Propiedad:'User',
                        Data:{
                            User:UserData.User
                        },
                        FechaModificacion:Date.now()
                    }
                }
            }
        )
        .then((data)=>{
            return res.json(msgHandler.sendValue(data));
        })
        .catch((err)=>{
            return res.status(400).json(msgHandler.sendError(err));
        })
    },

    putModUserName: async(req,res) => {
        let {error,value} = await UsrSrv.valModUsrName(req.params.idColaborador,req.body);
        if(error) return res.status(400).json(msgHandler.sendError(error));
        
        const 
            idColaborador = new ObjectId(req.params.idColaborador),
            newUser = value.NewUser,
            oldUser = value.OldUser;

        await
        ColMdl
        .updateOne(
            {
                _id:idColaborador,
                'User.User':oldUser
            },
            {
                $set:{
                    'User.User':newUser,
                    'User.FechaModificacion':Date.now()
                }
            }
        )
        .then((data)=>{return res.json(msgHandler.sendValue(data))})
        .catch((err)=>{return res.status(400).json(msgHandler.sendError(err))});
    },

    putChangePwd: async(req,res)=>{
        const {error,value} = await UsrSrv.valChangePwd(req.params.idColaborador,req.body);
        if(error) return res.status(400).json(msgHandler.sendError(error));

        let 
            idColaborador = new ObjectId(req.params.idColaborador),
            data = value;
        
        await
        ColMdl
        .updateOne
        (
            {
                _id:idColaborador,'User.User':value.User
            },
            {
                $set:{
                    'User.password':value.NewPassword,
                    'User.FechaModificacion':Date.now()
                }
            }
        )
        .then((data)=>{
            return res.json(msgHandler.resultCrud(data,'Usuario','actualizar'));
        })
        .catch((err)=>{
            return res.status(400).json(msgHandler.sendError(err));
        })
    },

    putDisableUser: async(req,res)=>{
        return res.json(null);
    }
}