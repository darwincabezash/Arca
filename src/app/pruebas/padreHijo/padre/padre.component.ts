import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-padre',
  templateUrl: './padre.component.html',
  styleUrls: [],
})
export class PadreComponent implements OnInit {
  pruebaPadreHijo: PruebaPadreHijo;

  respuesta!: PruebaPadreHijo;

  constructor() {
    this.pruebaPadreHijo = new PruebaPadreHijo();
    this.pruebaPadreHijo.nombre = 'Darwin';
    this.pruebaPadreHijo.apellido = 'Cabezas';
  }

  ngOnInit(): void {}

  respuestaDeHijo(event: PruebaPadreHijo) {
    this.respuesta = event;
  }
}


export class PruebaPadreHijo{
  nombre!: string;
  apellido!: string;;
}