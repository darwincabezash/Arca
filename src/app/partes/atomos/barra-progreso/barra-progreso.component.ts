import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'atomo-app-barra-progreso',
  templateUrl: './barra-progreso.component.html',
  styleUrls: [],
})
export class BarraProgresoComponent implements OnInit {
  @Input()
  barraProgresoComponentData!: BarraProgresoComponentData;
  constructor() {}

  ngOnInit(): void {}
}

export class BarraProgresoComponentData {
  colorRellenoBarra!: any;
  colorFondoBarra!: any;
  porcentajeBarra!: any;
  fontSize!: any;
  altura!: any;
  radio!: any;
}