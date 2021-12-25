import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ignoreElements } from 'rxjs';
import { UtilidadesService } from '../services/utilidades/utilidades';

@Injectable({
  providedIn: 'root'
})
export class RuteadorService {


  variableSesion: any;

  constructor(private router: Router, private utilidadesService: UtilidadesService) {


  }


  existeUsuarioActivo() {
    this.variableSesion = localStorage.getItem("usuario");
    if(this.variableSesion===null || this.variableSesion==='')
    {
      this.router.navigate(["/login"]);
    }

  }



  async servidorActivo(_ruta:string):Promise<any> {
    await this.utilidadesService.servidorActivo().then(resultado => {
      let _ruta_historia = localStorage.getItem("ruta_historia");

      if (resultado)
      {

        if (_ruta_historia !== undefined && _ruta_historia !== "") {
          localStorage.setItem("ruta_historia","");
          this.router.navigate([_ruta_historia]);
        }

      }       else {
        localStorage.setItem("ruta_historia", _ruta);
        this.router.navigate(["/dashboard/pagina503"]);

        }

    });
    
  }

  


  


}


//:::: VARIABLES DE SESION ::::::
/*
usuario : Tiene una estructura




*/
