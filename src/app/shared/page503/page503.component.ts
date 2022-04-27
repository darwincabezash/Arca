import { Component, OnInit } from '@angular/core';
import { RuteadorService } from 'src/app/router/ruteador.service';

@Component({
  selector: 'app-page503',
  templateUrl: './page503.component.html',
  styleUrls: []
})
export class Page503Component implements OnInit {

  constructor(private ruteadorService: RuteadorService) { }

  ruta_historia: string="";
  ngOnInit(): void {
    this.ruta_historia = localStorage.getItem("ruta_historia")!;

    this.ruteadorService.servidorActivo(this.ruta_historia);
  }

}
