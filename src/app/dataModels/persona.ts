import { Escuela } from "./escuela"
import { Grupo } from "./grupo"
import { TipoProceso } from "./tipoProceso"

export class Persona{
    _id?:String
    datoBasicoPersona?: DatoBasicoPersona
    origenPersona?: OrigenPersona
    datosLlegada?: DatosLlegada
    oracionFe?: OracionFe
    bautizmo?: Bautizmo
    escuela?: ListaEscuela
    proceso?: ListaProceso
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

export class OrigenPersona{
    nombreIglesiaOrigen?: String
    cargoEjercido?:String 
    tiempoPermanencia?:number
}

export class DatosLlegada {
    fechaLlegada?: Date
    InvitadoPor?: String
    actividadLlegada?: String
}


export class OracionFe {
    oracionFe?: boolean
    fecha?: Date
    lugar?: String
    responsable?: String
}

export class Bautizmo {
    bautizmo?: boolean
    fecha?: Date
    lugar?: String
    responsable?: String
}


export class ListaEscuela {
    escuelas?: Escuela[]
}

export class ListaProceso {
    procesos?: TipoProceso[]
}

export class ListaGrupo {
    grupos?: Grupo[]
}


