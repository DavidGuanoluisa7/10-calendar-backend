
//'mongoose': permite manejar de forma sencilla la comunicación entre Mongo y Node
const mongoose=require('mongoose');

const dbConnection= async() => {

    //try y catch: son indispensables para saber si mi aplicación falla
    try {

        //xq todas las 4 líneas de abajo va a retornar  un Promesa puedo utilizar un await
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex : true,
            // useFindAndModify: false,
        });

        console.log('DB Online');
        
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de inicializar DB');        
    }
}

module.exports={
    dbConnection
}