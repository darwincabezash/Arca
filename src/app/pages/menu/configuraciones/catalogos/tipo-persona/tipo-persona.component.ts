import { TipoPersonaService } from '../../../../../services/persona/tipoPersona/tipoPersona.service';
import { TipoPersona } from '../../../../../dataModels/tipoPersona';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RuteadorService } from 'src/app/router/ruteador.service';


@Component({
  selector: 'app-tipo-persona',
  templateUrl: './tipo-persona.component.html',
  styleUrls: []
})
export class TipoPersonaComponent implements OnInit {

  tipoPersona: TipoPersona[] = [];
  _idEliminar?: TipoPersona;
  _idEditar?: TipoPersona;
  nuevoTipoPersonaForm: FormGroup;
  actualizarTipoPersonaForm: FormGroup;


  constructor(private fbNuevo: FormBuilder, private fbActualizar: FormBuilder, private router: Router,
    private tipoPersonaService: TipoPersonaService,
    private toastr: ToastrService, private sesion: RuteadorService) {

    sesion.existeUsuarioActivo();

    this.nuevoTipoPersonaForm = this.fbNuevo.group({
      tipo: ["", Validators.required],
    });

    this.actualizarTipoPersonaForm = this.fbActualizar.group({
      tipoEditar: [""]
    });

  }

  ngOnInit(): void {
    this.tipoPersonaService.consultarTipoPersonas();
    this.tipoPersonaService.obtenerTipoPersonas$().subscribe(tp => {
      this.tipoPersona = tp;
    });
  }

  agregarTipoPersona() {
    const datoTipoPersona: TipoPersona = {
      tipo: this.nuevoTipoPersonaForm.get('tipo')?.value,
    }

    this.tipoPersonaService.agregarTipoPersonas(datoTipoPersona);
    this.toastr.success('Tipo de persona registrado correctamente', 'Registro de Tipos de Personas');
    this.limpiarCampos();
  }

  eliminarTipoPersona() {
    this.tipoPersonaService.eliminarTipoPersonas(this._idEliminar?._id);
  }

  limpiarCampos() {

    this.nuevoTipoPersonaForm.setValue({
      tipo: ''
    });

    this.actualizarTipoPersonaForm.setValue({
      tipoEditar: ''
    });

  }

  idAEliminar(_id: any) {
    let tp: TipoPersona = new TipoPersona();
    this._idEliminar = this.tipoPersona.find(tipo => tipo._id === _id);
  }

  idAEditar(_id: any) {

    let tp: TipoPersona = new TipoPersona();
    this._idEditar = this.tipoPersona.find(tipo => tipo._id === _id);
  }

  actualizarTipoPersona() {
    const datoTipoPersonaEditar: TipoPersona = {
      tipo: this.actualizarTipoPersonaForm.get('tipoEditar')?.value,
    }
    this.tipoPersonaService.actualizarTipoPersonas(this._idEditar?._id, datoTipoPersonaEditar);
    this.toastr.success('Tipo de persona actualizado correctamente', 'Editar Tipos de Personas');
    this.limpiarCampos();
  }

  refrescarTipoPersona() {
    this.tipoPersonaService.consultarTipoPersonas();
  }

}
