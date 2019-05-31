import * as Config from 'config';

export const Rutas = {
    maxData:1000
}, 
SettingsToken = {
    privateKey:Config["PRIVATEKEY"],
    validTimeToken:1800000
},
App = {
    host:"http://golkiibpo.com",
    port:3000,
    hostUrl: function(){
        return `${this.host}:${this.port}`
    }
}