"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require("mongoose");
const Path = require("path");
const chalk_1 = require("chalk");
const Winston = require("winston");
const Log = Winston.createLogger({
    transports: [
        new Winston.transports.File({ filename: Path.join(__dirname, "../log/db.log") })
    ]
}), Options = {
    useCreateIndex: true,
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1500
};
exports.database = {
    /**
     * Se crea una conexion para la base de datos
     *
     * @param {Cadena de Conexion para mongodb} MongoUri
     */
    connect: (MongoUri, env) => {
        db.connect(MongoUri, Options);
        db.connection.on('connected', () => {
            console.log('Base de datos: ' + chalk_1.default.bgGreen(chalk_1.default.black(' Conectada ')));
        });
        db.connection.on('disconnected', (err) => {
            if (env == 'development') {
                console.log('Base de datos: ' + chalk_1.default.yellow('Desconectada'));
            }
            else {
                Log.error(err);
            }
        });
        db.connection.on('error', function (err) {
            if (env == 'development') {
                console.log(`Base de datos: ${chalk_1.default.red(err)} error`);
            }
            else {
                Log.error(err);
            }
        });
    }
};
