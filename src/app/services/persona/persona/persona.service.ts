import { Seminario } from './../../../dataModels/seminarios';
import { Grupo } from 'src/app/dataModels/grupo';
import { TipoPersona } from './../../../dataModels/tipoPersona';
import { Injectable } from '@angular/core';
import { concatMapTo, Observable, Subject } from 'rxjs';
import { PublicInfo } from 'src/app/shared/data/publicInfo';
import { Persona, DatoBasicoPersona, OrigenPersona, DatosLlegada, OracionFe, Bautizmo } from '../../../dataModels/persona';
import { GlobalDataService } from '../../login/globalDataServices';
import { Escuela } from 'src/app/dataModels/escuela';
import { TipoProceso } from 'src/app/dataModels/tipoProceso';

@Injectable({
  providedIn: 'root'
})

export class PersonaService {

  server: RequestInfo = GlobalDataService.getServer();


  //PERSONA
  private personas: Persona[];
  private personas$: Subject<Persona[]>;

  resultado: any;
  constructor() {
    this.personas = [];
    this.personas$ = new Subject();
  }

  //PERSONA


  //CONSULTAR
  async consultarPersonas() {
    this.personas = [];

    try {
      await fetch(this.server, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `{
            personas{
              _id
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

        })

      })
        .then((res) => res.json())
        .then((result) => {
          result.data.personas.map((el: any) => {
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
          });
        });
      this.personas$.next(this.personas);

    } catch (e) {
      console.log("ERROR: " + e);
    }
  }



  //CONSULTAR
  async consultarPersona(_id: String): Promise<boolean> {
    let _carga_completa = false;
    this.personas = [];

    try {
      await fetch(this.server, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
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

        })

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
      console.log("ERROR: " + e);
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
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `{
            personas{
              _id
              primerNombre
              primerApellido
            }
                  }`,

        })

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
            this.personas.push(persona);
          });
        });
      this.personas$.next(this.personas);

    } catch (e) {
      console.log("ERROR: " + e);
    }
  }


  //AGREGAR
  //async agregarPersonas(persona: Persona) {
  async agregarPersonas(persona: Persona): Promise<any> {
    let _idPersonaCreada = "";
    try {

      await fetch(this.server, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({

          query: `mutation{
            crearPersona(input:{
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
            }){
             _id
              cedula
            }
          }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
          _idPersonaCreada = result.data.crearPersona._id
        });

    } catch (e) {
      console.log("ERROR: " + e);
    }
    return _idPersonaCreada;
  }


  //ACTUALIZAR ORIGEN PERSONA
  async actualizarOrigenPersona(_id: any, _origenPersona: OrigenPersona): Promise<Boolean> {
    let retorno: Boolean = false;
    try {

      await fetch(this.server, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            actualizarPersona(_id:"${_id}",
            input:{
              nombreIglesiaOrigen:"${_origenPersona.nombreIglesiaOrigen}"
              cargoEjercido:"${_origenPersona.cargoEjercido ? _origenPersona.cargoEjercido : ''}"
              tiempoPermanencia:${_origenPersona.tiempoPermanencia !== undefined ? _origenPersona.tiempoPermanencia : 0}
              tieneCartaAutorizacion:${_origenPersona.tieneCartaAutorizacion !== undefined ? _origenPersona.tieneCartaAutorizacion : false}
            }){
              _id
            }
          }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          if (result.data.actualizarPersona._id.length > 0) {
            retorno = true;
          } else {
            retorno = false;
          }

        });

    } catch (e) {
      console.log("ERROR: " + e);
      retorno = false;
    }
    return retorno;
  }



  //ACTUALIZAR ORIGEN PERSONA
  async actualizarDatosLlegada(_id: any, _datosLlegada: DatosLlegada): Promise<Boolean> {
    let retorno: Boolean = false;
    try {

      await fetch(this.server, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            actualizarPersona(_id:"${_id}",
            input:{
              fechaLlegada:"${_datosLlegada.fechaLlegada ? _datosLlegada.fechaLlegada : ''}"
              invitadoPor:"${_datosLlegada.invitadoPor ? _datosLlegada.invitadoPor : ''}"
              observacionUbicacion:"${_datosLlegada.observacionUbicacion ? _datosLlegada.observacionUbicacion : ''}"
              actividadLlegada:"${_datosLlegada.actividadLlegada ? _datosLlegada.actividadLlegada : ''}"
            }){
              _id
            }
          }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          if (result.data.actualizarPersona._id.length > 0) {
            retorno = true;
          } else {
            retorno = false;
          }

        });

    } catch (e) {
      console.log("ERROR: " + e);
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
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            actualizarPersona(_id:"${_id}",
            input:{
              oracionFe: ${_oracionFe.oracionFe !== undefined ? _oracionFe.oracionFe : false}
              fechaOracionFe: "${_oracionFe.fechaOracionFe !== undefined ? _oracionFe.fechaOracionFe : ''}"
              lugarOracionFe: "${_oracionFe.lugarOracionFe !== undefined ? _oracionFe.lugarOracionFe : ''}"
              responsableOracionFe: "${_oracionFe.responsableOracionFe !== undefined ? _oracionFe.responsableOracionFe : ''}"
            }){
              _id
            }
          }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          if (result.data.actualizarPersona._id.length > 0) {
            retorno = true;
          } else {
            retorno = false;
          }

        });

    } catch (e) {
      console.log("ERROR: " + e);
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
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            actualizarPersona(_id:"${_id}",
            input:{
              bautizmo:${_bautizmo.bautizmo !== undefined ? _bautizmo.bautizmo : false}
              fechaBautizmo:"${_bautizmo.fechaBautizmo !== undefined ? _bautizmo.fechaBautizmo : ''}"
              lugarBautizmo:"${_bautizmo.lugarBautizmo !== undefined ? _bautizmo.lugarBautizmo : ''}"
              responsableBautizmo:"${_bautizmo.responsableBautizmo !== undefined ? _bautizmo.responsableBautizmo : ''}"
            }){
              _id
            }
          }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          if (result.data.actualizarPersona._id.length > 0) {
            retorno = true;
          } else {
            retorno = false;
          }

        });

    } catch (e) {
      console.log("ERROR: " + e);
      retorno = false;
    }
    return retorno;
  }



  //PROCESOS - TIPO PERSONA
  async actualizarProcesosTipoPersona(_id: any, _tipoPersona: String): Promise<Boolean> {
    let retorno: Boolean = false;
    try {

      await fetch(this.server, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
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

        })

      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          if (result.data.actualizarPersona._id.length > 0) {
            retorno = true;
          } else {
            retorno = false;
          }

        });

    } catch (e) {
      console.log("ERROR: " + e);
      retorno = false;
    }
    return retorno;
  }



  //PROCESOS - ESCUELAS
  async actualizarProcesosEscuelas(_id: any, _escuelas: Escuela[]): Promise<Boolean> {
    let retorno: Boolean = false;

    try {

      let lista = '';
      _escuelas!.forEach(e => {
        //console.log("estado de permiso: " + element.estado);
        //if (element.estado) {
        lista += `{ 
          tipo:"${e.tipo}"
          color:"${e.color}"
        },`
        //}
      });


      await fetch(this.server, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
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
          }`


        })

      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          if (result.data.actualizarPersona._id.length > 0) {
            retorno = true;
          } else {
            retorno = false;
          }

        });

    } catch (e) {
      console.log("ERROR: " + e);
      retorno = false;

    }

    return retorno;

  }

  //PROCESOS - TIPO PROCESO
  async actualizarProcesosTipoProcesos(_id: any, _tipoProceso: TipoProceso[]): Promise < Boolean > {
      let retorno: Boolean = false;

      try {

        let lista = '';
        _tipoProceso!.forEach(t => {
          //console.log("estado de permiso: " + element.estado);
          //if (element.estado) {
          lista += `{ 
          tipo:"${t.tipo}"
        },`
          //}
        });


        await fetch(this.server, {

          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
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
          }`


          })

        })
          .then((res) => res.json())
          .then((result) => {
            console.log(result);
            if (result.data.actualizarPersona._id.length > 0) {
              retorno = true;
            } else {
              retorno = false;
            }

          });

      } catch(e) {
        console.log("ERROR: " + e);
        retorno = false;

      }

    return retorno;
  }



  //PROCESOS - GRUPOS
  async actualizarProcesosGrupos(_id: any, _grupo: Grupo[]): Promise<Boolean> {
    let retorno: Boolean = false;

    try {

      let lista = '';
      _grupo!.forEach(g => {
        //console.log("estado de permiso: " + element.estado);
        //if (element.estado) {
        lista += `{ 
          tipo:"${g.tipo}"
        },`
        //}
      });


      await fetch(this.server, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
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
          }`


        })

      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          if (result.data.actualizarPersona._id.length > 0) {
            retorno = true;
          } else {
            retorno = false;
          }

        });

    } catch (e) {
      console.log("ERROR: " + e);
      retorno = false;

    }

    return retorno;
  }



  //PROCESOS - SEMINARIOS
  async actualizarProcesosSeminarios(_id: any, _seminario: Seminario[]): Promise<Boolean> {
    let retorno: Boolean = false;

    try {

      let lista = '';
      _seminario!.forEach(s => {
        //console.log("estado de permiso: " + element.estado);
        //if (element.estado) {
        lista += `{ 
          tipo:"${s.tipo}"
        },`
        //}
      });


      await fetch(this.server, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
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
          }`


        })

      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          if (result.data.actualizarPersona._id.length > 0) {
            retorno = true;
          } else {
            retorno = false;
          }

        });

    } catch (e) {
      console.log("ERROR: " + e);
      retorno = false;

    }

    return retorno;
  }






  obtenerPersonas$(): Observable<Persona[]> {
    return this.personas$.asObservable();
  }

}
