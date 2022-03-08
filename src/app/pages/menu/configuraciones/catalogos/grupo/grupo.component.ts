import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Grupo } from 'src/app/dataModels/grupo';
import { RuteadorService } from 'src/app/router/ruteador.service';
import { GrupoService } from 'src/app/services/catalogos/grupo.service';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: []
})
export class GrupoComponent implements OnInit {


  grupo: Grupo[] = [];
  _idEliminar?: Grupo;
  _idEditar?: Grupo;
  nuevoGrupoForm: FormGroup;
  actualizarGrupoForm: FormGroup;


  constructor(private fbNuevo: FormBuilder, private fbActualizar: FormBuilder, private router: Router, 
    private grupoService: GrupoService, 
    private toastr: ToastrService, private sesion: RuteadorService, private ruteadorService: RuteadorService) {
    
    sesion.existeUsuarioActivo();
    
    this.nuevoGrupoForm = this.fbNuevo.group({
      tipo: ["", Validators.required]
    });
    this.actualizarGrupoForm = this.fbActualizar.group({
      tipoEditar: [""]
    });

  }

  ngOnInit(): void {
    this.ruteadorService.servidorActivo(this.router.url);

    this.grupoService.consultarGrupo();
    this.grupoService.obtenerGrupos$().subscribe(tp => {
      this.grupo = tp;
    });
  }

  agregarGrupo() {
    const datoGrupo: Grupo = {
      tipo: this.nuevoGrupoForm.get('tipo')?.value,
    }

    this.grupoService.agregarGrupo(datoGrupo);
    
    this.toastr.success('Grupo registrado correctamente', 'Registro de Grupos');
    this.limpiarCampos();
  }

  eliminarGrupo() {
    this.grupoService.eliminarGrupo(this._idEliminar?._id);
    
  }

  limpiarCampos() {
    this.nuevoGrupoForm.setValue({
      tipo: ''
    });

    this.actualizarGrupoForm.setValue({
      tipoEditar: ''
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
      tipo: this.actualizarGrupoForm.get('tipoEditar')?.value,
      color:""
    }
    this.grupoService.actualizarGrupo(this._idEditar?._id,datoGrupoEditar);
    
    this.toastr.success('Grupo actualizado correctamente', 'Editar Gruposs');
    this.limpiarCampos();
  }

  refrescarGrupo(){
    this.grupoService.consultarGrupo();
  }


}
