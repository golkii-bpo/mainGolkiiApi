const 
    db = require('mongoose'),
    Path = require("path"),
    Chalk = require('chalk'),
    Winston = require('winston'),
    Log = Winston.createLogger({
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
    connect: (MongoUri,env) => {
        db.connect(MongoUri,Options);

        db.connection.on('connected',()=>{
            console.log('Base de datos: '+Chalk.bgGreen(Chalk.black('Conectada')));
        });
        db.connection.on('disconnected', (err) =>{
            if(env == 'development'){
                console.log('Base de datos: '+Chalk.yellow('Desconectada'));
            } else {
                Log.error(err);
            }
        });
        db.connection.on('error', function(err){
            if(env == 'development'){
                console.log(`Base de datos: ${Chalk.red(err)} error`);
            } else {
                Log.error(err);
            }
        });
    }
}
