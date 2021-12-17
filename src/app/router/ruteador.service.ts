import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ignoreElements } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RuteadorService {


  variableSesion: any;

  constructor(private router :Router) {


  }


  existeUsuarioActivo() {
    this.variableSesion = localStorage.getItem("usuario");
    if(this.variableSesion===null || this.variableSesion==='')
    {
      this.router.navigate(["/login"]);
    }

  }


}


//:::: VARIABLES DE SESION ::::::
/*
usuario : Tiene una estructura




*/
