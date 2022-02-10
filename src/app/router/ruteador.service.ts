import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ignoreElements } from 'rxjs';
import { UtilidadesService } from '../services/compartido/utilidades.service';
import { General } from '../dataModels/staticGeneral';

@Injectable({
  providedIn: 'root'
})
export class RuteadorService {


  variableSesion: any;

  constructor(private router: Router, private utilidadesService: UtilidadesService) {


  }


  existeSessionActiva() {
    this.variableSesion = localStorage.getItem(General.DATOS_SESION);
    if (this.variableSesion === null || this.variableSesion === '') {
      this.router.navigate(["/login"]);
    }

  }



  async servidorActivo(_ruta: string): Promise<any> {
    try {
      await this.utilidadesService.servidorActivo().then(resultado => {
        let _ruta_historia = localStorage.getItem("ruta_historia");

        if (resultado) {

          if (_ruta_historia !== undefined && _ruta_historia !== "") {
            localStorage.setItem("ruta_historia", "");
            this.router.navigate([_ruta_historia]);
          }

        } else {
          localStorage.setItem("ruta_historia", _ruta);
          this.router.navigate(["/dashboard/pagina503"]);

        }

      });
    }
    catch (error) {

    }
  }





  async servidorActivoInicio(): Promise<boolean> {
    let estado: boolean = false;
    try {
      await this.utilidadesService.servidorActivo().then(resultado => {

        if (resultado) {
          estado = true;
        } else {
          estado = false;
        }

      });
    }
    catch (error) {
      estado = false;
    }

    return estado;
  }








}


//:::: VARIABLES DE SESION ::::::
/*
usuario : Tiene una estructura




*/
