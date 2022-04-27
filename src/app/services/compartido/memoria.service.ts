import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Persona } from 'src/app/dataModels/persona';
import { SessionUsuario } from 'src/app/dataModels/sessionUsuario';
import { Sesiones } from 'src/app/shared/general/staticGeneral';
import { PersonaService } from '../persona/persona/persona.service';

@Injectable({
  providedIn: 'root',
})
export class MemoriaService {
  private personas$: Subject<Persona[]>;
  persona: Persona[] = [];
  constructor() {
    this.personas$ = new Subject();
  }

  //:::::::::::::::::::::::::::::::::::::::::: PERSONA
  //#region
  // GUARDAR

  guardarLocalPersona(_persona: Persona[]) {
    const obj = JSON.stringify(_persona);
    try {
      
      localStorage.setItem(Sesiones.DATOS_PERSONA, obj);
    } catch {}
   


    //this.personas$.next(this.persona);
    
    //this.sendMessage();
  }

  //VERIFICAR EXISTENCIA
  existeLocalPersona() {
    if (localStorage.getItem(Sesiones.DATOS_PERSONA)) {
      return true;
    } else {
      return false;
    }
  }

  //RETORNAR
  obtenerLocalPersona() {
    let obj = localStorage.getItem(Sesiones.DATOS_PERSONA);
    if (obj) {
      const persona = JSON.parse(obj) as Persona[];
      return persona;
    } else {
      return null;
    }
  }

  //ELIMINAR
  eliminarLocalPersona() {
    localStorage.setItem(Sesiones.DATOS_SESION, '');
  }

  //#endregion

  eliminarLocalTodo() {
    //PERSONA
    localStorage.setItem(Sesiones.DATOS_SESION, '');
  }

  obtenerPersonasMemoria$(): Observable<Persona[]> {
    return this.personas$.asObservable();
  }









  private subject = new Subject<any>();

  sendMessage() {
    this.subject.next(true);
  }


  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
