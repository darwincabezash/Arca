import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Grupo } from 'src/app/dataModels/grupo';
import { GrupoService } from 'src/app/services/catalogos/grupos.service';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: []
})
export class GrupoComponent implements OnInit {


  grupo: Grupo[] = [];
  _idEliminar?: Grupo;
  _idEditar?: Grupo;
  grupoForm: FormGroup;


  constructor(private fb: FormBuilder, private router: Router, 
    private grupoService: GrupoService, 
    private toastr: ToastrService) {

    this.grupoForm = this.fb.group({
      tipo: ["", Validators.required],
      tipoEditar:[""]
    });

  }

  ngOnInit(): void {
    this.refrescarGrupo();
    this.grupoService.obtenerGrupos$().subscribe(tp => {
      this.grupo = tp;
    });
  }

  agregarGrupo() {
    const datoGrupo: Grupo = {
      tipo: this.grupoForm.get('tipo')?.value,
    }

    this.grupoService.agregarGrupo(datoGrupo);
    this.grupoService.consultarGrupo();
    this.toastr.success('Grupo registrado correctamente', 'Registro de Grupos');
    this.limpiarCampos();
  }

  eliminarGrupo() {
    this.grupoService.eliminarGrupo(this._idEliminar?._id);
    this.grupoService.consultarGrupo();
  }

  limpiarCampos() {
    this.grupoForm.setValue({
      tipo: '',
      tipoEditar:''
    });

  }

  idAEliminar(_id: any) {
    let tp:Grupo=new Grupo();
    this._idEliminar = this.grupo.find(tipo => tipo._id === _id);
  }

  idAEditar(_id: any) {

    let tp:Grupo=new Grupo();    
    this._idEditar = this.grupo.find(tipo => tipo._id === _id);
  }

  actualizarGrupo(){
    const datoGrupoEditar: Grupo = {
      tipo: this.grupoForm.get('tipoEditar')?.value,
    }
    this.grupoService.actualizarGrupo(this._idEditar?._id,datoGrupoEditar);
    this.grupoService.consultarGrupo();
    this.toastr.success('Grupo actualizado correctamente', 'Editar Gruposs');
    this.limpiarCampos();
  }

  refrescarGrupo(){
    this.grupoService.consultarGrupo();
  }


}
