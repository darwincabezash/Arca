import { Seminario } from './../../../dataModels/seminarios';
import { TipoPersona } from './../../../dataModels/tipoPersona';
import { Injectable } from '@angular/core';
import { concatMapTo, Observable, Subject } from 'rxjs';
import { PublicInfo } from 'src/app/shared/data/publicInfo';
import { Persona, DatoBasicoPersona, OrigenPersona, DatosLlegada, OracionFe, Bautizmo, ListaEscuela, ListaProceso, ListaGrupo, ListaSeminario } from '../../../dataModels/persona';
import { GlobalDataService } from '../../../global/globalDataServices';
import { Escuela } from 'src/app/dataModels/escuela';
import { TipoProceso } from 'src/app/dataModels/tipoProceso';
import { Grupo } from 'src/app/dataModels/grupo';
import { formatDate } from '@angular/common';
import { MemoriaService } from '../../compartido/memoria.service';
import { UtilidadesService } from '../../compartido/utilidades.service';
declare var moment: any;


@Injectable({
  providedIn: 'root',
})
export class PersonaService {
  server: RequestInfo = GlobalDataService.getServer();

  //PERSONA
  private personas: Persona[];
  private personas$: Subject<Persona[]>;
  private memoriaService: MemoriaService;

  codIglesia: String | undefined;

  //ALMACENANDO TEMPORALMENTE EL CODIGO DE IGLESIAS

  resultado: any;
  constructor(private utilidadesService: UtilidadesService) {
    this.memoriaService = new MemoriaService();
    this.personas = [];
    this.personas$ = new Subject();
  }

  establecerCodIglesia(_codIglesia: String) {
    this.codIglesia = _codIglesia;
  }

  _date: any;
  //PERSONA
  public date(value: string) {
    //Create Date object from ISO string
    let date = new Date(value);
    //Get ms for date
    let time = date.getTime();
    //Check if timezoneOffset is positive or negative
    if (date.getTimezoneOffset() <= 0) {
      //Convert timezoneOffset to hours and add to Date value in milliseconds
      let final = time + Math.abs(date.getTimezoneOffset() * 60000);
      //Convert from milliseconds to date and convert date back to ISO string
      this._date = new Date(final).toISOString();
    } else {
      let final = time + -Math.abs(date.getTimezoneOffset() * 60000);
      this._date = new Date(final).toISOString();
    }
  }

