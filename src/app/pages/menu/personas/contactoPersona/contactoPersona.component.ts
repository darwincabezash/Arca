import { Component, OnInit } from '@angular/core';
import { Persona } from 'src/app/dataModels/persona';
import { RuteadorService } from 'src/app/router/ruteador.service';
import { PersonaService } from 'src/app/services/persona/persona/persona.service';

@Component({
  selector: 'app-contacts-person',
  templateUrl: './contactoPersona.component.html',
  styleUrls: []
})
export class ContactsPersonComponent implements OnInit {

  personas:Persona[]=[];

  constructor(private personaService:PersonaService,private sesion:RuteadorService) {
    sesion.existeUsuarioActivo();

   }

  ngOnInit(): void {
    this.personaService.consultarPersonas();


    this.personaService.obtenerPersonas().subscribe(personas =>{
      this.personas=personas;
 
    });

  }

}
