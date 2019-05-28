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
    Options = { 
        useCreateIndex: true,
        useNewUrlParser: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1500
    };

export const database = {
    /**
     * Se crea una conexion para la base de datos
     *
     * @param {Cadena de Conexion para mongodb} MongoUri
     */
    connect: (MongoUri,env) => {
        db.connect(MongoUri,Options);

        // db.connect("mongodb://192.168.1.243:27017/GolkiiDb", {
        //     "user": "test",
        //     "pass": "Admin@123"
        // });

        db.connection.on('connected',()=>{
            console.log('Base de datos: '+chalk(chalk.black('Conectada')));
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
