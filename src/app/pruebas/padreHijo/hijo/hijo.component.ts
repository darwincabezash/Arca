import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PruebaPadreHijo } from '../padre/padre.component';

@Component({
  selector: 'app-hijo',
  templateUrl: './hijo.component.html',
  styleUrls: [],
})
export class HijoComponent implements OnInit {
  @Input()
  entrada!: PruebaPadreHijo;

  @Output()
  enviar: EventEmitter<PruebaPadreHijo> = new EventEmitter<PruebaPadreHijo>();

  constructor() {}

  ngOnInit(): void {}

  enviarRespuesta() {
    let pruebaPadreHijo = new PruebaPadreHijo();
    pruebaPadreHijo.nombre = "Juan";
    pruebaPadreHijo.apellido = "Gommez";

    this.enviar.emit(pruebaPadreHijo);
  }
}
