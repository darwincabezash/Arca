export class Persona{
    _id?:String
    datoBasicoPersona?:DatoBasicoPersona
}

export class DatoBasicoPersona{
    cedula?:number
    primerNombre?:String
    segundoNombre?:String
    primerApellido?:String
    segundoApellido?:String
    fechaNacimiento?:Date
    telefono?:number
    celular?:number
    direccion?:String
    email?:String
    sexo?:String
    foto?:String
}

/*
    {{p.datoBasicoPersona.primerNombre}}

*/