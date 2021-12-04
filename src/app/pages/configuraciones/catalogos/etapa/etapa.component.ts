import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Etapa } from 'src/app/dataModels/etapa';
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
  etapaForm: FormGroup;


  constructor(private fb: FormBuilder, private router: Router, 
    private etapaService: EtapaService, 
    private toastr: ToastrService) {

    this.etapaForm = this.fb.group({
      tipo: ["", Validators.required],
      edadI: [0, Validators.required],
      edadF: [0, Validators.required],
      tipoEditar:[""]
    });

  }

  ngOnInit(): void {
    this.refrescarEtapa();
    this.etapaService.obtenerEtapas$().subscribe(tp => {
      this.etapa = tp;
    });
  }

  agregarEtapa() {
    const datoEtapa: Etapa = {
      tipo: this.etapaForm.get('tipo')?.value,
      edadI: this.etapaForm.get('edadI')?.value,
      edadF: this.etapaForm.get('edadF')?.value,
    }

    this.etapaService.agregarEtapa(datoEtapa);
    this.etapaService.consultarEtapa();
    this.toastr.success('Etapa registrada correctamente', 'Registro de Etapas');
    this.limpiarCampos();
  }

  eliminarEtapa() {
    this.etapaService.eliminarEtapa(this._idEliminar?._id);
    this.etapaService.consultarEtapa();
  }

  limpiarCampos() {
    this.etapaForm.setValue({
      tipo: '',
      edadI:'',
      edadF:'',
      tipoEditar:''

    });

  }

  idAEliminar(_id: any) {
    let tp:Etapa=new Etapa();
    this._idEliminar = this.etapa.find(tipo => tipo._id === _id);
  }

  idAEditar(_id: any) {

    let tp:Etapa=new Etapa();    
    this._idEditar = this.etapa.find(tipo => tipo._id === _id);
    //console.log("@ "+this._idEditar?._id+  "  "+this._idEditar?.tipo +"  "+this._idEditar?.edadI+"  "+this._idEditar?.edadF);
  }

  actualizarEtapa(){
    const datoEtapaEditar: Etapa = {
      tipo: this.etapaForm.get('tipoEditar')?.value,
      edadI: this.etapaForm.get('edadI')?.value,
      edadF: this.etapaForm.get('edadF')?.value,
    }
    //console.log("Datos: "+datoEtapaEditar._id+"  "+datoEtapaEditar.tipo+"  "+datoEtapaEditar.edadI+"  "+datoEtapaEditar.edadF);
    this.etapaService.actualizarEtapa(this._idEditar?._id,datoEtapaEditar);
    this.etapaService.consultarEtapa();
    this.toastr.success('Etapa actualizada correctamente', 'Editar Etapas');
    this.limpiarCampos();
  }

  refrescarEtapa(){
    this.etapaService.consultarEtapa();
  }

}
