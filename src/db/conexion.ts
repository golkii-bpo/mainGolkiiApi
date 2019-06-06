import * as db from 'mongoose'
import * as Path from 'path'
import chalk from 'chalk'
import * as Winston from 'winston'
const 
    Log = Winston.createLogger({
        transports:[
            new Winston.transports.File({filename:Path.join(__dirname,"../log/db.log")})
        ]
    }),
    Options:db.ConnectionOptions = { 
        useCreateIndex: true,
        useNewUrlParser: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1500,
        user:'jack',
        pass:'Admin@123'
    };

export const database = {
    /**
     * Se crea una conexion para la base de datos
     *
     * @param {Cadena de Conexion para mongodb} MongoUri
     */
    connect: (MongoUri,env) => {
        db.connect(MongoUri,Options);

        db.connection.on('connected',()=>{
            console.log('Base de datos: '+chalk.bgGreen(chalk.black(' Conectada ')));
        });
        db.connection.on('disconnected', (err) =>{
            if(env == 'development'){
                console.log('Base de datos: '+chalk.yellow('Desconectada'));
            } else {
                Log.error(err);
            }
        });
        db.connection.on('error', function(err){
            if(env == 'development'){
                console.log(`Base de datos: ${chalk.red(err)} error`);
            } else {
                Log.error(err);
            }
        });
    }
}
