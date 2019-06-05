import { Session } from "inspector";

export interface IRecovery {
    IpSend:string,
    EmailSend:string,
    Solicitud:boolean,
    Token:string
}
export interface ISession{
    DateSession:number,
    IpSession:string,
    Token:string,
    Auth:string,
    ValidToken:Date,
    validAuth:Date,
    Disable:boolean
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
export interface IUserName {
    username:string
}
export interface IUserDisable extends IUserName{}
export interface IAuth extends IUserName {
    password:string,
    forceSession?:boolean
}
export interface IChangeUsername {
    OldUser:string,
    NewUser:string
}
export interface IChangePwd{
    username:string,
    OldPwd:string,
    NewPwd:string
}
export interface IPwdReset{Email:string}
export interface IPwdChange{
    Token:string,
    Pwd:string,
    PwdConfirm:string,
    idColaborador?:string
}
export interface IToken extends Object {
    Token:string
}
export interface ITokenData extends IToken {
    IpRequest:string
}
export interface IRTokenData extends Object{
    IdCol:string,
    DCT:string,
    iat?:number,
    exp?:number
}