  //CONSULTAR
  async consultarPersonas() {
    console.log(
      '************* CODIGO DE IGLESIA: ' +
        this.utilidadesService.obtenerCodIglesiaSesion()!
    );
    this.personas = [];

    try {
      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: `query{
              personaIglesia(input:{
                codIglesia:"${this.utilidadesService.obtenerCodIglesiaSesion()!}"}){
              _id
              codIglesia
              cedula
              primerNombre
              segundoNombre
              primerApellido
              segundoApellido
              fechaNacimiento
              telefono
              celular
              direccion
              email
              sexo
              foto
              tipoPersona
              nombreIglesiaOrigen
              cargoEjercido
              tiempoPermanencia
              tieneCartaAutorizacion
              fechaLlegada
              invitadoPor
              observacionUbicacion
              actividadLlegada
              oracionFe
              fechaOracionFe
              lugarOracionFe
              responsableOracionFe
              bautizmo
              fechaBautizmo
              lugarBautizmo
              responsableBautizmo
             
              tipoProcesos {
                _id
                tipo
              }
              grupos {
                _id
                tipo
                color
              }
              seminarios {
                _id
                tipo
                color
              }
              fechaRegistro
            }
                  }`,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log("RESULTADPO");
          console.log(result);
          this.personas = [];
          //console.log('VINE: ' + result.data.personaIglesia.length);
          //console.log('TRAE: ' + result);
          ////console.log( JSON.stringify(result));
          ////console.log(result.data);
          result.data.personaIglesia.map((el: any) => {
            //DATOS BASICOS
            let datoBasicoPersona: DatoBasicoPersona = new DatoBasicoPersona();
            datoBasicoPersona.codIglesia = el.codIglesia;
            datoBasicoPersona.cedula = el.cedula;
            datoBasicoPersona.primerNombre = el.primerNombre;
            datoBasicoPersona.segundoNombre = el.segundoNombre;
            datoBasicoPersona.nombres =
              el.primerNombre + ' ' + el.segundoNombre;
            datoBasicoPersona.primerApellido = el.primerApellido;
            datoBasicoPersona.segundoApellido = el.segundoApellido;
            datoBasicoPersona.apellidos =
              el.primerApellido + ' ' + el.segundoApellido;
            let _fecha = el.fechaNacimiento.toString() + 'T00:00:00';
            datoBasicoPersona.fechaNacimientoOriginal = el.fechaNacimiento;
            datoBasicoPersona.fechaNacimiento =
              el.fechaNacimiento !== undefined &&
              el.fechaNacimiento !== null &&
              el.fechaNacimiento !== ''
                ? new Date(_fecha).toString()
                : undefined;
            datoBasicoPersona.fechaNacimientoFormateada =
              el.fechaNacimiento !== undefined &&
              el.fechaNacimiento !== null &&
              el.fechaNacimiento !== ''
                ? this.obtenerFechaNacimintoFormateada(new Date(_fecha))
                : undefined;
            datoBasicoPersona.telefono = el.telefono;
            datoBasicoPersona.celular = el.celular;
            datoBasicoPersona.whatsapp = this.obtenerLinkWhatsApp(el.celular);
            datoBasicoPersona.direccion = el.direccion;
            datoBasicoPersona.email = el.email;
            datoBasicoPersona.sexo = el.sexo;
            datoBasicoPersona.foto = el.foto;
            datoBasicoPersona.tipoPersona = el.tipoPersona;
            datoBasicoPersona.fechaRegistro=el.fechaRegistro;

            console.log("*****ME LLEGO FECHA DE REGISTRO:   "+datoBasicoPersona.fechaRegistro);
            //ORIGEN PERSONA
            let origenPersona: OrigenPersona = new OrigenPersona();
            origenPersona.nombreIglesiaOrigen = el.nombreIglesiaOrigen;
            origenPersona.cargoEjercido = el.cargoEjercido;
            origenPersona.tiempoPermanencia = el.tiempoPermanencia;
            origenPersona.tieneCartaAutorizacion = el.tieneCartaAutorizacion;

            //DATOS LLEGADA
            let datosLlegada: DatosLlegada = new DatosLlegada();
            datosLlegada.fechaLlegada = el.fechaLlegada;
            datosLlegada.invitadoPor = el.invitadoPor;
            datosLlegada.observacionUbicacion = el.observacionUbicacion;
            datosLlegada.actividadLlegada = el.actividadLlegada;

            //ORACION FE
            let oracionFe: OracionFe = new OracionFe();
            oracionFe.oracionFe = el.oracionFe;
            oracionFe.fechaOracionFe = el.fechaOracionFe;
            oracionFe.lugarOracionFe = el.lugarOracionFe;
            oracionFe.responsableOracionFe = el.responsableOracionFe;

            //BAUTIZMO
            let bautizmo: Bautizmo = new Bautizmo();
            bautizmo.fechaBautizmo = el.fechaBautizmo;
            bautizmo.bautizmo = el.bautizmo;
            bautizmo.lugarBautizmo = el.lugarBautizmo;
            bautizmo.responsableBautizmo = el.responsableBautizmo;

            //ESCUELAS
            let escuelas: ListaEscuela[] = [];
            if (el.escuelas !== undefined) {
              el.escuelas.forEach((e: Escuela) => {
                let _escuelaTemp: Escuela = new Escuela();
                _escuelaTemp._id = e._id;
                _escuelaTemp.tipo = e.tipo;
                _escuelaTemp.color = e.color;
                _escuelaTemp.idEscuela = e.idEscuela;
                console.log('COLOR TEXTO NEGRO: ' + e.colorTextoNegro);
                _escuelaTemp.colorTextoNegro = e.colorTextoNegro;
                escuelas.push(_escuelaTemp);
              });
            }

            //PROCEOSOS
            let procesos: ListaProceso[] = [];
            el.tipoProcesos.forEach((p: TipoProceso) => {
              let _procesoTemp: TipoProceso = new TipoProceso();
              _procesoTemp._id = p._id;
              _procesoTemp.tipo = p.tipo;
              procesos.push(_procesoTemp);
            });

            //GRUPOS
            let grupos: ListaGrupo[] = [];
            el.grupos.forEach((g: Grupo) => {
              let _grupoTemp: Grupo = new Grupo();
              _grupoTemp._id = g._id;
              _grupoTemp.tipo = g.tipo;
              grupos.push(_grupoTemp);
            });

            //SEMINARIOS
            let seminarios: ListaSeminario[] = [];
            el.seminarios.forEach((s: Seminario) => {
              let _seminarioTemp: Seminario = new Seminario();
              _seminarioTemp._id = s._id;
              _seminarioTemp.tipo = s.tipo;
              _seminarioTemp.color = s.color;

              seminarios.push(_seminarioTemp);
            });

            let persona = new Persona();
            persona._id = el._id;
            persona.datoBasicoPersona = datoBasicoPersona;
            persona.origenPersona = origenPersona;
            persona.datosLlegada = datosLlegada;
            persona.oracionFe = oracionFe;
            persona.bautizmo = bautizmo;
            persona.escuela = escuelas;
            persona.proceso = procesos;
            persona.grupo = grupos;
            persona.seminario = seminarios;

            this.personas.push(persona);
            //console.log(persona.datoBasicoPersona.primerNombre);
          });
        });

