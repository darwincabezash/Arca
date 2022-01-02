import { Persona } from 'src/app/dataModels/persona';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  mostrarBotonAtras:boolean = false;

  paquetePerfilServicio: PaquetePerfilServicio;


  constructor() {
    this.paquetePerfilServicio = new PaquetePerfilServicio();
    this.mostrarBotonAtras = this.paquetePerfilServicio.mostrarBotonAtras!;
  }



  establecerPersona(_persona: Persona,_mostrarBotonAtras:boolean) {
    this.paquetePerfilServicio.contenido = _persona;
    this.paquetePerfilServicio.mostrarBotonAtras = _mostrarBotonAtras;
  }

  obtenerPersona() {
    return this.paquetePerfilServicio;
  }

}

export class PaquetePerfilServicio{
  contenido: any
  mostrarBotonAtras?: boolean;
}
