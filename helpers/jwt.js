const jwt=require('jsonwebtoken');

const generarJWT=(uid, name)=>{

    return new Promise((resolve, reject)=>{
        const payload={uid, name};

        //crear el token
        jwt.sign(payload, process.env.SECRET_JWT_SEED,{
            expiresIn: '2h'
        }, (err, token)=>{
            if(err){
                console.log(err);
                reject('No se pudo generar el token')
            }

            resolve(token);
            //El token generado ó resuelto es un string
        })
    })
}

module.exports={
    generarJWT
}











