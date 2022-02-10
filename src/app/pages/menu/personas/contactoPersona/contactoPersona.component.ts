import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Escuela } from 'src/app/dataModels/escuela';
import { Persona } from 'src/app/dataModels/persona';
import { RuteadorService } from 'src/app/router/ruteador.service';
import { EscuelaService } from 'src/app/services/catalogos/escuela.service';
import { TipoProcesoService } from 'src/app/services/catalogos/tipo-proceso.service';
import { MemoriaService } from 'src/app/services/compartido/memoria.service';
import { PerfilService } from 'src/app/services/perfil/perfil.service';
import { PersonaService } from 'src/app/services/persona/persona/persona.service';

@Component({
  selector: 'app-contacts-person',
  templateUrl: './contactoPersona.component.html',
  styleUrls: []
})
export class ContactoPersonaComponent implements OnInit {

  personas: Persona[] = [];
  anioActual: number = 0;
  cantidadEscuelas = 0;
  cantidadTipoProcesos = 0;

  constructor(private personaService: PersonaService, private sesion: RuteadorService,
    private ruteadorService: RuteadorService, private router: Router, private escuelaService: EscuelaService, 
    private tipoProcesoService: TipoProcesoService, private perfilService: PerfilService,
    private memoriaService: MemoriaService
  ) {
    sesion.existeSessionActiva();
    this.anioActual = new Date().getFullYear();
  }

  ngOnInit(): void {
    this.ruteadorService.servidorActivo(this.router.url);

    //this.personaService.consultarPersonas();


    /*this.personaService.obtenerPersonas$().subscribe(personas => {
      this.personas = personas;

    });*/
    let personas: any = this.memoriaService.obtenerLocalPersona();
    if (personas) {
      this.personas = personas;
      console.log("ahora tengo: "+this.personas.length+" personas.");
    }

    this.escuelaService.consultarEscuelaCantidad().then((cantidad) => {
      this.cantidadEscuelas = cantidad;
    });


    this.tipoProcesoService.consultarTipoProcesoCantidad().then((cantidad) => {
      this.cantidadTipoProcesos = cantidad;
    });
  }

  obtenerCumpleanios(_fechaNacimiento: any) {
    if (_fechaNacimiento !== undefined) {

      let _dia = new Date(_fechaNacimiento).toLocaleString('es', { day: 'numeric' });
      let _mes: String = new Date(_fechaNacimiento).toLocaleString('es', { month: 'long', });

      let _fechaCumpleanio = _dia + " de " + _mes[0].toUpperCase() + _mes.slice(1);
      return _fechaCumpleanio;
    } else {
      return "No Disponible"

    }
  }

  obtenerEdad(_añoActual: number, _fechaNacimiento: any) {
    let fechaN = new Date(_fechaNacimiento);
    if (_fechaNacimiento !== undefined) {
      return _añoActual - fechaN.getFullYear() + " Años";
    } else {
      return "No Disponible"
    }

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

  verPerfil(_persona: Persona) {
    

    this.perfilService.establecerPersona(_persona,true);
    this.router.navigate(["/dashboard/perfil"]);

  }

}
