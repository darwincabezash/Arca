import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TipoProceso } from 'src/app/dataModels/tipoProceso';
import { RuteadorService } from 'src/app/router/ruteador.service';
import { TipoProcesoService } from 'src/app/services/catalogos/tipo-proceso.service';
import { UtilidadesService } from 'src/app/services/utilidades/utilidades';

@Component({
  selector: 'app-tipo-proceso',
  templateUrl: './proceso.component.html',
  styleUrls: []
})
export class TipoProcesoComponent implements OnInit {

  
  tipoProceso: TipoProceso[] = [];
  _idEliminar?: TipoProceso;
  _idEditar?: TipoProceso;
  nuevoTipoProcesoForm: FormGroup;
  actualizarTipoProcesoForm: FormGroup;
  estadoServidor?:Boolean=true;

  constructor(private fbNuevo: FormBuilder, private fbActualizar: FormBuilder, private router: Router,
    private tipoProcesoService: TipoProcesoService,
    private toastr: ToastrService, private ruteadorService: RuteadorService, private utilidadesService:UtilidadesService) {
  
    ruteadorService.existeUsuarioActivo();
    
    this.nuevoTipoProcesoForm = this.fbNuevo.group({
      tipo: ["", Validators.required]
    });

    this.actualizarTipoProcesoForm = this.fbActualizar.group({
      tipoEditar: [""]
    });

  }

 ngOnInit() {
   this.ruteadorService.servidorActivo(this.router.url);

  /*  this.utilidadesService.servidorActivo();
    this.utilidadesService.obtenerEstadoServidor$().subscribe(estado => {
      this.estadoServidor = estado;
    });
*/
    this.tipoProcesoService.consultarTipoProceso();
    this.tipoProcesoService.obtenerTipoProcesos$().subscribe(tp => {
      this.tipoProceso = tp;
    });

  }

  agregarTipoProceso() {
    const datoTipoProceso: TipoProceso = {
      tipo: this.nuevoTipoProcesoForm.get('tipo')?.value,
    }

    this.tipoProcesoService.agregarTipoProceso(datoTipoProceso);

    this.toastr.success('Proceso registrado correctamente', 'Registro de Procesos');
    this.limpiarCampos();
  }

  eliminarTipoProceso() {
    this.tipoProcesoService.eliminarTipoProceso(this._idEliminar?._id);
  }

  limpiarCampos() {
    this.nuevoTipoProcesoForm.setValue({
      tipo: ''
    });

    this.actualizarTipoProcesoForm.setValue({
      tipoEditar: ''
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
      tipo: this.actualizarTipoProcesoForm.get('tipoEditar')?.value,
    }
    this.tipoProcesoService.actualizarTipoProceso(this._idEditar?._id,datoTipoProcesoEditar);
    this.toastr.success('Proceso actualizado correctamente', 'Editar Procesos');
    this.limpiarCampos();
  }

  refrescarTipoProceso(){
    this.tipoProcesoService.consultarTipoProceso();
  }


}
