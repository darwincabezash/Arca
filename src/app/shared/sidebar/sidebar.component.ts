import { Component, OnInit } from '@angular/core';
import { PersonaService } from 'src/app/services/persona/persona.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: []
})
export class SidebarComponent implements OnInit {


  totalPersonas:number=0;

  constructor(private personaService:PersonaService) { 

    this.personaService.obtenerPersonas().subscribe(personas =>{
      this.totalPersonas=personas.length;
      
    });


  }

  ngOnInit(): void {
  }

}
