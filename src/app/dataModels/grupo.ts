export class Grupo{
    _id?:String
    tipo?:String
    color?: String
    colorTexto?: String
    permisos?: PermisoG[]
}


export class PermisoG{
    _id?:String
    idPermiso?:String
    nombre?:String
    estado?:boolean
}
