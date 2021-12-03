import { TipoPersona } from './../../../dataModels/tipoPersona';
import { Injectable } from '@angular/core';
import { concatMapTo, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TipoPersonaService {

  serverLocal: RequestInfo = "http://localhost:3000/graphql";
  serverPro: RequestInfo = "https://arca-server.vercel.app/graphql";

  //TIPO PERSONA
  private tipoPersonas: TipoPersona[];
  private tipoPersonas$: Subject<TipoPersona[]>;

  resultado: any;
  constructor() {
    this.tipoPersonas = [];
    this.tipoPersonas$ = new Subject();
  }

  //TIPO PERSONA

  //AGREGAR
  async agregarTipoPersonas(tipoPersona: TipoPersona) {
    try {

      await fetch(this.serverLocal, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            crearTipoPersona(input:{
              tipo:"${tipoPersona.tipo}"            
            }){
              tipo
            }
          }`,
        })
      })
        .then((res) => res.json())
        .then((result) => {    

          this.tipoPersonas$.next(this.tipoPersonas);

        });
    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  //CONSULTAR
  async consultarTipoPersonas() {

    this.tipoPersonas = [];

    try {

      await fetch(this.serverLocal, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },



        body: JSON.stringify({
          query: `{
            tipoPersona{
              _id
              tipo
            }
                  }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
          result.data.tipoPersona.map((tp: any) => {
            let tipoPersona = new TipoPersona();
            tipoPersona._id = tp._id;
            tipoPersona.tipo = tp.tipo;
            this.tipoPersonas.push(tipoPersona);
          });
        });
      //this.personasListas();
      this.tipoPersonas$.next(this.tipoPersonas);

    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  //ELIMINAR
  async eliminarTipoPersonas(_id: any) {
    try {

      await fetch(this.serverLocal, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            eliminarTipoPersona(_id:"${_id}"){
              _id
              tipo
            }
          }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
        });
      this.tipoPersonas$.next(this.tipoPersonas);

    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  //ACTUALIZAR
  async actualizarTipoPersonas(_id:any,tipoPersona:TipoPersona) {
    try {

      await fetch(this.serverLocal, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            actualizarTipoPersona(_id:"${_id}",
            input:{
              tipo:"${tipoPersona.tipo}"
            }){
              _id
            }
          }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
          
        });
      //this.personasListas();
      this.tipoPersonas$.next(this.tipoPersonas);

    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  obtenerTipoPersonas$(): Observable<TipoPersona[]> {
    return this.tipoPersonas$.asObservable();
  }
}
