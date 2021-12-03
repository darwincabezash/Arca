import { Grupo } from './../../dataModels/grupo';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {


  serverLocal: RequestInfo = "http://localhost:3000/graphql";
  serverPro: RequestInfo = "https://arca-server.vercel.app/graphql";

  //GRUPO
  private grupos: Grupo[];
  private grupos$: Subject<Grupo[]>;

  resultado: any;
  constructor() {
    this.grupos = [];
    this.grupos$ = new Subject();
  }

  //GRUPO

  //AGREGAR
  async agregarGrupo(grupo: Grupo) {
    try {

      await fetch(this.serverLocal, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            crearGrupo(input:{
              tipo:"${grupo.tipo}"            
            }){
              tipo
            }
          }`,
        })
      })
        .then((res) => res.json())
        .then((result) => {    

          this.grupos$.next(this.grupos);

        });
    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  //CONSULTAR
  async consultarGrupo() {

    this.grupos = [];

    try {

      await fetch(this.serverLocal, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },

        body: JSON.stringify({
          query: `{
            grupo{
              _id
              tipo
            }
                  }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
          result.data.grupo.map((tp: any) => {
            let grupo = new Grupo();
            grupo._id = tp._id;
            grupo.tipo = tp.tipo;
            this.grupos.push(grupo);
          });
        });
      this.grupos$.next(this.grupos);

    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  //ELIMINAR
  async eliminarGrupo(_id: any) {
    try {

      await fetch(this.serverLocal, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            eliminarGrupo(_id:"${_id}"){
              _id
              tipo
            }
          }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
        });
      this.grupos$.next(this.grupos);

    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  //ACTUALIZAR
  async actualizarGrupo(_id:any,grupo:Grupo) {
    try {

      await fetch(this.serverLocal, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            actualizarGrupo(_id:"${_id}",
            input:{
              tipo:"${grupo.tipo}"
            }){
              _id
            }
          }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
          
        });
      this.grupos$.next(this.grupos);

    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  obtenerGrupos$(): Observable<Grupo[]> {
    return this.grupos$.asObservable();
  }}
