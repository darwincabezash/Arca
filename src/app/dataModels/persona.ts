import { Seminario } from './seminarios';
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
    escuela?: ListaEscuela[]=[]
    proceso?: ListaProceso[] = []
    grupo?: ListaGrupo[]=[]
    seminario?: ListaSeminario[] = []
}

export class DatoBasicoPersona{
    
    cedula?:number
    primerNombre?:String
    segundoNombre?: String
    nombres?: String
    primerApellido?:String
    segundoApellido?: String
    apellidos?: String
    fechaNacimiento?: String
    fechaNacimientoFormateada?: String
    telefono?:number
    celular?: number
    whatsapp?: String
    direccion?:String
    email?:String
    sexo?:String
    foto?: String
    tipoPersona?: String
}

export class OrigenPersona{
    nombreIglesiaOrigen?: String
    cargoEjercido?:String 
    tiempoPermanencia?: number
    tieneCartaAutorizacion?: boolean
}

export class DatosLlegada {
    fechaLlegada?: Date
    invitadoPor?: String
    observacionUbicacion?: String
    actividadLlegada?: String
}


export class OracionFe {
    oracionFe?: boolean
    fechaOracionFe?: Date
    lugarOracionFe?: String
    responsableOracionFe?: String
    
}

export class Bautizmo {
    bautizmo?: boolean
    fechaBautizmo?: Date
    lugarBautizmo?: String
    responsableBautizmo?: String
}


export class ListaEscuela {
    //escuelas?: Escuela[]
    _id?: String
    tipo?: String
    color?: String
    idEscuela?: String
}

export class ListaProceso {
    //procesos?: TipoProceso[]
    _id?: String
    tipo?: String
}

export class ListaGrupo {
    //grupos?: Grupo[]
    _id?: String
    tipo?: String
    color?: String
}

export class ListaSeminario {
    //seminario?: Seminario[]
    _id?: String
    tipo?: String
    color?: String
}

