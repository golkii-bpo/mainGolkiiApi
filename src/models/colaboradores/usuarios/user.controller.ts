import { Request, Response } from "express";
import {Types} from 'mongoose';
import {SettingsToken as Sttng,App as AppSttng}  from '../../../settings/settings';
import * as JWT from 'jsonwebtoken';
import {msgHandler,crudType as  enumCrud, msgCustom} from '../../../helpers/resultHandler/msgHandler';
import pwdSecurity from '../../../security/pwdService';
import {mailPwdResetTemplate as mailReset} from '../../../helpers/templates/mailTemplate';
import Mail,{ISendOptions} from '../../../mail/server.mail';
import ColMdl from '../general/colaborador.model';
import userServices from "./user.services";
import UsrSrv from './user.services';
import { iUser, iChangePwd, iChangeUsername, iUserDisable, IPwdReset, IRecovery } from './user.interface';
import {IColaborador} from '../general/colaborador.interface';

export default {
    postAgregarUsuario: async(req:Request,res:Response):Promise<Response> => {
        let {error,value} = <msgCustom<iUser>>await UsrSrv.valAgregar(req.params.idColaborador,req.body);
        if(error) return res.status(400).json(msgHandler.sendError(error));

        const 
            idColaborador = new Types.ObjectId(req.params.idColaborador),
            Crypted = pwdSecurity.encrypPwd(value.password);
        console.log(Crypted);

        return await
        ColMdl
        .updateOne(
            {
                _id:idColaborador,
                'User.IsCreated':false,
                Estado:true
            },
            {
                $set:{
                    'User.username':value.username,
                    'User.password':Crypted,
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

    putModUser: async(req:Request,res:Response):Promise<Response> =>{
        let {error,value} = <msgCustom<iUser>>await UsrSrv.valModUsr(req.params.idColaborador,req.body);
        if(error) return res.status(400).json(msgHandler.sendError(error));

        const 
            idColaborador = new Types.ObjectId(req.params.idColaborador.toString()),
            data = req.body,
            pwdCrypted = pwdSecurity.encrypPwd(value.password);
        let 
            UserData = await ColMdl.findById(idColaborador).lean(true);
        if(!UserData.hasOwnProperty('User')) throw new Error('Este modelo no se puede actualizar debido a la insuficiencia de datos del modelo');
            UserData = UserData.User;

        return await
        ColMdl
        .updateOne(
            {
                _id:idColaborador,
                Estado:true
            },
            {
                $set:{
                    'User.username':value.username,
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

    putModUserName: async(req:Request,res:Response):Promise<Response> => {
        let {error,value} = <msgCustom<iChangeUsername>>await UsrSrv.valModUsrName(req.params.idColaborador,req.body);
        if(error) return res.status(400).json(msgHandler.sendError(error));
        
        const idColaborador = new Types.ObjectId(req.params.idColaborador);

        return await
        ColMdl
        .updateOne(
            {
                _id:idColaborador,
                'User.User':value.OldUser
            },
            {
                $set:{
                    'User.User':value.NewUser,
                    'User.FechaModificacion':Date.now()
                }
            }
        )
        .then((data)=>{return res.json(msgHandler.sendValue(data))})
        .catch((err)=>{return res.status(400).json(msgHandler.sendError(err))});
    },

    putChangePwd: async(req:Request,res:Response):Promise<Response>=>{
        const {error,value} = <msgCustom<iChangePwd>>await UsrSrv.valChangePwd(req.params.idColaborador,req.body);
        if(error) return res.status(400).json(msgHandler.sendError(error));

        let 
            idColaborador = new Types.ObjectId(req.params.idColaborador),
            data = value;
        
        return await
        ColMdl
        .updateOne
        (
            {
                _id:idColaborador,'User.username':value.username
            },
            {
                $set:{
                    'User.password':value.NewPwd,
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

    putDisableUser: async(req:Request,res:Response):Promise<Response>=>{
        const {error,value} = <msgCustom<iUserDisable>>await UsrSrv.valUserDisable(req.params.idColaborador,req.body);
        if(error) return res.status(400).json(msgHandler.sendError(error));
        const idColaborador = new Types.ObjectId(req.params.idColaborador);
        
        return await 
        ColMdl
        .updateOne(
            {
                _id:idColaborador,
                'User.username':value.username
            },
            {
                $set:{
                    'User.Disable':true,
                    'User.FechaModificacion':Date.now()
                }
            }
        ).then((data)=>{
            return res.json(msgHandler.sendValue(data));
        }).catch((err)=>{
            return res.status(400).json(msgHandler.sendError(err));
        });
    },

    putAbleUser: async(req:Request,res:Response):Promise<Response>=>{
        const {error,value} = <msgCustom<iUserDisable>>await UsrSrv.valUserAble(req.params.idColaborador,req.body);
        if(error) return res.status(400).json(msgHandler.sendError(error));
        const idColaborador = new Types.ObjectId(req.params.idColaborador);
        
        return await
        ColMdl
        .updateOne(
            {
                _id:idColaborador,
                'User.username':value.username
            },
            {
                $set:{
                    'User.Disable':false,
                    'User.FechaModificacion':Date.now()
                }
            }
        ).then((data)=>{
            return res.json(msgHandler.sendValue(data));
        }).catch((err)=>{
            return res.status(400).json(msgHandler.sendError(err));
        });
    },

    postForggotPwd: async (req:Request,res:Response): Promise<Response> =>{
        //correo electronico => Body
        //validacion del correo electronico
        const {error,value} = <msgCustom<IPwdReset>>await userServices.valPwdReset(req.body);
        if(error) return res.status(400).json(msgHandler.errorJoi(<any>error));
        //obtener el usuario
        const ColDb = <IColaborador>await ColMdl.findOne({"General.Email":value.Email}).lean(true),
        Token:string = JWT.sign(
            {
                Coldt:ColDb["_id"],
                Fecha:Date.now()
            },
            Sttng.privateKey,
            {
                expiresIn:'20m',

            }
        ),
        linkReset:string = `${AppSttng.hostUrl()}/account/reset/${Token}`,
        Recovery:IRecovery = {
            IpSend:req.ip,
            EmailSend: ColDb.General.Email,
            Solicitud:true,
            Token:Token,
            Estado:true
        };

        //Todo se guarda en el usuario
        await ColMdl.updateOne(
            {
                _id:ColDb._id
            },
            {
                'User.Recovery':Recovery
            }
        ).catch((error:Error)=>{
            return res.status(400).json(msgHandler.sendError(error.message));
        });
        //TODO: Link de cancelacion
        //Enviar mensaje por correo electronico
        return await Mail.sendMail({
            from:'appgolkii@golkiibpo.com',
            to: ColDb.General.Email,
            subject: `${ColDb.General.Nombre} aquí tienes el enlace para restablecer tu contraseña!`,
            html: mailReset(linkReset,null)
        })
        .then((data)=>{
            return res.json(msgHandler.sendValue(data));
        })
        .catch((err)=>{
            return res.status(400).json(msgHandler.sendError(err));
        });
    },

    postRestablecerPwd: async (req:Request, res:Response):Promise<Response> =>{
        //Model Token,Pwd,PwdConfirms
        
        return null;
    }
}