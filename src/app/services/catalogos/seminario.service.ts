import { GlobalDataService } from '../../global/globalDataServices';
import { Injectable } from '@angular/core';
import { Observable, Subject, concatMapTo } from 'rxjs';
import { Seminario } from 'src/app/dataModels/seminario';

@Injectable({
  providedIn: 'root'
})
export class SeminarioService {

  server: RequestInfo = GlobalDataService.getServer();

  //SEMINARIO
  private seminarios: Seminario[];
  private seminarios$: Subject<Seminario[]>;

  resultado: any;
  constructor() {
    this.seminarios = [];
    this.seminarios$ = new Subject();
  }

  //GRUPO

  //AGREGAR
  async agregarSeminario(seminario: Seminario) {
    console.log("color es: " + seminario.color);
    try {

      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            crearSeminario(input:{
              tipo:"${seminario.tipo}"    
              color:"${seminario.color}"    
            }){
              tipo
            }
          }`,
        })
      })
        .then((res) => res.json())
        .then((result) => {
          this.consultarSeminario();

        });
    } catch (e) {
      console.log("ERROR: " + e);
    }

  }

  //CONSULTAR
  async consultarSeminario() {

    this.seminarios = [];

    try {

      await fetch(this.server, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },

        body: JSON.stringify({
          query: `{
            seminario{
              _id
              tipo
              color
            }
                  }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
          result.data.seminario.map((tp: any) => {
            let seminario = new Seminario();
            seminario._id = tp._id;
            seminario.tipo = tp.tipo;
            seminario.color = tp.color;
            this.seminarios.push(seminario);
          });
        });
      this.seminarios$.next(this.seminarios);

    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  //ELIMINAR
  async eliminarSeminario(_id: any) {
    try {

      await fetch(this.server, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            eliminarSeminario(_id:"${_id}"){
              _id
              tipo
            }
          }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
          this.consultarSeminario();

        });

    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  //ACTUALIZAR
  async actualizarSeminario(_id: any, seminario: Seminario) {
    try {

      await fetch(this.server, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            actualizarSeminario(_id:"${_id}",
            input:{
              tipo:"${seminario.tipo}"
              color:"${seminario.color}"
            }){
              _id
            }
          }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
          this.consultarSeminario();

        });

    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  obtenerSeminarios$(): Observable<Seminario[]> {
    return this.seminarios$.asObservable();
  }

}
