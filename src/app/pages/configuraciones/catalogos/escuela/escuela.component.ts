import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Escuela } from 'src/app/dataModels/escuela';
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
  escuelaForm: FormGroup;
  colorBoton?:String;


  constructor(private fb: FormBuilder, private router: Router, 
    private escuelaService: EscuelaService, 
    private toastr: ToastrService) {
      this.colorBoton="";

    this.escuelaForm = this.fb.group({
      tipo: ["", Validators.required],
      tipoEditar:[""]
    });

  }

  ngOnInit(): void {
    this.refrescarEscuela();
    this.escuelaService.obtenerEscuelas$().subscribe(tp => {
      this.escuela = tp;
    });
  }

  agregarEscuela() {
    const datoEscuela: Escuela = {
      tipo: this.escuelaForm.get('tipo')?.value,
      color:this.colorBoton
    }

    this.escuelaService.agregarEscuela(datoEscuela);
    this.escuelaService.consultarEscuela();
    this.toastr.success('Escuela registrada correctamente', 'Registro de Escuelas');
    this.limpiarCampos();
  }

  eliminarEscuela() {
    this.escuelaService.eliminarEscuela(this._idEliminar?._id);
    this.escuelaService.consultarEscuela();
  }

  limpiarCampos() {
    this.escuelaForm.setValue({
      tipo: '',
      tipoEditar:''
    });
    this.colorBoton="#fff";

  }

  idAEliminar(_id: any) {
    let tp:Escuela=new Escuela();
    this._idEliminar = this.escuela.find(tipo => tipo._id === _id);
  }

  idAEditar(_id: any) {

    let tp:Escuela=new Escuela();    
    this._idEditar = this.escuela.find(tipo => tipo._id === _id);
    this.colorBoton=this._idEditar?.color;
  }

  actualizarEscuela(){
    const datoEscuelaEditar: Escuela = {
      tipo: this.escuelaForm.get('tipoEditar')?.value,
      color:this.colorBoton
    }
    this.escuelaService.actualizarEscuela(this._idEditar?._id,datoEscuelaEditar);
    this.escuelaService.consultarEscuela();
    this.toastr.success('Escuela actualizada correctamente', 'Editar Escuelas');
    this.limpiarCampos();
  }

  refrescarEscuela(){
    this.escuelaService.consultarEscuela();
  }
  si(event: MouseEvent,color:String){
    event.preventDefault();
    this.colorBoton=color;
    console.log("SI, INFO ES:"+color );
    
  }

}
