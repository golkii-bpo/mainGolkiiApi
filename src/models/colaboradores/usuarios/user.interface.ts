import { Session } from "inspector";

export interface IRecovery {
    IpSend:string,
    EmailSend:string,
    Solicitud:boolean,
    Token:string
}

export interface ISession{
    DateSession:string,
    IpSession:string,
    Token:string,
    LastUserCall:Date
}

export interface IUser {
    username:string,
    password:string,
    Recovery:IRecovery,
    Session?:ISession,
    IsCreated:boolean,
    Disable:boolean,
    FechaModificacion:Date
}

export interface iUserName {
    username:string
}

export interface IAuth extends iUserName {
    password:string,
    forceSession?:boolean
}

export interface iChangeUsername{
    OldUser:string,
    NewUser:string
}

export interface iChangePwd{
    username:string,
    OldPwd:string,
    NewPwd:string
}

export interface IPwdReset{
    Email:string
}

export interface IPwdChange{
    Token:string,
    Pwd:string,
    PwdConfirm:string,
    idColaborador?:string
}

export interface iUserDisable extends iUserName{}