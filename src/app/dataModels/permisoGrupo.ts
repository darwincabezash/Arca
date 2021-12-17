export class PermisoGrupo{
    _idGrupo!: String
    nombre?:String
    listaIdPermisos!: ObjPermisos[]
}

export class ObjPermisos{
    id!:String
    nombre?:String
    estado?:Boolean
}
