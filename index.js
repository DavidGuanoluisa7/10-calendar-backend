const express=require('express');
const cors=require('cors');
const { dbConnection } = require('./database/config');

//mandamos a llamar este paquete que instalamos con npm i dotenv
//env: significa environment
require('dotenv').config();

//Crear el servidor de express
const app=express();

//Base de Datos
dbConnection();

//CORS
//cors: es un paquete para restringir ó habilitar ciertas peticiones u otras cosas, etc
//Ahora esta habilitado cors con la configuración básica
app.use(cors());

//Directorio Público
//use: en express es conocido como un middleware
app.use(express.static('public'));


//Lectura y parseo del body
app.use(express.json());



//Rutas
//auth: crear usuario, hacer el login y renew(renovación del token)
//CRUD: Eventos y Todos los procedimientos relacionados al manejo de eventos de nuestro calendario

//Rutas mismo

//require: aquí en la parte de backend ó en Node es como importar algo
//todo lo que ('./routes/auth') exporte, va a ser hablitado en esta ruta '/api/auth'
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));



//Escuchar peticiones
app.listen(process.env.PORT, ()=>{
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});



//NODE Y EXPRESS: Permiten crear los endpoints
//ENDPOINTS: Son peticiones que nosotros vamos habilitar para que los usuarios en cualquier lugar que se encuentren,->
// puedan acceder a ellas