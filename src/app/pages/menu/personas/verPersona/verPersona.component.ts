import { Component, OnInit } from '@angular/core';
import { RuteadorService } from 'src/app/router/ruteador.service';
import {PersonaService} from "src/app/services/persona/persona/persona.service";
import { Persona, DatoBasicoPersona } from '../../../../dataModels/persona';

declare var tableUtil: any;

@Component({
  selector: 'app-view-persons',
  templateUrl: './verPersona.component.html',
  styleUrls: []
})
export class ViewPersonsComponent implements OnInit {

  personas:Persona[]=[];

  constructor(private personaService:PersonaService,private sesion:RuteadorService) { 
    sesion.existeUsuarioActivo();
  }

  ngOnInit(): void {
    //new tableUtil();

    this.personaService.consultarPersonas();


    this.personaService.obtenerPersonas().subscribe(personas =>{
      this.personas=personas;
 
    });

  }

}
