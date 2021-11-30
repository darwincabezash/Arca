import { Component, OnInit } from '@angular/core';
import {PersonaService} from "../../services/persona/persona.service";
import { Persona, DatoBasicoPersona } from '../../dataModels/persona';

declare var tableUtil: any;

@Component({
  selector: 'app-view-persons',
  templateUrl: './view-persons.component.html',
  styleUrls: []
})
export class ViewPersonsComponent implements OnInit {

  personas:Persona[]=[];

  constructor(private personaService:PersonaService) { }

  ngOnInit(): void {
    //new tableUtil();

    this.personaService.consultarPersonas();


    this.personaService.obtenerPersonas().subscribe(personas =>{
      this.personas=personas;
 
    });

  }

}
