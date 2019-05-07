const db = require('mongoose');
const Path = require("path");
const Chalk = require('chalk');
const Winston = require('winston');
const Log = Winston.createLogger({
    transports:[
        new Winston.transports.File({filename:Path.join(__dirname,"../log/db.log")})
    ]
});

const Options = { 
    useCreateIndex: true,
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1500
}

module.exports = {
    /**
     * Se crea una conexion para la base de datos
     *
     * @param {Cadena de Conexion para mongodb} MongoUri
     */
    connect: (MongoUri) => {
        db.connect(MongoUri,Options);

        db.connection.on('connected',()=>{
            console.log('Base de datos: '+Chalk.bgGreen(Chalk.black('Conectada')));
        });
        db.connection.on('disconnected', (err) =>{
            console.log(err);
            console.log('Base de datos: '+Chalk.yellow('Desconectada'));
        });
        db.connection.on('error', function(err){
            Log.error(err);
            console.log(`Base de datos: ${Chalk.red(err)} error`);
        });
    }
}
