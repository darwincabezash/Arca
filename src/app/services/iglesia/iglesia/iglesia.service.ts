import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Iglesia } from 'src/app/dataModels/iglesia';
import { GlobalDataService } from '../../../global/globalDataServices';

@Injectable({
  providedIn: 'root'
})

export class IglesiaService {
  server: RequestInfo = GlobalDataService.getServer();
  private iglesias: Iglesia[];

  private iglesia: Iglesia[] = [];;
  private iglesias$: Subject<Iglesia[]>;


  constructor() {
    this.iglesias = [];
    this.iglesias$ = new Subject();
  }

  j:number = 0;

  //CONSULTAR
  async consultarIglesia(_codIglesia: String) {
    this.iglesias$= new Subject();
    this.iglesias = [];
    this.j++;
    try {
      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `query{
              iglesia(input:{
                _id:"${_codIglesia}"}){
                _id
                nombreIglesia
                estado
                logo
              }
            }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          try {
            if (result.data.iglesia.length > 0) {
              console.log("si bien");
              let iglesia = new Iglesia
              iglesia._id = result.data.iglesia[0]._id;
              iglesia.nombreIglesia = result.data.iglesia[0].nombreIglesia;
              iglesia.estado = result.data.iglesia[0].estado;
              iglesia.logo = result.data.iglesia[0].logo;
              this.iglesias.push(iglesia);
            }
          }
            catch {

            }

        });
      this.iglesias$.next(this.iglesias);


    } catch (e) {
      console.log("ERROR: " + e);
      this.iglesias$.next(this.iglesias);

    }
  }

  obteneriglesia(): Observable<Iglesia[]> {
    return this.iglesias$.asObservable();
  }

}

