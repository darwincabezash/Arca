import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Escuela } from 'src/app/dataModels/escuela';
import { Persona } from 'src/app/dataModels/persona';
import { EscuelaService } from 'src/app/services/catalogos/escuela.service';
import {
  PaquetePerfilServicio,
  PerfilService,
} from 'src/app/services/perfil/perfil.service';
import { Location } from '@angular/common';
import { Seminario } from 'src/app/dataModels/seminarios';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: [],
})
export class PerfilComponent implements OnInit {
  //@Input() personaEntrante: Persona
  personaEntrante: Persona;
  editandoPersonas = false;

  mostrarBotonesEdit = false;
  cantidadEscuelas: number = 0;
  cantidadProcesos: number = 0;
  cantidadGrupos: number = 0;
  cantidadSeminarios: number = 0;
  mostrarBotonAtras = false;
  paquetePerfilServicio: PaquetePerfilServicio;

  constructor(
    private perfilService: PerfilService,
    private escuelaService: EscuelaService,
    private router: Router,
    private location: Location
  ) {
    this.paquetePerfilServicio = new PaquetePerfilServicio();
    this.paquetePerfilServicio = perfilService.obtenerPersona();

    this.personaEntrante = this.paquetePerfilServicio.contenido;
  }

  ngOnInit(): void {
    this.escuelaService.consultarEscuelaCantidad().then((cantidad) => {
      this.cantidadEscuelas = cantidad;
    });

    this.escuelaService.consultarProcesoCantidad().then((cantidad) => {
      this.cantidadProcesos = cantidad;
    });
    this.escuelaService.consultarGrupoCantidad().then((cantidad) => {
      this.cantidadGrupos = cantidad;
    });

    this.escuelaService.consultarSeminarioCantidad().then((cantidad) => {
      this.cantidadSeminarios = cantidad;
    });
  }

  obtenerPorcentaje(lista: any[], tipoLista: any): number {
    if (lista !== undefined) {
      switch (tipoLista) {
        case 'E':
          if (lista.length > 0) {
            let porcentaje = (lista.length / this.cantidadEscuelas) * 100;
            return Math.round(porcentaje);
          }
          break;
        case 'P':
          if (lista.length > 0) {
            let porcentaje = (lista.length / this.cantidadProcesos) * 100;
            return Math.round(porcentaje);
          }
          break;
        case 'G':
          if (lista.length > 0) {
            let porcentaje = (lista.length / this.cantidadGrupos) * 100;
            console.log('*********************************');
            console.log('TAMAÑO DE LISTA:  ' + lista.length);
            console.log('CANTIDAD GRUPOS:  ' + this.cantidadGrupos);
            console.log('PORENTAJE:  ' + porcentaje);
            console.log('*********************************');
            return Math.round(porcentaje);
          }
          break;
        case 'S':
          if (lista.length > 0) {
            let porcentaje = (lista.length / this.cantidadSeminarios) * 100;

            return Math.round(porcentaje);
          }
          break;
      }
    }
    return 0;
  }

  /*
  obtenerPorcentaje(lista: any[], tipoLista: any): String {
    if (lista !== undefined) {
      switch (tipoLista) {
        case 'e':
          if (lista.length > 0) {
            let porcentaje = (seminario.length / this.cantidadEscuelas) * 100;
            return Math.round(porcentaje).toString() + '%';
          }
          break;
      }

      if (seminario.length > 0) {
        let porcentaje = (seminario.length / this.cantidadEscuelas) * 100;
        return Math.round(porcentaje).toString() + '%';
      }
    }
    return '0%';
  }
   */

  //obtenerColorFondoBarra(_escuela: Escuela[]) {
  obtenerColorFondoBarra(porcentaje: number) {
    console.log('///////////////////// RECIBO:  ' + porcentaje);

    //let _porcentaje = 0;
    if (porcentaje !== undefined) {
      //if (_escuela.length > 0) {
      //_porcentaje = (_escuela.length / this.cantidadEscuelas) * 100;

      //ROJO
      if (porcentaje < 20) {
        return '#A91A17';
      }

      //NARANJA
      if (porcentaje > 19 && porcentaje < 46) {
        return '#E68E25';
      }

      //AZUL
      if (porcentaje > 45 && porcentaje < 80) {
        console.log('########################  ' + 'LLEGO');
        return '#3291CF';
      }

      //VERDE
      if (porcentaje >= 80) {
        return '#2AC26A';
      }
      //}
    }
    return 0;
  }

  obtenerFecha(_fechaNacimiento: any) {
    console.log('FECHA 1   :  ' + _fechaNacimiento);

    if (_fechaNacimiento !== undefined && _fechaNacimiento !== null) {
      if (_fechaNacimiento.toString().length == 0) {
        return '';
      }
      console.log('BIEN ENTRO..... ' + _fechaNacimiento);
      let _dia = new Date(_fechaNacimiento).toLocaleString('es', {
        day: 'numeric',
      });
      let _mes: String = new Date(_fechaNacimiento).toLocaleString('es', {
        month: 'long',
      });
      let _año: any = new Date(_fechaNacimiento).toLocaleString('es', {
        year: 'numeric',
      });

      let _fechaCumpleanio =
        _dia +
        ' de ' +
        _mes[0].toUpperCase() +
        _mes.slice(1) +
        (_año > 2000 ? ' del ' : ' de ') +
        _año;

      console.log('FECHA 2   :  ' + _fechaCumpleanio);

      return _fechaCumpleanio;
    } else {
      return '';
    }
  }

  regresar() {
    this.location.back();
  }

  mostrarBotonesEditar() {
    this.editandoPersonas = false;
    this.mostrarBotonesEdit
      ? (this.mostrarBotonesEdit = false)
      : (this.mostrarBotonesEdit = true);
    console.log(this.mostrarBotonesEdit);
  }

  mostrarBotonesFinalizarModificado() {
    this.editandoPersonas = true;
    this.mostrarBotonesEdit
      ? (this.mostrarBotonesEdit = false)
      : (this.mostrarBotonesEdit = true);
    console.log(this.mostrarBotonesEdit);
  }

  /*editarPersona(_persona: Persona) {
    this.perfilService.establecerPersona(_persona, true);
    this.router.navigate(['/dashboard/perfil']);
  }*/
}
