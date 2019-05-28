import UsrSrv from './user.services';
import ColMdl from '../general/colaborador.model';
import ObjectId from 'mongoose/lib/types/objectid';
import * as bcrypt from 'bcrypt';
import {msgHandler,crudType as  enumCrud} from '../../../helpers/resultHandler/msgHandler';

export default {
    postAgregarUsuario: async (req,res) => {
        let {error,value} = await UsrSrv.valAgregar(req.params.idColaborador,req.body);
        if(error) return res.status(400).json(msgHandler.sendError(error));

        const 
            idColaborador = new ObjectId(req.params.idColaborador);

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
                    'User.User':value["User"],
                    'User.password':value["password"],
                    'User.IsCreated':true
                }
            }
        )
        .then((data)=>{
            return res.json(msgHandler.resultCrud(data,'Usuario',enumCrud.agregar))
        })
        .catch((err)=>{
            return res.status(400).json(msgHandler.sendError(err));
        })
    },

    putModUser: async(req,res) =>{
        let {error,value} = await UsrSrv.valModUsr(req.params.idColaborador,req.body);
        if(error) return res.status(400).json(msgHandler.sendError(error));

        const 
            idColaborador = new ObjectId(req.params.idColaborador.toString()),
            data = req.body,
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
            newUser = value["NewUser"],
            oldUser = value["OldUser"];

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
                _id:idColaborador,'User.User':value["User"]
            },
            {
                $set:{
                    'User.password':value["NewPassword"],
                    'User.FechaModificacion':Date.now()
                }
            }
        )
        .then((data)=>{
            return res.json(msgHandler.resultCrud(data,'Usuario',enumCrud.actualizar));
        })
        .catch((err)=>{
            return res.status(400).json(msgHandler.sendError(err));
        })
    },

    putDisableUser: async(req,res)=>{
        return res.json(null);
    }
}