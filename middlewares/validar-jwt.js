
//Para tener ayuda en la escritura ó tipado dentro de la función validarJWT se importa esto: const {response}=require('express')
//Además de esta importación también se debe agregar res=response en la función validarJWT
const {response}=require('express');

const jwt=require('jsonwebtoken');

const validarJWT=(req, res=response, next)=>{

    //x-token esta en mis headers en Postman
    const token=req.header('x-token');

    //Validamos JWT con unas funciones que ya vienen con el Paquete 'jsonwebtoken'
    //if (!token): significa si tengo null ó undefined en el token
    if(!token){
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {

        const {uid, name}=jwt.verify(
          token,
          process.env.SECRET_JWT_SEED 
        );

        //Esto es para hacer que solo aparezca el uid y name, no iat: fecha de inicio y exp: fecha de expiración
        req.uid=uid;
        req.name=name;
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token No Válido'
        });        
    }


    next();
}

module.exports={
    validarJWT
}