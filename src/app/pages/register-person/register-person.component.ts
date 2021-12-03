import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatoBasicoPersona, Persona } from 'src/app/dataModels/persona';
import { PersonaService } from 'src/app/services/persona/persona/persona.service';


@Component({
  selector: 'app-register-person',
  templateUrl: './register-person.component.html',
  styleUrls: []
})
export class RegisterPersonComponent implements OnInit {
  personaForm: FormGroup;


  /*constructor() { 
    this.personaForm=new FormGroup({
      cedula:new FormControl(),

    });
  }*/


  cedula?: number
  primerNombre?: String
  segundoNombre?: String
  primerApellido?: String
  segundoApellido?: String
  fechaNacimiento?: Date
  telefono?: number
  celular?: number
  email?: String
  sexo?: String
  foto?: String


  constructor(private fb: FormBuilder, private router: Router, private personaService: PersonaService,private toastr: ToastrService) {
    this.personaForm = this.fb.group({
      cedula: ["", Validators.required],
      primerNombre: ["", Validators.required],
      segundoNombre: [""],
      primerApellido: ["", Validators.required],
      segundoApellido: [""],
      fechaNacimiento: [""],
      telefono: [""],
      celular: [""],
      direccion: [""],
      email: [""],
      sexo: [""],
      foto: [""],
    });
  }



  agregarPersona() {
    console.log(this.personaForm);
    console.log("SEXO: " + this.personaForm.get('sexo')?.value);
    let sexo;
    const datoBasicoPersona: DatoBasicoPersona = {
      cedula: this.personaForm.get('cedula')?.value,
      primerNombre: this.personaForm.get('primerNombre')?.value,
      segundoNombre: this.personaForm.get('segundoNombre')?.value,
      primerApellido: this.personaForm.get('primerApellido')?.value,
      segundoApellido: this.personaForm.get('segundoApellido')?.value,
      fechaNacimiento: this.personaForm.get('fechaNacimiento')?.value,
      telefono: this.personaForm.get('telefono')?.value,
      celular: this.personaForm.get('celular')?.value,
      direccion: this.personaForm.get('direccion')?.value,
      email: this.personaForm.get('email')?.value,
      sexo: this.personaForm.get('sexo')?.value,
      foto: this.personaForm.get('foto')?.value,

    }

    console.log("DATOS DE PERSONA");
    console.log("cedula: " + datoBasicoPersona.cedula);
    console.log("primerNombre: " + datoBasicoPersona.primerNombre);
    console.log("segundoNombre: " + datoBasicoPersona.segundoNombre);
    console.log("primerApellido: " + datoBasicoPersona.primerApellido);
    console.log("segundoApellido: " + datoBasicoPersona.segundoApellido);
    console.log("fechaNacimiento: " + datoBasicoPersona.fechaNacimiento);
    console.log("telefono: " + datoBasicoPersona.telefono);
    console.log("celular: " + datoBasicoPersona.celular);
    console.log("direccion: " + datoBasicoPersona.direccion);
    console.log("email: " + datoBasicoPersona.email);
    console.log("sexo: " + datoBasicoPersona.sexo);
    console.log("foto: " + datoBasicoPersona.foto);


    let persona: Persona = new Persona();
    persona.datoBasicoPersona = datoBasicoPersona;
    this.personaService.agregarPersonas(persona);

    console.log("PERSONA: " + datoBasicoPersona.cedula);
    //    this.toastr.success('El producto fue registrado correctamente', 'Registro de Producto ');
    this.toastr.success('Persona registrada correctamente', 'Registro de Personas');

    this.limpiarCampos();
  }

  limpiarCampos() {

    this.personaForm.setValue({
      cedula: '',
      primerNombre: '',
      segundoNombre: '',
      primerApellido: '',
      segundoApellido: '',
      fechaNacimiento: '',
      telefono: '',
      celular: '',
      direccion: '',
      email: '',
      sexo: '',
      foto: ''
    });

  }

  ngOnInit(): void {
  }

}
