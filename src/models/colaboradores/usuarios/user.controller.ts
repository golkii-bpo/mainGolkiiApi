import { Request, Response } from "express";
import {Types} from 'mongoose';
import {SettingsToken as Sttng,App as AppSttng}  from '../../../settings/settings';
import * as JWT from 'jsonwebtoken';
import {msgHandler,crudType as  enumCrud, msgCustom} from '../../../helpers/resultHandler/msgHandler';
import pwdSecurity from '../../../security/pwdService';
import {mailPwdResetTemplate as mailReset} from '../../../helpers/templates/mailTemplate';
import Mail from '../../../mail/server.mail';
import ColMdl from '../general/colaborador.model';
import userServices from "./user.services";
import { IAuth, iChangePwd, iChangeUsername, iUserDisable, IPwdReset, IRecovery,IPwdChange} from './user.interface';
import {IColaborador} from '../general/colaborador.interface';
import { date } from "joi";

export default {

    //#region Post
    postAgregarUsuario: async(req:Request,res:Response):Promise<Response> => {
        let {error,value} = <msgCustom<IAuth>>await userServices.valAgregar(req.params.idColaborador,req.body);
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

    postLinkResetPwd: async (req:Request,res:Response): Promise<Response> =>{
        //correo electronico => Body
        //validacion del correo electronico
        const {error,value} = <msgCustom<IPwdReset>>await userServices.valPwdReset(req.body);
        if(error) return res.status(400).json(msgHandler.sendError(<any>error));
        //obtener el usuario
        const ColDb = <IColaborador>await ColMdl.findOne({"General.Email":value.Email}).lean(true),
        Token:string = JWT.sign(
            {
                Coldt:ColDb["_id"],
                Fecha:Date.now()
            },
            Sttng.privateKey,
            {
                expiresIn:'20m'
            }
        ),
        linkReset:string = `${AppSttng.hostUrl()}/account/reset/${Token}`,
        Recovery:IRecovery = {
            IpSend:req.ip,
            EmailSend: ColDb.General.Email,
            Solicitud:true,
            Token:Token
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
        return await Mail.sendMail({
            from:'appgolkii@golkiibpo.com',
            to: ColDb.General.Email,
            subject: `${ColDb.General.Nombre} aquí tienes el enlace para restablecer tu contraseña!`,
            html: mailReset(linkReset)
        })
        .then((data)=>{
            return res.json(msgHandler.sendValue(data));
        })
        .catch((err)=>{
            return res.status(400).json(msgHandler.sendError(err));
        });
    },

    postRestablecerPwd: async (req:Request, res:Response):Promise<Response> =>{
        const {error,value} = <msgCustom<IPwdChange>>await userServices.valRestablecerPwd(req.body);
        if(error) return res.status(400).json(msgHandler.sendError(error));

        return await
        ColMdl.updateOne(
            {
                _id:value.idColaborador
            },
            {
                $set:{
                    'User.Recovery':null,
                    'User.password': value.Pwd,
                    'User.FechaModificacion': new Date()
                }
            }
        ).then((data)=>{
            return res.json(msgHandler.successUpdate(null));
        }).catch((err)=>{
            res.statusMessage = 'ACTUALIZADO'
            return res.status(200).json(msgHandler.sendError(err));
        });
    },

    postAuth: async (req:Request,res:Response):Promise<Response> =>{
        //validar modelo de datos user y password
        //realizar validacion si las credenciales son correctas
        const 
            data = <IAuth>req.body,
            {error,value} = <msgCustom<IColaborador>>await userServices.valAuth(data);
        if(error) return res.status(401).json(msgHandler.sendError(error));
        //crear un token
        console.log(req);
        let token = JWT.sign(
            {
                IColMdl:value._id,
                IpRequest:req.ip
            },
            Sttng.privateKey
        ), Session = {
            DateSession:Date.now(),
            IpSession:req.ip,
            Token:token,
            LastUserCall: Date.now()
        }
        //Almacenar la session del token con todo lo que piden para la session
        return await ColMdl
        .updateOne(
            {
                'User.username': data.username
            },{
                $set:{
                    'User.Session':Session
                }
            }
        )
        .then()
        .catch()
        //Se va a manejar la hora del servidor del api para poder realizar todo correctamente
        //retornar el token
        return null;
    },
    //#endregion

    //#region PUT
    putModUser: async(req:Request,res:Response):Promise<Response> =>{
        let {error,value} = <msgCustom<IAuth>>await userServices.valModUsr(req.params.idColaborador,req.body);
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
        let {error,value} = <msgCustom<iChangeUsername>>await userServices.valModUsrName(req.params.idColaborador,req.body);
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
        const {error,value} = <msgCustom<iChangePwd>>await userServices.valChangePwd(req.params.idColaborador,req.body);
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
        const {error,value} = <msgCustom<iUserDisable>>await userServices.valUserDisable(req.params.idColaborador,req.body);
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
        const {error,value} = <msgCustom<iUserDisable>>await userServices.valUserAble(req.params.idColaborador,req.body);
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
    }
    //#endregion


}