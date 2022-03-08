import { Persona } from 'src/app/dataModels/persona';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  mostrarBotonAtras: boolean = false;
  paginaAnterior: String = "";

  paquetePerfilServicio: PaquetePerfilServicio;

  constructor() {
    this.paquetePerfilServicio = new PaquetePerfilServicio();
    //this.mostrarBotonAtras = this.paquetePerfilServicio.mostrarBotonAtras!;
    //this.mostrarBotonAtras = this.paquetePerfilServicio.mostrarBotonAtras!;
  }

  establecerPersona(_persona: Persona, _mostrarBotonAtras: boolean,_paginaAnterior:String) {
    this.paquetePerfilServicio.contenido = _persona;
    this.paquetePerfilServicio.mostrarBotonAtras = _mostrarBotonAtras;
    this.paquetePerfilServicio.paginaAnterior = _paginaAnterior;
  }

  obtenerPersona() {
    return this.paquetePerfilServicio;
  }
}

export class PaquetePerfilServicio {
  contenido: any;
  mostrarBotonAtras?: boolean;
  paginaAnterior?: String;
}
