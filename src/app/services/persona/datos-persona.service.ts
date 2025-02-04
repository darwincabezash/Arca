

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Persona, DatoBasicoPersona } from 'src/app/dataModels/persona';


@Injectable({
  providedIn: 'root'
})

export class DatosPersonaService {

  persona: Persona;
  private persona$: Subject<Persona>;
  dato: any;
  personaLista: boolean = false;

  constructor() {
    this.persona = new Persona();
    this.persona$ = new Subject();

  }


  /*

    cedula?:number
    primerNombre?:String
    segundoNombre?:String
    primerApellido?:String
    segundoApellido?:String
    fechaNacimiento?:Date
    telefono?:number
    celular?:number
    direccion?:String
    email?:String
    sexo?:String
    foto?:String

   * */

  //DATOS BASICOS

  extraerPersonaDeBase() {

    this.dato = localStorage.getItem('persona')
    if (this.dato.length > 0) {
      this.personaLista = true;
      const _persona = JSON.parse(this.dato) as Persona;

      this.persona = _persona;
      this.persona$.next(this.persona);

    } else {
      let datoBasicoPersona: DatoBasicoPersona=new DatoBasicoPersona();
      this.persona = new Persona();
      this.persona.datoBasicoPersona = datoBasicoPersona;
      this.persona$.next(this.persona);
    }
      
  }

  obtenerPersona() {
    if (!this.personaLista) { this.extraerPersonaDeBase(); }
    return this.persona; 
  }


  //REVISAR LO QUE SIGUE HACIA ABAJO Y SI NO SIRVE, ELIMINAR
  //CEDULA
  pCedula() {
    if (!this.personaLista) { this.extraerPersonaDeBase(); }
    return this.persona.datoBasicoPersona?.cedula;
  }
  //PRIMER NOMBRE
  pPrimerNombre() {
    if (!this.personaLista) { this.extraerPersonaDeBase(); }
    return this.persona.datoBasicoPersona?.primerNombre;
  }

  //SEGUNDO NOMBRE
  pSegundoNombre() {
    if (!this.personaLista) { this.extraerPersonaDeBase(); }
    return this.persona.datoBasicoPersona?.segundoNombre;
  }

  //PRIMER APELLDIO
  pPrimerApellid() {
    if (!this.personaLista) { this.extraerPersonaDeBase(); }
    return this.persona.datoBasicoPersona?.primerApellido;
  }

  //SEGUNDO APELLIDO
  pSegundoApellid() {
    if (!this.personaLista) { this.extraerPersonaDeBase(); }
    return this.persona.datoBasicoPersona?.segundoApellido;
  }

  //NOMBRE Y APELLIDO
  pNombreYApelldo() {
    if (!this.personaLista) { this.extraerPersonaDeBase(); }
    return this.persona.datoBasicoPersona?.primerNombre + " " + this.persona.datoBasicoPersona?.primerApellido;
  }

  //FECHA DE NACIMIENTO


  // TELEFONO


  //CELULAR


  //DIRECICON


  //EMAIL


  //SEXO

  //FOTO
  pFoto() {
    if (!this.personaLista) { this.extraerPersonaDeBase(); }
    return this.persona.datoBasicoPersona?.foto;
  }


  ngOnDestroy() {
    this.personaLista = false;
  }

  obtenerPersonaLogin$(): Observable<Persona> {
    return this.persona$.asObservable();
  }
}
