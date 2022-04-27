import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

    
  //TIPO PROCESO
  private nuevaPersona: String="";
  private nuevaPersona$: Subject<String>;

  resultado: any;
  constructor() {
    this.nuevaPersona$ = new Subject();
  }


  

  notificarPersonaNueva(_id:string) {
    this.nuevaPersona$.next(_id);

  }


  obtenerNotificacionNuevaPersona$(): Observable<String> {
    return this.nuevaPersona$.asObservable();
  }
}
