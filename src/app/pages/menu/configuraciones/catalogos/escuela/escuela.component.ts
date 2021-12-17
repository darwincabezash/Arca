import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Escuela } from 'src/app/dataModels/escuela';
import { RuteadorService } from 'src/app/router/ruteador.service';
import { EscuelaService } from 'src/app/services/catalogos/escuela.service';

@Component({
  selector: 'app-escuela',
  templateUrl: './escuela.component.html',
  styleUrls: []
})
export class EscuelaComponent implements OnInit {


  escuela: Escuela[] = [];
  _idEliminar?: Escuela;
  _idEditar?: Escuela;
  nuevaEscuelaForm: FormGroup;
  actualizarEscuelaForm: FormGroup;
  colorBoton?: String;


  constructor(private fbNueva: FormBuilder, private fbActualizar: FormBuilder, private router: Router,
    private escuelaService: EscuelaService,
    private toastr: ToastrService, private sesion: RuteadorService) {

    this.sesion.existeUsuarioActivo();

    this.colorBoton = "#fff";

    this.nuevaEscuelaForm = this.fbNueva.group({
      tipo: ["", Validators.required]
    });

    this.actualizarEscuelaForm = this.fbActualizar.group({
      tipoEditar: [""]
    });

  }

  ngOnInit(): void {
    this.escuelaService.consultarEscuela();
    this.escuelaService.obtenerEscuelas$().subscribe(tp => {
      console.log("SE ACTUALIZO! " + tp.length);
      this.escuela = tp;
    });
  }

  agregarEscuela() {
    const datoEscuela: Escuela = {
      tipo: this.nuevaEscuelaForm.get('tipo')?.value,
      color: this.colorBoton
    }

    this.escuelaService.agregarEscuela(datoEscuela);
    this.toastr.success('Escuela registrada correctamente', 'Registro de Escuelas');
    this.limpiarCampos();
  }

  eliminarEscuela() {
    this.escuelaService.eliminarEscuela(this._idEliminar?._id);
  }

  limpiarCampos() {
    this.nuevaEscuelaForm.setValue({
      tipo: ''
    });
    this.actualizarEscuelaForm.setValue({
      tipoEditar: ''
    });
    this.colorBoton = "#fff";

  }

  idAEliminar(_id: any) {
    let tp: Escuela = new Escuela();
    this._idEliminar = this.escuela.find(tipo => tipo._id === _id);
  }

  idAEditar(_id: any) {
    this._idEditar = this.escuela.find(tipo => tipo._id === _id);
    this.colorBoton = this._idEditar?.color;
    console.log("TIPO EDITAR: " + this._idEditar?.tipo);
  }

  actualizarEscuela() {
    let datoEscuelaEditar = new Escuela();
    if (this.actualizarEscuelaForm.get('tipoEditar')?.value.length > 0) {
      datoEscuelaEditar.tipo = this.actualizarEscuelaForm.get('tipoEditar')?.value;
    } else {
      datoEscuelaEditar.tipo = this._idEditar?.tipo
    }
    datoEscuelaEditar.color = this.colorBoton;

    this.escuelaService.actualizarEscuela(this._idEditar?._id, datoEscuelaEditar);
    this.toastr.success('Escuela actualizada correctamente', 'Editar Escuelas');
    this.limpiarCampos();
  }

  refrescarEscuela() {
    this.escuelaService.consultarEscuela();
  }

  cargarEditarColor(event: MouseEvent, color: String) {
    event.preventDefault();
    this.colorBoton = color;
    console.log("SI, INFO ES:" + color);

  }

}
