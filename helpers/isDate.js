const moment=require('moment');

const isDate=(value)=>{

    //!value: pregunta si value no existe, tal vez
    if(!value){
        return false;
    }

    const fecha=moment(value);

    //isValid(): es una función propia de moment para indicar que la fecha sea válida
    if(fecha.isValid()){
        return true;
    }else{
        return false;
    }
}

module.exports={
    isDate
};














