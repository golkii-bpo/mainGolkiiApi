require("dotenv").config();

const express = require('express');
const config = require("config");
const path = require("path");
const morgan = require("morgan");
const Winston = require("winston");
const helmet = require('helmet');
const logger = Winston.createLogger({
    transports:[
        new Winston.transports.File({filename:path.join(__dirname,"../log/errors.log")})
    ]
});

//inicializacion de web api
const mainRoute = require('./routes/main');
const database = require('./db/conexion');
const msgHanlder = require('./helpers/MessageToolHandler');
const app = express();

//inicialización de la base de datos
database.connect(config.get('MONGO_URI'));

//Asignación de variables
const PORT = config.PORT;

//Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

//Cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Routing
app.use('/api',mainRoute);
app.use("*",(req,res)=>{
    return res.status(404).send("La ruta indicada no se encuentra estipulada");
})

//Errors
app.use((err,req,res,next)=>{
    logger.log('error',err);
    if(err && err.hasOwnProperty('errmsg')) return res.status(400).json(msgHanlder.sendError(err.errmsg));
    if(err) return res.status(500).json(msgHanlder.sendError(err.message));
})

//inicio del servidor en un puerto
app.listen(PORT,()=>{
    if(app.get('env') == 'development'){
        console.clear();
        console.log(`Aplicación corriendo en el puerto ${PORT}`);
    }
});