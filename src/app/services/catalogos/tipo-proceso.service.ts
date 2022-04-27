import { TipoProceso } from './../../dataModels/tipoProceso';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { GlobalDataService } from '../../global/globalDataServices';

@Injectable({
  providedIn: 'root'
})
export class TipoProcesoService {

  server:RequestInfo=GlobalDataService.getServer();


  //TIPO PROCESO
  private tipoProcesos: TipoProceso[];
  private tipoProcesos$: Subject<TipoProceso[]>;

  resultado: any;
  constructor() {
    this.tipoProcesos = [];
    this.tipoProcesos$ = new Subject();
  }

  //TIPO PROCESO

  //AGREGAR
  async agregarTipoProceso(tipoProceso: TipoProceso) {
    try {

      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            crearTipoProceso(input:{
              tipo:"${tipoProceso.tipo}"            
            }){
              tipo
            }
          }`,
        })
      })
        .then((res) => res.json())
        .then((result) => {    
          this.consultarTipoProceso();

        });
    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  //CONSULTAR
  async consultarTipoProceso() {

    this.tipoProcesos = [];

    try {

      await fetch(this.server, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },



        body: JSON.stringify({
          query: `{
            tipoProceso{
              _id
              tipo
            }
                  }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
          result.data.tipoProceso.map((tp: any) => {
            let tipoProceso = new TipoProceso();
            tipoProceso._id = tp._id;
            tipoProceso.tipo = tp.tipo;
            this.tipoProcesos.push(tipoProceso);
          });
          this.tipoProcesos$.next(this.tipoProcesos);

        });


    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  //ELIMINAR
  async eliminarTipoProceso(_id: any) {
    try {

      await fetch(this.server, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            eliminarTipoProceso(_id:"${_id}"){
              _id
              tipo
            }
          }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
          this.consultarTipoProceso();
        });


    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  //ACTUALIZAR
  async actualizarTipoProceso(_id:any,tipoProceso:TipoProceso) {
    try {

      await fetch(this.server, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            actualizarTipoProceso(_id:"${_id}",
            input:{
              tipo:"${tipoProceso.tipo}"
            }){
              _id
            }
          }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
          this.consultarTipoProceso();
        });

    } catch (e) {
      console.log("ERROR: " + e);
    }
  }



  //CONSULTAR CANTIDAD ESCUELAS
  async consultarTipoProcesoCantidad(): Promise<number> {

    let cantidadTipoProceso = 0;

    try {

      await fetch(this.server, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },

        body: JSON.stringify({
          query: `{
            tipoProcesoCantidad
                  }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
          cantidadTipoProceso = result.data.tipoProcesoCantidad;

        });

    } catch (e) {
      console.log("ERROR: " + e);
      cantidadTipoProceso = 0;
    }
    return cantidadTipoProceso;
  }

  obtenerTipoProcesos$(): Observable<TipoProceso[]> {
    return this.tipoProcesos$.asObservable();
  }
}
