import { RuteadorService } from './../../router/ruteador.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: []
})
export class DashboardComponent implements OnInit {


  constructor(private sesion:RuteadorService) { }

  ngOnInit(): void {
    
      this.sesion.existeUsuarioActivo();
  }

  

}
