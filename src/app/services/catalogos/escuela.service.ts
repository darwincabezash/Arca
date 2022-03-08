import { GlobalDataService } from '../login/globalDataServices';
import { Injectable } from '@angular/core';
import { Observable, Subject, concatMapTo } from 'rxjs';
import { Escuela } from 'src/app/dataModels/escuela';

@Injectable({
  providedIn: 'root',
})
export class EscuelaService {
  server: RequestInfo = GlobalDataService.getServer();

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
    try {
      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            crearEscuela(input:{
              tipo:"${escuela.tipo}"    
              color:"${escuela.color}"    
              colorTextoNegro:${escuela.colorTextoNegro}    
            }){
              tipo
            }
          }`,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          this.consultarEscuela();
        });
    } catch (e) {
      console.log('ERROR: ' + e);
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
          Accept: 'application/json',
        },

        body: JSON.stringify({
          query: `{
            escuela{
              _id
              tipo
              color
              colorTextoNegro
            }
                  }`,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          result.data.escuela.map((tp: any) => {
            let escuela = new Escuela();
            escuela._id = tp._id;
            escuela.tipo = tp.tipo;
            escuela.color = tp.color;
            escuela.colorTextoNegro = tp.colorTextoNegro;
            this.escuelas.push(escuela);
          });
        });
      this.escuelas$.next(this.escuelas);
    } catch (e) {
      console.log('ERROR: ' + e);
    }
  }

  //CONSULTAR CANTIDAD ESCUELAS
  async consultarEscuelaCantidad(): Promise<number> {
    let cantidadEscuelas = 0;

    try {
      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },

        body: JSON.stringify({
          query: `{
            escuelaCantidad
                  }`,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          cantidadEscuelas = result.data.escuelaCantidad;
        });
    } catch (e) {
      console.log('ERROR: ' + e);
      cantidadEscuelas = 0;
    }
    return cantidadEscuelas;
  }

  //CONSULTAR CANTIDAD PROCESOS
  async consultarProcesoCantidad(): Promise<number> {
    let cantidadProcesos = 0;

    try {
      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },

        body: JSON.stringify({
          query: `{
            tipoProcesoCantidad
                  }`,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          cantidadProcesos = result.data.tipoProcesoCantidad;
        });
    } catch (e) {
      console.log('ERROR: ' + e);
      cantidadProcesos = 0;
    }
    return cantidadProcesos;
  }

  //CONSULTAR CANTIDAD GRUPOS
  async consultarGrupoCantidad(): Promise<number> {
    let cantidadGrupos = 0;

    try {
      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },

        body: JSON.stringify({
          query: `{
            grupoCantidad
                  }`,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          cantidadGrupos = result.data.grupoCantidad;
        });
    } catch (e) {
      console.log('ERROR: ' + e);
      cantidadGrupos = 0;
    }
    return cantidadGrupos;
  }

  //CONSULTAR CANTIDAD SEMINARIOS
  async consultarSeminarioCantidad(): Promise<number> {
    let cantidadSeminarios = 0;

    try {
      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },

        body: JSON.stringify({
          query: `{
            seminarioCantidad
                  }`,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          cantidadSeminarios = result.data.seminarioCantidad;
        });
    } catch (e) {
      console.log('ERROR: ' + e);
      cantidadSeminarios = 0;
    }
    return cantidadSeminarios;
  }

  //ELIMINAR
  async eliminarEscuela(_id: any) {
    try {
      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            eliminarEscuela(_id:"${_id}"){
              _id
              tipo
            }
          }`,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          this.consultarEscuela();
        });
    } catch (e) {
      console.log('ERROR: ' + e);
    }
  }

  //ACTUALIZAR
  async actualizarEscuela(_id: any, escuela: Escuela) {
    try {
      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            actualizarEscuela(_id:"${_id}",
            input:{
              tipo:"${escuela.tipo}"
              color:"${escuela.color}"
              colorTextoNegro:${escuela.colorTextoNegro}
            }){
              _id
            }
          }`,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          this.consultarEscuela();
        });
    } catch (e) {
      console.log('ERROR: ' + e);
    }
  }

  obtenerEscuelas$(): Observable<Escuela[]> {
    return this.escuelas$.asObservable();
  }
}
