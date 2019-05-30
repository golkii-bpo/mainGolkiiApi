
export interface IRecovery {
    IpSend:string,
    EmailSend:string,
    Solicitud:boolean,
    Token:string,
    Estado:boolean
}

export interface IUser {
    username:string,
    password:string,
    Recovery:IRecovery,
    IsCreated:boolean,
    Disable:boolean,
    FechaModificacion:Date
}

export interface iUserName {
    username:string
}

export interface iUser extends iUserName{
    password:string
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
    PwdConfirm:string
}

export interface iUserDisable extends iUserName{}