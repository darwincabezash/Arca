import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Etapa } from 'src/app/dataModels/etapa';
import { RuteadorService } from 'src/app/router/ruteador.service';
import { EtapaService } from 'src/app/services/catalogos/etapa.service';

@Component({
  selector: 'app-etapa',
  templateUrl: './etapa.component.html',
  styleUrls: []
})
export class EtapaComponent implements OnInit {

  
  etapa: Etapa[] = [];
  _idEliminar?: Etapa;
  _idEditar?: Etapa;
  nuevaEtapaForm: FormGroup;
  actualizarEtapaForm: FormGroup;


  constructor(private fbNueva: FormBuilder, private fbActualizar: FormBuilder, private router: Router, 
    private etapaService: EtapaService, 
    private toastr: ToastrService,private sesion:RuteadorService) {

      sesion.existeUsuarioActivo();

    this.nuevaEtapaForm = this.fbNueva.group({
      tipo: ["", Validators.required],
      edadI: [0, Validators.required],
      edadF: [0, Validators.required]
    });

    this.actualizarEtapaForm = this.fbActualizar.group({
      tipoEditar: [""],
      edadIEditar: [""],
      edadFEditar: [""]
    });

  }

  ngOnInit(): void {
    this.etapaService.consultarEtapa();
    this.etapaService.obtenerEtapas$().subscribe(tp => {
      this.etapa = tp;
    });
  }

  agregarEtapa() {
    const datoEtapa: Etapa = {
      tipo: this.nuevaEtapaForm.get('tipo')?.value,
      edadI: this.nuevaEtapaForm.get('edadI')?.value,
      edadF: this.nuevaEtapaForm.get('edadF')?.value,

    }

    this.etapaService.agregarEtapa(datoEtapa);
    this.toastr.success('Etapa registrada correctamente', 'Registro de Etapas');
    this.limpiarCampos();
  }

  eliminarEtapa() {
    this.etapaService.eliminarEtapa(this._idEliminar?._id);
  }

  limpiarCampos() {
    this.nuevaEtapaForm.setValue({
      tipo: '',
      edadI:'',
      edadF:''
    });

    this.actualizarEtapaForm.setValue({
      tipoEditar: '',
      edadIEditar: '',
      edadFEditar: ''
    });

  }

  idAEliminar(_id: any) {
    let tp:Etapa=new Etapa();
    this._idEliminar = this.etapa.find(tipo => tipo._id === _id);
  }

  idAEditar(_id: any) {

    let tp:Etapa=new Etapa();    
    this._idEditar = this.etapa.find(tipo => tipo._id === _id);
  }

  actualizarEtapa(){
    const datoEtapaEditar = new Etapa();
    
    if (this.actualizarEtapaForm.get('tipoEditar')?.value.length) {
      datoEtapaEditar.tipo= this.actualizarEtapaForm.get('tipoEditar')?.value
    } else { datoEtapaEditar.tipo = this._idEditar?.tipo; }
    
    if (this.actualizarEtapaForm.get('edadIEditar')?.value.length) {
      datoEtapaEditar.edadI = this.actualizarEtapaForm.get('edadIEditar')?.value
    } else { datoEtapaEditar.edadI =this._idEditar?.edadI; }

    if (this.actualizarEtapaForm.get('edadFEditar')?.value.length) {
      datoEtapaEditar.edadF = this.actualizarEtapaForm.get('edadFEditar')?.value
    } else { datoEtapaEditar.edadF = this._idEditar?.edadF; }
   
    this.etapaService.actualizarEtapa(this._idEditar?._id,datoEtapaEditar);
    this.toastr.success('Etapa actualizada correctamente', 'Editar Etapas');
    this.limpiarCampos();
  }

  refrescarEtapa(){
    this.etapaService.consultarEtapa();
  }

}
