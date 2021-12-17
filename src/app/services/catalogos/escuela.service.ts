import { GlobalDataService } from '../login/globalDataServices';
import { Injectable } from '@angular/core';
import { Observable, Subject, concatMapTo } from 'rxjs';
import { Escuela } from 'src/app/dataModels/escuela';

@Injectable({
  providedIn: 'root'
})
export class EscuelaService {

  server:RequestInfo=GlobalDataService.getServer();

  //ESCUELA
  private escuelas: Escuela[];
  private escuelas$: Subject<Escuela[]>;

  resultado: any;
  constructor() {
    this.escuelas = [];
    this.escuelas$ = new Subject();
  }

  //GRUPO

  //AGREGAR
  async agregarEscuela(escuela: Escuela) {
    console.log("color es: "+escuela.color);
    try {

      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            crearEscuela(input:{
              tipo:"${escuela.tipo}"    
              color:"${escuela.color}"    
            }){
              tipo
            }
          }`,
        })
      })
        .then((res) => res.json())
        .then((result) => {    
          this.consultarEscuela();

        });
    } catch (e) {
      console.log("ERROR: " + e);
    }

  }

  //CONSULTAR
  async consultarEscuela() {

    this.escuelas = [];

    try {

      await fetch(this.server, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },

        body: JSON.stringify({
          query: `{
            escuela{
              _id
              tipo
              color
            }
                  }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
          result.data.escuela.map((tp: any) => {
            let escuela = new Escuela();
            escuela._id = tp._id;
            escuela.tipo = tp.tipo;
            escuela.color=tp.color;
            this.escuelas.push(escuela);
          });
        });
      this.escuelas$.next(this.escuelas);

    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  //ELIMINAR
  async eliminarEscuela(_id: any) {
    try {

      await fetch(this.server, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            eliminarEscuela(_id:"${_id}"){
              _id
              tipo
            }
          }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
          this.consultarEscuela();

        });

    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  //ACTUALIZAR
  async actualizarEscuela(_id:any,escuela:Escuela) {
    try {

      await fetch(this.server, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            actualizarEscuela(_id:"${_id}",
            input:{
              tipo:"${escuela.tipo}"
              color:"${escuela.color}"
            }){
              _id
            }
          }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
          this.consultarEscuela();

        });

    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  obtenerEscuelas$(): Observable<Escuela[]> {
    return this.escuelas$.asObservable();
  }

}
