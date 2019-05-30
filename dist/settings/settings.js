"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config = require("config");
exports.Rutas = {
    maxData: 1000
}, exports.SettingsToken = {
    privateKey: Config["PRIVATEKEY"]
}, exports.App = {
    host: "http://golkiibpo.com",
    port: 3000,
    hostUrl: function () {
        return `${this.host}:${this.port}`;
    }
};
