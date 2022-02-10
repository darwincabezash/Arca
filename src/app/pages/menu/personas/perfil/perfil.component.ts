import { Component, OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Escuela } from 'src/app/dataModels/escuela';
import { Persona } from 'src/app/dataModels/persona';
import { EscuelaService } from 'src/app/services/catalogos/escuela.service';
import { PaquetePerfilServicio, PerfilService } from 'src/app/services/perfil/perfil.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: []
})
export class PerfilComponent implements OnInit {
  @Input() personaEntrante: Persona
  
  editandoPersonas = false;

  mostrarBotonesEdit = false;
  cantidadEscuelas: number = 0;
  mostrarBotonAtras = false;
  paquetePerfilServicio: PaquetePerfilServicio;

  constructor(private perfilService:PerfilService,private escuelaService:EscuelaService,private router: Router,private location: Location) { 
    this.paquetePerfilServicio = new PaquetePerfilServicio();
    this.paquetePerfilServicio=perfilService.obtenerPersona();
    
    this.personaEntrante = this.paquetePerfilServicio.contenido;
  }

  ngOnInit(): void {

    this.escuelaService.consultarEscuelaCantidad().then((cantidad) => {
      this.cantidadEscuelas = cantidad;
    });

  }

  
    obtenerPorcentaje(escuelas: Escuela[]): String {
      if (escuelas !== undefined) {
        if (escuelas.length > 0) {
          let porcentaje = (escuelas.length / this.cantidadEscuelas) * 100;
          return porcentaje.toString() + "%"
        }
      }
      return "0%";
    }
  
    obtenerColorFondoBarra(_escuela: Escuela[]) {
      let _porcentaje = 0;
      if (_escuela !== undefined) {
        if (_escuela.length > 0) {
          _porcentaje = (_escuela.length / this.cantidadEscuelas) * 100;
  
  
          //ROJO
          if (_porcentaje < 20) {
            return "#A91A17";
          }
  
          //NARANJA
          if (_porcentaje > 19 && _porcentaje < 46) {
            return "#E68E25";
          }
  
          //AZUL
          if (_porcentaje > 45 && _porcentaje < 80) {
            return "#3291CF";
          }
  
          //VERDE
          if (_porcentaje >= 80) {
            return "#2AC26A";
          }
        }
  
      }
      return 0;
    }


  obtenerFecha(_fechaNacimiento: any) {

    console.log("FECHA 1   :  " + _fechaNacimiento);
    if (_fechaNacimiento !== undefined) {

      let _dia = new Date(_fechaNacimiento).toLocaleString('es', { day: 'numeric' });
      let _mes: String = new Date(_fechaNacimiento).toLocaleString('es', { month: 'long', });
      let _año: any = new Date(_fechaNacimiento).toLocaleString('es', { year: 'numeric', });

      let _fechaCumpleanio = _dia + " de " + _mes[0].toUpperCase() + _mes.slice(1) + (_año > 2000 ? " del " : " de ") + _año;

      console.log("FECHA 2   :  " + _fechaCumpleanio);

      return _fechaCumpleanio;
    } else {
      return "No Disponible"

    }
  }
  
  regresar() {
     this.location.back();
  }
  
  mostrarBotonesEditar() {
    this.editandoPersonas = false;
    this.mostrarBotonesEdit ? this.mostrarBotonesEdit = false : this.mostrarBotonesEdit=true;
    console.log(this.mostrarBotonesEdit);
  }

  mostrarBotonesFinalizarModificado() {
    this.editandoPersonas = true;
    this.mostrarBotonesEdit ? this.mostrarBotonesEdit = false : this.mostrarBotonesEdit=true;
    console.log(this.mostrarBotonesEdit);
  }

    editarPersona(_persona:Persona) {
    this.perfilService.establecerPersona(_persona,true);
    this.router.navigate(["/dashboard/perfil"]);

}
  
}
