import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Seminario } from 'src/app/dataModels/seminario';
import { RuteadorService } from 'src/app/router/ruteador.service';
import { SeminarioService } from 'src/app/services/catalogos/seminario.service';

@Component({
  selector: 'app-seminario',
  templateUrl: './seminario.component.html',
  styleUrls: []
})
export class SeminarioComponent implements OnInit {


  seminario: Seminario[] = [];
  _idEliminar?: Seminario;
  _idEditar?: Seminario;
  nuevoSeminarioForm: FormGroup;
  actualizarSeminarioForm: FormGroup;
  colorBoton?: String;


  constructor(private fbNuevo: FormBuilder, private fbActualizar: FormBuilder, private router: Router,
    private seminarioService: SeminarioService,
    private toastr: ToastrService, private sesion: RuteadorService, private ruteadorService: RuteadorService) {

    this.sesion.existeUsuarioActivo();

    this.colorBoton = "#fff";

    this.nuevoSeminarioForm = this.fbNuevo.group({
      tipo: ["", Validators.required]
    });

    this.actualizarSeminarioForm = this.fbActualizar.group({
      tipoEditar: [""]
    });

  }

  ngOnInit(): void {
    this.ruteadorService.servidorActivo(this.router.url);


    this.seminarioService.consultarSeminario();
    this.seminarioService.obtenerSeminarios$().subscribe(tp => {
      this.seminario = tp;
    });
  }

  agregarSeminario() {
    const datoSeminario: Seminario = {
      tipo: this.nuevoSeminarioForm.get('tipo')?.value,
      color: this.colorBoton
    }

    this.seminarioService.agregarSeminario(datoSeminario);
    this.toastr.success('Seminario registrado correctamente', 'Registro de Seminarios');
    this.limpiarCampos();
  }

  eliminarSeminario() {
    this.seminarioService.eliminarSeminario(this._idEliminar?._id);
  }

  limpiarCampos() {
    this.nuevoSeminarioForm.setValue({
      tipo: ''
    });
    this.actualizarSeminarioForm.setValue({
      tipoEditar: ''
    });
    this.colorBoton = "#fff";

  }

  idAEliminar(_id: any) {
    let tp: Seminario = new Seminario();
    this._idEliminar = this.seminario.find(tipo => tipo._id === _id);
  }

  idAEditar(_id: any) {
    this._idEditar = this.seminario.find(tipo => tipo._id === _id);
    this.colorBoton = this._idEditar?.color;
  }

  actualizarSeminario() {
    let datoSeminarioEditar = new Seminario();
    if (this.actualizarSeminarioForm.get('tipoEditar')?.value.length > 0) {
      datoSeminarioEditar.tipo = this.actualizarSeminarioForm.get('tipoEditar')?.value;
    } else {
      datoSeminarioEditar.tipo = this._idEditar?.tipo
    }
    datoSeminarioEditar.color = this.colorBoton;

    this.seminarioService.actualizarSeminario(this._idEditar?._id, datoSeminarioEditar);
    this.toastr.success('Seminario actualizado correctamente', 'Editar Seminarios');
    this.limpiarCampos();
  }

  refrescarSeminario() {
    this.seminarioService.consultarSeminario();
  }

  cargarEditarColor(event: MouseEvent, color: String) {
    event.preventDefault();
    this.colorBoton = color;

  }

}
