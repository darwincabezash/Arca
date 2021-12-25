import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DatoBasicoPersona, Persona } from 'src/app/dataModels/persona';
import { DatosPersonaService } from 'src/app/services/persona/datos-persona.service';
import { PersonaService } from 'src/app/services/persona/persona/persona.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: []
})

export class SidebarComponent implements OnInit {

  totalPersonas: number = 0;
  persona: Persona;


  datosPersonaSesion: any;
  personaLista: boolean = false;

  constructor(private personaService: PersonaService,private datosPersonaService:DatosPersonaService) {
    this.persona = new Persona();
    
    this.personaService.consultarDatosBasicosPersonas();
    this.personaService.obtenerPersonas$().subscribe(personas =>{
      this.totalPersonas=personas.length;
      
    });

    
    this.extraerPersonaDeBase();
    

  }

  ngOnInit(): void {
    //this.persona = this.datosPersonaService.obtenerPersona();
  }


  extraerPersonaDeBase() {

    this.datosPersonaSesion = localStorage.getItem('persona');
    if (this.datosPersonaSesion.length > 0) {
      this.personaLista = true;
      const _persona = JSON.parse(this.datosPersonaSesion) as Persona;
      this.persona = _persona;
    } else {
      //AQUI SE DEBE EMITIR UN ERROR EN CASO DE QUE NO SE HAYA PODIDO CARGAR A LA PERSONA
      let datoBasicoPersona: DatoBasicoPersona = new DatoBasicoPersona();
      this.persona = new Persona();
      this.persona.datoBasicoPersona = datoBasicoPersona;
    }

  }

}
