import { Component, OnInit } from '@angular/core';
import { Persona } from 'src/app/dataModels/persona';
import { PersonaService } from 'src/app/services/persona/persona.service';

@Component({
  selector: 'app-contacts-person',
  templateUrl: './contacts-person.component.html',
  styleUrls: []
})
export class ContactsPersonComponent implements OnInit {

  personas:Persona[]=[];

  constructor(private personaService:PersonaService) { }

  ngOnInit(): void {
    this.personaService.consultarPersonas();


    this.personaService.obtenerPersonas().subscribe(personas =>{
      this.personas=personas;
 
    });

  }

}
