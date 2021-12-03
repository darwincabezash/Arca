import { TipoPersona } from './../../../dataModels/tipoPersona';
import { Injectable } from '@angular/core';
import { concatMapTo, Observable, Subject } from 'rxjs';
import { PublicInfo } from 'src/app/shared/data/publicInfo';
import { Persona, DatoBasicoPersona } from '../../../dataModels/persona';

@Injectable({
  providedIn: 'root'
})

export class PersonaService {

  serverLocal:RequestInfo ="http://localhost:3000/graphql";
  serverPro:RequestInfo="https://arca-server.vercel.app/graphql";
  
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
      await fetch(this.serverLocal, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `{
            persona{
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
          });
        });
      this.personas$.next(this.personas);

    } catch (e) {
      console.log("ERROR: "+e);
    }
  }

  //AGREGAR
  async agregarPersonas(persona:Persona) {
    try {

      await fetch(this.serverLocal, {

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
          console.log(result.data.crearPersona._id);
        });

    } catch (e) {
      console.log("ERROR: "+e);
    }
  }


  obtenerPersonas(): Observable<Persona[]> {
    return this.personas$.asObservable();
  }

}
