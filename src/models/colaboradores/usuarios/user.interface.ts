export interface iUserName {
    User:string
}
export interface iUser extends iUserName{
    password:string
}
export interface iputChangePwd{
    OldUser:string,
    NewUser:string
} 
