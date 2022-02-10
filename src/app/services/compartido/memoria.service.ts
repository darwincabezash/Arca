import { Injectable } from '@angular/core';
import { Persona } from 'src/app/dataModels/persona';
import { SessionUsuario } from 'src/app/dataModels/sessionUsuario';
import { General } from 'src/app/dataModels/staticGeneral';
import { PersonaService } from '../persona/persona/persona.service';

@Injectable({
  providedIn: 'root',
})
export class MemoriaService {
  constructor(private personaService: PersonaService) {}

  //:::::::::::::::::::::::::::::::::::::::::: PERSONA
  //#region
  // GUARDAR
  
  guardarLocalPersona(_persona: Persona[]) {
    try {
      const obj = JSON.stringify(_persona);
      localStorage.setItem(General.DATOS_PERSONA, obj);
    } catch {}
  }

  //VERIFICAR EXISTENCIA
  existeLocalPersona() {
    if (localStorage.getItem(General.DATOS_PERSONA)) {
      return true;
    } else {
      return false;
    }
  }

  //RETORNAR
  obtenerLocalPersona() {
    let obj = localStorage.getItem(General.DATOS_PERSONA);
    if (obj) {
      const persona = JSON.parse(obj) as Persona[];
      return persona
    } else {
      return null;
    }
  }

  //ELIMINAR
  eliminarLocalPersona() {
    localStorage.setItem(General.DATOS_SESION, '');
  }


  //#endregion

  eliminarLocalTodo() {
    //PERSONA
    localStorage.setItem(General.DATOS_SESION, '');
  }
}