      this.personas$.next(this.personas);
      //console.log('A GUARDAR A LAS PERSONAS: ' + this.personas.length);
    } catch (e) {
      console.log('ERROR: ' + e);
    }
  }

/* METODO ORIGINAL 
  async consultarPersonas() {
    console.log(
      '************* CODIGO DE IGLESIA: ' +
        this.utilidadesService.obtenerCodIglesiaSesion()!
    );
    this.personas = [];

    try {
      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: `query{
              personaIglesia(input:{
                codIglesia:"${this.utilidadesService.obtenerCodIglesiaSesion()!}"}){
              _id
              codIglesia
              cedula
              primerNombre
              segundoNombre
              primerApellido
              segundoApellido
              fechaNacimiento
              telefono
              celular
              direccion
              email
              sexo
              foto
              tipoPersona
              nombreIglesiaOrigen
              cargoEjercido
              tiempoPermanencia
              tieneCartaAutorizacion
              fechaLlegada
              invitadoPor
              observacionUbicacion
              actividadLlegada
              oracionFe
              fechaOracionFe
              lugarOracionFe
              responsableOracionFe
              bautizmo
              fechaBautizmo
              lugarBautizmo
              responsableBautizmo
              escuelas {
                _id
                tipo
                color
                idEscuela
                colorTextoNegro
              }
              tipoProcesos {
                _id
                tipo
              }
              grupos {
                _id
                tipo
                color
              }
              seminarios {
                _id
                tipo
                color
              }
              fechaRegistro
            }
                  }`,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log("RESULTADPO");
          console.log(result);
          this.personas = [];
          //console.log('VINE: ' + result.data.personaIglesia.length);
          //console.log('TRAE: ' + result);
          ////console.log( JSON.stringify(result));
          ////console.log(result.data);
          result.data.personaIglesia.map((el: any) => {
            //DATOS BASICOS
            let datoBasicoPersona: DatoBasicoPersona = new DatoBasicoPersona();
            datoBasicoPersona.codIglesia = el.codIglesia;
            datoBasicoPersona.cedula = el.cedula;
            datoBasicoPersona.primerNombre = el.primerNombre;
            datoBasicoPersona.segundoNombre = el.segundoNombre;
            datoBasicoPersona.nombres =
              el.primerNombre + ' ' + el.segundoNombre;
            datoBasicoPersona.primerApellido = el.primerApellido;
            datoBasicoPersona.segundoApellido = el.segundoApellido;
            datoBasicoPersona.apellidos =
              el.primerApellido + ' ' + el.segundoApellido;
            let _fecha = el.fechaNacimiento.toString() + 'T00:00:00';
            datoBasicoPersona.fechaNacimientoOriginal = el.fechaNacimiento;
            datoBasicoPersona.fechaNacimiento =
              el.fechaNacimiento !== undefined &&
              el.fechaNacimiento !== null &&
              el.fechaNacimiento !== ''
                ? new Date(_fecha).toString()
                : undefined;
            datoBasicoPersona.fechaNacimientoFormateada =
              el.fechaNacimiento !== undefined &&
              el.fechaNacimiento !== null &&
              el.fechaNacimiento !== ''
                ? this.obtenerFechaNacimintoFormateada(new Date(_fecha))
                : undefined;
            datoBasicoPersona.telefono = el.telefono;
            datoBasicoPersona.celular = el.celular;
            datoBasicoPersona.whatsapp = this.obtenerLinkWhatsApp(el.celular);
            datoBasicoPersona.direccion = el.direccion;
            datoBasicoPersona.email = el.email;
            datoBasicoPersona.sexo = el.sexo;
            datoBasicoPersona.foto = el.foto;
            datoBasicoPersona.tipoPersona = el.tipoPersona;
            datoBasicoPersona.fechaRegistro=el.fechaRegistro;

            console.log("*****ME LLEGO FECHA DE REGISTRO:   "+datoBasicoPersona.fechaRegistro);
            //ORIGEN PERSONA
            let origenPersona: OrigenPersona = new OrigenPersona();
            origenPersona.nombreIglesiaOrigen = el.nombreIglesiaOrigen;
            origenPersona.cargoEjercido = el.cargoEjercido;
            origenPersona.tiempoPermanencia = el.tiempoPermanencia;
            origenPersona.tieneCartaAutorizacion = el.tieneCartaAutorizacion;

            //DATOS LLEGADA
            let datosLlegada: DatosLlegada = new DatosLlegada();
            datosLlegada.fechaLlegada = el.fechaLlegada;
            datosLlegada.invitadoPor = el.invitadoPor;
            datosLlegada.observacionUbicacion = el.observacionUbicacion;
            datosLlegada.actividadLlegada = el.actividadLlegada;

            //ORACION FE
            let oracionFe: OracionFe = new OracionFe();
            oracionFe.oracionFe = el.oracionFe;
            oracionFe.fechaOracionFe = el.fechaOracionFe;
            oracionFe.lugarOracionFe = el.lugarOracionFe;
            oracionFe.responsableOracionFe = el.responsableOracionFe;

            //BAUTIZMO
            let bautizmo: Bautizmo = new Bautizmo();
            bautizmo.fechaBautizmo = el.fechaBautizmo;
            bautizmo.bautizmo = el.bautizmo;
            bautizmo.lugarBautizmo = el.lugarBautizmo;
            bautizmo.responsableBautizmo = el.responsableBautizmo;

            //ESCUELAS
            let escuelas: ListaEscuela[] = [];
            el.escuelas.forEach((e: Escuela) => {
              let _escuelaTemp: Escuela = new Escuela();
              _escuelaTemp._id = e._id;
              _escuelaTemp.tipo = e.tipo;
              _escuelaTemp.color = e.color;
              _escuelaTemp.idEscuela = e.idEscuela;
              console.log('COLOR TEXTO NEGRO: ' + e.colorTextoNegro);
              _escuelaTemp.colorTextoNegro = e.colorTextoNegro;
              escuelas.push(_escuelaTemp);
            });

            //PROCEOSOS
            let procesos: ListaProceso[] = [];
            el.tipoProcesos.forEach((p: TipoProceso) => {
              let _procesoTemp: TipoProceso = new TipoProceso();
              _procesoTemp._id = p._id;
              _procesoTemp.tipo = p.tipo;
              procesos.push(_procesoTemp);
            });

            //GRUPOS
            let grupos: ListaGrupo[] = [];
            el.grupos.forEach((g: Grupo) => {
              let _grupoTemp: Grupo = new Grupo();
              _grupoTemp._id = g._id;
              _grupoTemp.tipo = g.tipo;
              grupos.push(_grupoTemp);
            });

            //SEMINARIOS
            let seminarios: ListaSeminario[] = [];
            el.seminarios.forEach((s: Seminario) => {
              let _seminarioTemp: Seminario = new Seminario();
              _seminarioTemp._id = s._id;
              _seminarioTemp.tipo = s.tipo;
              _seminarioTemp.color = s.color;

              seminarios.push(_seminarioTemp);
            });

            let persona = new Persona();
            persona._id = el._id;
            persona.datoBasicoPersona = datoBasicoPersona;
            persona.origenPersona = origenPersona;
            persona.datosLlegada = datosLlegada;
            persona.oracionFe = oracionFe;
            persona.bautizmo = bautizmo;
            persona.escuela = escuelas;
            persona.proceso = procesos;
            persona.grupo = grupos;
            persona.seminario = seminarios;

            this.personas.push(persona);
            //console.log(persona.datoBasicoPersona.primerNombre);
          });
        });

      this.personas$.next(this.personas);
      //console.log('A GUARDAR A LAS PERSONAS: ' + this.personas.length);
    } catch (e) {
      console.log('ERROR: ' + e);
    }
  }
*/
  //CONSULTAR
  async consultarPersona(_id: String): Promise<boolean> {
    let _carga_completa = false;
    this.personas = [];

    try {
      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: `{
            persona(input:{
                  _id:"${_id}"
              }){_id
              cedula
              primerNombre
              primerApellido
              segundoApellido
              fechaNacimiento
              telefono
              celular
              direccion
              email
              sexo
              foto
            }
                  }`,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          result.data.persona.map((el: any) => {
            let datoBasicoPersona: DatoBasicoPersona = new DatoBasicoPersona();
            datoBasicoPersona.cedula = el.cedula;
            datoBasicoPersona.primerNombre = el.primerNombre;
            datoBasicoPersona.segundoNombre = el.primerNombre;
            datoBasicoPersona.primerApellido = el.primerApellido;
            datoBasicoPersona.segundoApellido = el.segundoApellido;
            datoBasicoPersona.fechaNacimiento = el.fechaNacimiento;
            datoBasicoPersona.telefono = el.telefono;
            datoBasicoPersona.celular = el.celular;
            datoBasicoPersona.direccion = el.direccion;
            datoBasicoPersona.email = el.email;
            datoBasicoPersona.sexo = el.sexo;
            datoBasicoPersona.foto = el.foto;

            let persona = new Persona();
            persona._id = el._id;
            persona.datoBasicoPersona = datoBasicoPersona;
            this.personas.push(persona);

            const myObjPersona = JSON.stringify(persona);
            localStorage.setItem('persona', myObjPersona);

            _carga_completa = true;
          });
        });
      //this.personas$.next(this.personas);
    } catch (e) {
      console.log('ERROR: ' + e);
      _carga_completa = false;
    }
    return _carga_completa;
  }

  async consultarDatosBasicosPersonas() {
    this.personas = [];
    try {
      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: `{
            personas{
              _id
              primerNombre
              primerApellido
            }
                  }`,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          result.data.personas.map((el: any) => {
            let datoBasicoPersona: DatoBasicoPersona = new DatoBasicoPersona();
            datoBasicoPersona.primerNombre = el.primerNombre;
            datoBasicoPersona.primerApellido = el.primerApellido;

            let persona = new Persona();
            persona._id = el._id;
            persona.datoBasicoPersona = datoBasicoPersona;
            //this.personas.push(persona);
          });
        });
      //this.personas$.next(this.personas);
    } catch (e) {
      console.log('ERROR: ' + e);
    }
  }

  //AGREGAR
  //async agregarPersonas(persona: Persona) {
  async agregarPersonas(persona: Persona): Promise<any> {
    let _idPersonaCreada = '';
    try {
      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            crearPersona(input:{
              codIglesia:"${persona.datoBasicoPersona?.codIglesia}"
              cedula:"${persona.datoBasicoPersona?.cedula}"
              primerNombre:"${persona.datoBasicoPersona?.primerNombre}"
              segundoNombre:"${persona.datoBasicoPersona?.segundoNombre}"
              primerApellido:"${persona.datoBasicoPersona?.primerApellido}"
              segundoApellido:"${persona.datoBasicoPersona?.segundoApellido}"
              fechaNacimiento:"${persona.datoBasicoPersona?.fechaNacimiento}"
              telefono:"${persona.datoBasicoPersona?.telefono}"
              celular:"${persona.datoBasicoPersona?.celular}"
              direccion:"${persona.datoBasicoPersona?.direccion}"
              email:"${persona.datoBasicoPersona?.email}"
              sexo:"${persona.datoBasicoPersona?.sexo}"
              foto:"${persona.datoBasicoPersona?.foto}"
              fechaRegistro:"${persona.datoBasicoPersona?.fechaRegistro}"
            }){
             _id
              cedula
            }
          }`,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          _idPersonaCreada = result.data.crearPersona._id;

          this.consultarPersonas();
        });
    } catch (e) {
      console.log('ERROR: ' + e);
    }
    return _idPersonaCreada;
  }

  //ACTUALIZAR ORIGEN PERSONA
  async actualizarOrigenPersona(
    _id: any,
    _origenPersona: OrigenPersona
  ): Promise<Boolean> {
    let retorno: Boolean = false;
    try {
      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            actualizarPersona(_id:"${_id}",
            input:{
              nombreIglesiaOrigen:"${_origenPersona.nombreIglesiaOrigen}"
              cargoEjercido:"${
                _origenPersona.cargoEjercido ? _origenPersona.cargoEjercido : ''
              }"
              tiempoPermanencia:${
                _origenPersona.tiempoPermanencia !== undefined
                  ? _origenPersona.tiempoPermanencia
                  : 0
              }
              tieneCartaAutorizacion:${
                _origenPersona.tieneCartaAutorizacion !== undefined
                  ? _origenPersona.tieneCartaAutorizacion
                  : false
              }
            }){
              _id
            }
          }`,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          //console.log(result);
          if (result.data.actualizarPersona._id.length > 0) {
            retorno = true;
          } else {
            retorno = false;
          }
        });
    } catch (e) {
      console.log('ERROR: ' + e);
      retorno = false;
    }
    return retorno;
  }

  //ACTUALIZAR ORIGEN PERSONA
  async actualizarDatosLlegada(
    _id: any,
    _datosLlegada: DatosLlegada
  ): Promise<Boolean> {
    let retorno: Boolean = false;
    try {
      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            actualizarPersona(_id:"${_id}",
            input:{
              fechaLlegada:"${
                _datosLlegada.fechaLlegada ? _datosLlegada.fechaLlegada : ''
              }"
              invitadoPor:"${
                _datosLlegada.invitadoPor ? _datosLlegada.invitadoPor : ''
              }"
              observacionUbicacion:"${
                _datosLlegada.observacionUbicacion
                  ? _datosLlegada.observacionUbicacion
                  : ''
              }"
              actividadLlegada:"${
                _datosLlegada.actividadLlegada
                  ? _datosLlegada.actividadLlegada
                  : ''
              }"
            }){
              _id
            }
          }`,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          //console.log(result);
          if (result.data.actualizarPersona._id.length > 0) {
            retorno = true;
          } else {
            retorno = false;
          }
        });
    } catch (e) {
      console.log('ERROR: ' + e);
      retorno = false;
    }
    return retorno;
  }

  //ACTUALIZAR ORACION DE FE
  async actualizarOracionFe(_id: any, _oracionFe: OracionFe): Promise<Boolean> {
    let retorno: Boolean = false;
    try {
      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            actualizarPersona(_id:"${_id}",
            input:{
              oracionFe: ${
                _oracionFe.oracionFe !== undefined
                  ? _oracionFe.oracionFe
                  : false
              }
              fechaOracionFe: "${
                _oracionFe.fechaOracionFe !== undefined
                  ? _oracionFe.fechaOracionFe
                  : ''
              }"
              lugarOracionFe: "${
                _oracionFe.lugarOracionFe !== undefined
                  ? _oracionFe.lugarOracionFe
                  : ''
              }"
              responsableOracionFe: "${
                _oracionFe.responsableOracionFe !== undefined
                  ? _oracionFe.responsableOracionFe
                  : ''
              }"
            }){
              _id
            }
          }`,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          //console.log(result);
          if (result.data.actualizarPersona._id.length > 0) {
            retorno = true;
          } else {
            retorno = false;
          }
        });
    } catch (e) {
      console.log('ERROR: ' + e);
      retorno = false;
    }
    return retorno;
  }

  //ACTUALIZAR BAUTIZMO
  async actualizarBautizmo(_id: any, _bautizmo: Bautizmo): Promise<Boolean> {
    let retorno: Boolean = false;
    try {
      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            actualizarPersona(_id:"${_id}",
            input:{
              bautizmo:${
                _bautizmo.bautizmo !== undefined ? _bautizmo.bautizmo : false
              }
              fechaBautizmo:"${
                _bautizmo.fechaBautizmo !== undefined
                  ? _bautizmo.fechaBautizmo
                  : ''
              }"
              lugarBautizmo:"${
                _bautizmo.lugarBautizmo !== undefined
                  ? _bautizmo.lugarBautizmo
                  : ''
              }"
              responsableBautizmo:"${
                _bautizmo.responsableBautizmo !== undefined
                  ? _bautizmo.responsableBautizmo
                  : ''
              }"
            }){
              _id
            }
          }`,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          //console.log(result);
          if (result.data.actualizarPersona._id.length > 0) {
            retorno = true;
          } else {
            retorno = false;
          }
        });
    } catch (e) {
      console.log('ERROR: ' + e);
      retorno = false;
    }
    return retorno;
  }

  //PROCESOS - TIPO PERSONA
  async actualizarProcesosTipoPersona(
    _id: any,
    _tipoPersona: String
  ): Promise<Boolean> {
    let retorno: Boolean = false;
    try {
      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            actualizarPersona(_id:"${_id}",
            input:{
              tipoPersona:"${_tipoPersona !== undefined ? _tipoPersona : ''}"
            }){
              _id
            }
          }`,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          //console.log(result);
          if (result.data.actualizarPersona._id.length > 0) {
            retorno = true;
          } else {
            retorno = false;
          }
        });
    } catch (e) {
      console.log('ERROR: ' + e);
      retorno = false;
    }
    return retorno;
  }

  //PROCESOS - ESCUELAS
  async actualizarProcesosEscuelas(
    _id: any,
    _escuelas: Escuela[]
  ): Promise<Boolean> {
    let retorno: Boolean = false;

    try {
      let lista = '';
      _escuelas!.forEach((e) => {
        //console.log("estado de permiso: " + element.estado);
        //if (element.estado) {
        //console.log('id escuela es : ' + e._id);
        lista += `{ 
          tipo:"${e.tipo}"
          color:"${e.color}"
          idEscuela:"${e._id}"
          colorTextoNegro:${e.colorTextoNegro ? true : false}
        },`;
        //}
      });

      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            actualizarPersona(_id:"${_id}",
            input:{
              escuelas:[
                ${lista}
              ]
          }){
              _id
            }
          }`,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          ////console.log(result);
          if (result.data.actualizarPersona._id.length > 0) {
            retorno = true;
          } else {
            retorno = false;
          }
        });
    } catch (e) {
      console.log('ERROR: ' + e);
      retorno = false;
    }

    return retorno;
  }

  //PROCESOS - TIPO PROCESO
  async actualizarProcesosTipoProcesos(
    _id: any,
    _tipoProceso: TipoProceso[]
  ): Promise<Boolean> {
    let retorno: Boolean = false;

    try {
      let lista = '';
      _tipoProceso!.forEach((t) => {
        //console.log("estado de permiso: " + element.estado);
        //if (element.estado) {
        lista += `{ 
          tipo:"${t.tipo}"
        },`;
        //}
      });

      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            actualizarPersona(_id:"${_id}",
            input:{
              tipoProcesos:[
                ${lista}
              ]
          }){
              _id
            }
          }`,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          //console.log(result);
          if (result.data.actualizarPersona._id.length > 0) {
            retorno = true;
          } else {
            retorno = false;
          }
        });
    } catch (e) {
      console.log('ERROR: ' + e);
      retorno = false;
    }

    return retorno;
  }

  //PROCESOS - GRUPOS
  async actualizarProcesosGrupos(_id: any, _grupo: Grupo[]): Promise<Boolean> {
    let retorno: Boolean = false;

    try {
      let lista = '';
      _grupo!.forEach((g) => {
        //console.log("estado de permiso: " + element.estado);
        //if (element.estado) {
        lista += `{ 
          tipo:"${g.tipo}"
        },`;
        //}
      });

      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            actualizarPersona(_id:"${_id}",
            input:{
              grupos:[
                ${lista}
              ]
          }){
              _id
            }
          }`,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          //console.log(result);
          if (result.data.actualizarPersona._id.length > 0) {
            retorno = true;
          } else {
            retorno = false;
          }
        });
    } catch (e) {
      console.log('ERROR: ' + e);
      retorno = false;
    }

    return retorno;
  }

  //PROCESOS - SEMINARIOS
  async actualizarProcesosSeminarios(
    _id: any,
    _seminario: Seminario[]
  ): Promise<Boolean> {
    let retorno: Boolean = false;

    try {
      let lista = '';
      _seminario!.forEach((s) => {
        //console.log("estado de permiso: " + element.estado);
        //if (element.estado) {
        lista += `{ 
          tipo:"${s.tipo}"
          color:"${s.color}"
        },`;
        //}
      });

      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            actualizarPersona(_id:"${_id}",
            input:{
              seminarios:[
                ${lista}
              ]
          }){
              _id
            }
          }`,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          //console.log(result);
          if (result.data.actualizarPersona._id.length > 0) {
            retorno = true;
          } else {
            retorno = false;
          }
        });
    } catch (e) {
      console.log('ERROR: ' + e);
      retorno = false;
    }

    return retorno;
  }

  //ACTUALIZAR DATOS PERSONALES
  async actualizarDatosPersonales(
    _id: any,
    _persona: Persona
  ): Promise<Boolean> {
    let retorno: Boolean = false;

    try {
      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            actualizarPersona(_id:"${_id}",
            input:{
              cedula:"${_persona.datoBasicoPersona!.cedula}"
              primerNombre:"${_persona.datoBasicoPersona!.primerNombre}"
              segundoNombre:"${_persona.datoBasicoPersona!.segundoNombre}"
              primerApellido:"${_persona.datoBasicoPersona!.primerApellido}"
              segundoApellido:"${_persona.datoBasicoPersona!.segundoApellido}"
              fechaNacimiento:"${_persona.datoBasicoPersona!.fechaNacimiento}"
              telefono:"${_persona.datoBasicoPersona!.telefono}"
              celular:"${_persona.datoBasicoPersona!.celular}"
              direccion:"${_persona.datoBasicoPersona!.direccion}"
              email:"${_persona.datoBasicoPersona!.email}"
              sexo:"${_persona.datoBasicoPersona!.sexo}"
              foto:"${_persona.datoBasicoPersona!.foto}"
          }){
              _id
            }
          }`,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          ////console.log(result);
          if (result.data.actualizarPersona._id.length > 0) {
            retorno = true;
          } else {
            retorno = false;
          }
        });
    } catch (e) {
      console.log('ERROR: ' + e);
      retorno = false;
    }

    return retorno;
  }

  //ELIMINAR
  async eliminarPersona(_id: any) {
    console.log('IDE ELIMINAR: ' + _id);
    try {
      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            eliminarPersona(_id:"${_id}"){
              _id
            }
          }`,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(
            'RESULTAOD DE ELIMINACION: ' + result.data.eliminarPersona
          );
          this.consultarPersonas();
        });
    } catch (e) {
      console.log('ERROR: ' + e);
    }
  }

  obtenerLinkWhatsApp(_celular: any) {
    return 'http://wa.me/593' + _celular;
  }

  obtenerFechaNacimintoFormateada(_fechaNacimiento: any) {
    let _fechaCumpleanio: String = '';
    try {
      if (_fechaNacimiento !== undefined) {
        let _dia = new Date(_fechaNacimiento).toLocaleString('es', {
          day: 'numeric',
        });
        let _mes: String = new Date(_fechaNacimiento).toLocaleString('es', {
          month: 'long',
        });
        let _anio: String = new Date(_fechaNacimiento).toLocaleString('es', {
          year: 'numeric',
        });

        _fechaCumpleanio =
          _dia +
          ' de ' +
          _mes[0].toUpperCase() +
          _mes.slice(1) +
          (Number(_anio) > 1999 ? ' del ' : ' de ') +
          _anio;

        return _fechaCumpleanio;
      } else {
        _fechaCumpleanio = 'No Disponible';
      }
    } catch {
      _fechaCumpleanio = 'No Disponible';
    }
    return _fechaCumpleanio;
  }


  //CONSULTAR CANTIDAD PERSONAS
  async consultarPersonaCantidad(): Promise<number> {
    let cantidadPersonas = 0;

    try {
      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },

        body: JSON.stringify({
          query: `{
            personaCantidad
                  }`,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          cantidadPersonas = result.data.personaCantidad;
        });
    } catch (e) {
      console.log('ERROR: ' + e);
      cantidadPersonas = 0;
    }
    return cantidadPersonas;
  }

  obtenerPersonas$(): Observable<Persona[]> {
    return this.personas$.asObservable();
  }
}
