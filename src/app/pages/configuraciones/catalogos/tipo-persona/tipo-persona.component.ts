import { TipoPersonaService } from './../../../../services/persona/tipoPersona/tipoPersona.service';
import { TipoPersona } from './../../../../dataModels/tipoPersona';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-tipo-persona',
  templateUrl: './tipo-persona.component.html',
  styleUrls: []
})
export class TipoPersonaComponent implements OnInit {

  tipoPersona: TipoPersona[] = [];
  _idEliminar?: TipoPersona;
  _idEditar?: TipoPersona;
  tipoPersonaForm: FormGroup;


  constructor(private fb: FormBuilder, private router: Router, 
    private tipoPersonaService: TipoPersonaService, 
    private toastr: ToastrService) {

    this.tipoPersonaForm = this.fb.group({
      tipo: ["", Validators.required],
      tipoEditar:[""]
    });

  }

  ngOnInit(): void {
    this.refrescarTipoPersona();
    this.tipoPersonaService.obtenerTipoPersonas$().subscribe(tp => {
      this.tipoPersona = tp;
    });
  }

  agregarTipoPersona() {
    const datoTipoPersona: TipoPersona = {
      tipo: this.tipoPersonaForm.get('tipo')?.value,
    }

    this.tipoPersonaService.agregarTipoPersonas(datoTipoPersona);
    this.tipoPersonaService.consultarTipoPersonas();
    this.toastr.success('Tipo de persona registrado correctamente', 'Registro de Tipos de Personas');
    this.limpiarCampos();
  }

  eliminarTipoPersona() {
    this.tipoPersonaService.eliminarTipoPersonas(this._idEliminar?._id);
    this.tipoPersonaService.consultarTipoPersonas();
  }

  limpiarCampos() {

    this.tipoPersonaForm.setValue({
      tipo: '',
      tipoEditar:''
    });

  }

  idAEliminar(_id: any) {
    let tp:TipoPersona=new TipoPersona();
    this._idEliminar = this.tipoPersona.find(tipo => tipo._id === _id);
  }

  idAEditar(_id: any) {

    let tp:TipoPersona=new TipoPersona();    
    this._idEditar = this.tipoPersona.find(tipo => tipo._id === _id);
  }

  actualizarTipoPersona(){
    const datoTipoPersonaEditar: TipoPersona = {
      tipo: this.tipoPersonaForm.get('tipoEditar')?.value,
    }
    this.tipoPersonaService.actualizarTipoPersonas(this._idEditar?._id,datoTipoPersonaEditar);
    this.tipoPersonaService.consultarTipoPersonas();
    this.toastr.success('Tipo de persona actualizado correctamente', 'Editar Tipos de Personas');
    this.limpiarCampos();
  }

  refrescarTipoPersona(){
    this.tipoPersonaService.consultarTipoPersonas();
  }

}
