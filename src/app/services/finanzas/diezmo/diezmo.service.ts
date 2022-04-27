import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Persona } from 'src/app/dataModels/persona';
import { GlobalDataService } from '../../../global/globalDataServices';
import { Diezmo } from './../../../dataModels/diezmo';

@Injectable({
  providedIn: 'root'
})
export class DiezmoService {


    server: RequestInfo = GlobalDataService.getServer();


  //PERSONA
  private diezmos: Diezmo[];
  private diezmos$: Subject<Diezmo[]>;
  

  constructor() { 

    this.diezmos = [];
    this.diezmos$ = new Subject();

  }



  //CONSULTAR
  async consultarDiezmos() {
    this.diezmos = [];

    try {
      await fetch(this.server, {
        
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `{diezmo {
                _id
                estado
                dia
                mes
                anio
                fechaCreacion
                idPersona
                monto
                
              }}
          `,

        })

      })
        .then((res) => res.json())
        .then((result) => {
           this.diezmos = [];
          //console.log( JSON.stringify(result));
          //console.log(result.data);
          result.data.diezmo.map((el: any) => {
          //console.log(result.data);
            let diezmo: Diezmo = new Diezmo();
            
            diezmo._id = el._id;
            diezmo.estado = el.estado;
            diezmo.dia = el.dia;
            diezmo.mes = el.mes;
            diezmo.anio = el.anio;
            let _fecha =( el.fechaCreacion!=undefined) ? el.fechaCreacion.toString() + "T00:00:00" : "T00:00:00";
            diezmo.fechaCreacion=el.fechaCreacion !== undefined && el.fechaCreacion !== null && el.fechaCreacion !== '' ? new Date(_fecha).toString()   : undefined;
            diezmo.idPersona = el.idPersona;
            diezmo.monto = el.monto;
            
            this.diezmos.push(diezmo);

          });
        });
      this.diezmos$.next(this.diezmos);
//console.log( JSON.stringify(this.diezmos));
    } catch (e) {
      console.log("ERROR: " + e);
    }

  }





  obtenerDiezmos$(): Observable<Persona[]> {
    return this.diezmos$.asObservable();
  }
}
