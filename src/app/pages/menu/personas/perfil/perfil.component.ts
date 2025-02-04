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
import Per from './perfilVista';
import { UtilidadesService } from 'src/app/services/compartido/utilidades.service';
import PerfilVista from './perfilVista';
import { AvatarComponentData } from 'src/app/partes/atomos/avatar/avatar.component';
import { BarraProgresoComponentData } from 'src/app/partes/atomos/barra-progreso/barra-progreso.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: [],
})
export class PerfilComponent implements OnInit {
  //@Input() personaEntrante: Persona
  personaEntrante: Persona;

  perfilVista!: PerfilVista;
  rutaImagenErrorHombre = '../../../../../assets/images/H.jpg';
  rutaImagenErrorMujer = '../../../../../assets/images/M.jpg';

  editandoPersonas = false;

  mostrarBotonesEdit = false;
  cantidadEscuelas: number = 0;
  cantidadProcesos: number = 0;
  cantidadGrupos: number = 0;
  cantidadSeminarios: number = 0;
  mostrarBotonAtras = false;
  paquetePerfilServicio: PaquetePerfilServicio;

  avatarComponentData!: AvatarComponentData;
  barraProgresoComponentData!: BarraProgresoComponentData;

  constructor(
    private perfilService: PerfilService,
    private escuelaService: EscuelaService,
    private router: Router,
    private location: Location,
    private utilidadesService: UtilidadesService
  ) {
    this.perfilVista = new PerfilVista();
    this.paquetePerfilServicio = new PaquetePerfilServicio();
    this.paquetePerfilServicio = perfilService.obtenerPersona();

    this.personaEntrante = this.paquetePerfilServicio.contenido;
  }

  ngOnInit(): void {
    this.escuelaService.consultarEscuelaCantidad().then((cantidad) => {
      this.cantidadEscuelas = cantidad;

      //BARRA ESCUELA
      let porcentajeBarra = this.obtenerPorcentaje(
        this.personaEntrante.escuela!,
        'E'
      );

      console.log('********  : ' + porcentajeBarra);

      let colorRellenoBarra = this.obtenerColorFondoBarra(
        porcentajeBarra
      );

      this.barraProgresoComponentData = new BarraProgresoComponentData();
      this.barraProgresoComponentData.colorRellenoBarra =
        colorRellenoBarra;
      this.barraProgresoComponentData.colorFondoBarra = '#C2C7D0';
      this.barraProgresoComponentData.altura = '5px';
      this.barraProgresoComponentData.fontSize = '10px;';
      this.barraProgresoComponentData.porcentajeBarra = porcentajeBarra;
      this.barraProgresoComponentData.radio = '20px;';

      this.perfilVista._barraProgresoComponentDataEscuela =
        this.barraProgresoComponentData;
      
      this.perfilVista._colorTextoEscuela = colorRellenoBarra;
      this.perfilVista._porcentajeEscuela = porcentajeBarra
    });

    this.escuelaService.consultarProcesoCantidad().then((cantidad) => {
      this.cantidadProcesos = cantidad;

      //BARRA PROCESO
      let porcentajeBarra = this.obtenerPorcentaje(
        this.personaEntrante.proceso!,
        'P'
      );

      let colorRellenoBarra = this.obtenerColorFondoBarra(
        porcentajeBarra
      );

      this.barraProgresoComponentData = new BarraProgresoComponentData();
      this.barraProgresoComponentData.colorRellenoBarra =
        colorRellenoBarra;
      this.barraProgresoComponentData.colorFondoBarra = '#C2C7D0';
      this.barraProgresoComponentData.altura = '5px';
      this.barraProgresoComponentData.fontSize = '10px';
      this.barraProgresoComponentData.porcentajeBarra = porcentajeBarra;
      this.barraProgresoComponentData.radio = '20px';

      this.perfilVista._barraProgresoComponentDataProceso =
        this.barraProgresoComponentData;

      this.perfilVista._colorTextoProceso = colorRellenoBarra;

      this.perfilVista._porcentajeProceso = porcentajeBarra;
    });
    this.escuelaService.consultarGrupoCantidad().then((cantidad) => {
      this.cantidadGrupos = cantidad;

      //BARRA GRUPO
      let porcentajeBarra = this.obtenerPorcentaje(
        this.personaEntrante.grupo!,
        'G'
      );

      let colorRellenoBarra = this.obtenerColorFondoBarra(
        porcentajeBarra
      );

      this.barraProgresoComponentData = new BarraProgresoComponentData();
      this.barraProgresoComponentData.colorRellenoBarra =
        colorRellenoBarra;
      this.barraProgresoComponentData.colorFondoBarra = '#C2C7D0';
      this.barraProgresoComponentData.altura = '5px';
      this.barraProgresoComponentData.fontSize = '10px';
      this.barraProgresoComponentData.porcentajeBarra = porcentajeBarra;
      this.barraProgresoComponentData.radio = '20px';

      this.perfilVista._barraProgresoComponentDataGrupo =
        this.barraProgresoComponentData;

      this.perfilVista._colorTextoGrupo = colorRellenoBarra;
            this.perfilVista._porcentajeGrupo = porcentajeBarra;

    });

    this.escuelaService.consultarSeminarioCantidad().then((cantidad) => {
      this.cantidadSeminarios = cantidad;

      //BARRA SEMINARIO
      let porcentajeBarra = this.obtenerPorcentaje(
        this.personaEntrante.seminario!,
        'S'
      );

      let colorRellenoBarra = this.obtenerColorFondoBarra(
        porcentajeBarra
      );

      this.barraProgresoComponentData = new BarraProgresoComponentData();
      this.barraProgresoComponentData.colorRellenoBarra =
        colorRellenoBarra;
      this.barraProgresoComponentData.colorFondoBarra = '#C2C7D0';
      this.barraProgresoComponentData.altura = '5px';
      this.barraProgresoComponentData.fontSize = '10px';
      this.barraProgresoComponentData.porcentajeBarra = porcentajeBarra;
      this.barraProgresoComponentData.radio = '20px';

      this.perfilVista._barraProgresoComponentDataSeminario =
        this.barraProgresoComponentData;

      this.perfilVista._colorTextoSeminario = colorRellenoBarra;
                  this.perfilVista._porcentajeSeminario = porcentajeBarra;

    });

    //FOTO
    this.avatarComponentData = new AvatarComponentData();

    this.avatarComponentData.ancho = '100px';
    this.avatarComponentData.alto = '100px';

    if (
      this.utilidadesService.campoEsValido(
        this.personaEntrante.datoBasicoPersona!.foto
      )
    ) {
      this.avatarComponentData.imagen =
        this.personaEntrante.datoBasicoPersona!.foto;
    } else {
      this.avatarComponentData.imagen =
        this.personaEntrante.datoBasicoPersona!.sexo == 'H'
          ? this.rutaImagenErrorHombre
          : this.rutaImagenErrorMujer;
    }

    this.perfilVista._avatarComponentData = this.avatarComponentData;

    console.log(JSON.stringify(this.barraProgresoComponentData));
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
    if (_fechaNacimiento !== undefined && _fechaNacimiento !== null) {
      if (_fechaNacimiento.toString().length == 0) {
        return '';
      }
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
