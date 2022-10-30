const {response}=require('express');
const {validationResult}=require('express-validator');

const validarCampos = (req, res=response, next) => {

    //Manejo de errores
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
        });
    }

    next();
    //next: Función que se debe llamar si todo el middleware se ejecuta correctamente
    //Después de cada check en auth.js/routes, se llama el next, y hace que pase al siguiente check, y como ya no hay más middlewares ó->
    //checks, el next sería el controlador propiamente osea: crearUsuario de auth.js/routes
}


module.exports={
    validarCampos
}