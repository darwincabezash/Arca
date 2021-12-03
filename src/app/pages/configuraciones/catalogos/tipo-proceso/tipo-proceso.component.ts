import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TipoProceso } from 'src/app/dataModels/tipoProceso';
import { TipoProcesoService } from 'src/app/services/catalogos/tipo-proceso.service';

@Component({
  selector: 'app-tipo-proceso',
  templateUrl: './tipo-proceso.component.html',
  styleUrls: []
})
export class TipoProcesoComponent implements OnInit {

  
  tipoProceso: TipoProceso[] = [];
  _idEliminar?: TipoProceso;
  _idEditar?: TipoProceso;
  tipoProcesoForm: FormGroup;


  constructor(private fb: FormBuilder, private router: Router, 
    private tipoProcesoService: TipoProcesoService, 
    private toastr: ToastrService) {

    this.tipoProcesoForm = this.fb.group({
      tipo: ["", Validators.required],
      tipoEditar:[""]
    });

  }

  ngOnInit(): void {
    this.refrescarTipoProceso();
    this.tipoProcesoService.obtenerTipoProcesos$().subscribe(tp => {
      this.tipoProceso = tp;
    });
  }

  agregarTipoProceso() {
    const datoTipoProceso: TipoProceso = {
      tipo: this.tipoProcesoForm.get('tipo')?.value,
    }

    this.tipoProcesoService.agregarTipoProceso(datoTipoProceso);
    this.tipoProcesoService.consultarTipoProceso();
    this.toastr.success('Tipo de proceso registrado correctamente', 'Registro de Tipos de Procesos');
    this.limpiarCampos();
  }

  eliminarTipoProceso() {
    this.tipoProcesoService.eliminarTipoProceso(this._idEliminar?._id);
    this.tipoProcesoService.consultarTipoProceso();
  }

  limpiarCampos() {
    this.tipoProcesoForm.setValue({
      tipo: '',
      tipoEditar:''
    });

  }

  idAEliminar(_id: any) {
    let tp:TipoProceso=new TipoProceso();
    this._idEliminar = this.tipoProceso.find(tipo => tipo._id === _id);
  }

  idAEditar(_id: any) {

    let tp:TipoProceso=new TipoProceso();    
    this._idEditar = this.tipoProceso.find(tipo => tipo._id === _id);
  }

  actualizarTipoProceso(){
    const datoTipoProcesoEditar: TipoProceso = {
      tipo: this.tipoProcesoForm.get('tipoEditar')?.value,
    }
    this.tipoProcesoService.actualizarTipoProceso(this._idEditar?._id,datoTipoProcesoEditar);
    this.tipoProcesoService.consultarTipoProceso();
    this.toastr.success('Tipo de proceso actualizado correctamente', 'Editar Tipos de Procesos');
    this.limpiarCampos();
  }

  refrescarTipoProceso(){
    this.tipoProcesoService.consultarTipoProceso();
  }


}
