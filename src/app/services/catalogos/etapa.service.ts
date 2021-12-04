import { Injectable } from '@angular/core';
import { Observable, Subject, concatMapTo } from 'rxjs';
import { Etapa } from 'src/app/dataModels/etapa';

@Injectable({
  providedIn: 'root'
})
export class EtapaService {


  serverLocal: RequestInfo = "http://localhost:3000/graphql";
  serverPro: RequestInfo = "https://arca-server.vercel.app/graphql";

  //ETAPA
  private etapas: Etapa[];
  private etapas$: Subject<Etapa[]>;

  resultado: any;
  constructor() {
    this.etapas = [];
    this.etapas$ = new Subject();
  }

  //ETAPA

  //AGREGAR
  async agregarEtapa(etapa: Etapa) {
console.log("datos etapa: "+etapa._id+"  : "+etapa.tipo+"   : "+etapa.edadI+"   : "+etapa.edadF)
    try {

      await fetch(this.serverLocal, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            crearEtapa(input:{
              tipo:"${etapa.tipo}"
              edadI:${etapa.edadI}
              edadF:${etapa.edadF}
            }){
              tipo
            }
          }`,
        })
      })
        .then((res) => res.json())
        .then((result) => {    

          this.etapas$.next(this.etapas);

        });
    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  //CONSULTAR
  async consultarEtapa() {

    this.etapas = [];

    try {

      await fetch(this.serverLocal, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },

        body: JSON.stringify({
          query: `{
            etapa{
              _id
              tipo
              edadI
              edadF
            }
                  }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
          result.data.etapa.map((tp: any) => {
            let etapa = new Etapa();
            etapa._id = tp._id;
            etapa.tipo = tp.tipo;
            etapa.edadI=tp.edadI;
            etapa.edadF=tp.edadF;
            this.etapas.push(etapa);
          });
        });
      this.etapas$.next(this.etapas);

    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  //ELIMINAR
  async eliminarEtapa(_id: any) {
    try {

      await fetch(this.serverLocal, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            eliminarEtapa(_id:"${_id}"){
              _id
              tipo
            }
          }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
        });
      this.etapas$.next(this.etapas);

    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  //ACTUALIZAR
  async actualizarEtapa(_id:any,etapa:Etapa) {
    try {

      await fetch(this.serverLocal, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            actualizarEtapa(_id:"${_id}",
            input:{
              tipo:"${etapa.tipo}"
              edadI:${etapa.edadI}
              edadF:${etapa.edadF}
            }){
              _id
            }
          }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
          
        });
      this.etapas$.next(this.etapas);

    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  obtenerEtapas$(): Observable<Etapa[]> {
    return this.etapas$.asObservable();
  }}
