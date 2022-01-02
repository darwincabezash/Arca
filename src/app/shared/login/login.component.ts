import { LoginService } from './../../services/login/login.service';
import { Usuario } from './../../dataModels/usuario';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RuteadorService } from 'src/app/router/ruteador.service';
import { GlobalDataService } from 'src/app/services/login/globalDataServices';
import { PersonaService } from 'src/app/services/persona/persona/persona.service';
import { DatoBasicoPersona, Persona } from 'src/app/dataModels/persona';
import { DatosPersonaService } from 'src/app/services/persona/datos-persona.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  server: RequestInfo = GlobalDataService.getServer();
  private usuario: Usuario;
  usuarios: Usuario[] = [];
  personas: Persona[] = [];

  intentandoLogin = false;
  estadoServidor = false;




  constructor(private fb: FormBuilder, private router: Router,
    private loguinService: LoginService, private toastr: ToastrService,
    private sesion: RuteadorService, private personaService: PersonaService, private datosPersonaService: DatosPersonaService, private ruteadorService: RuteadorService) {

      this.toastr.toastrConfig.maxOpened=1;
      this.toastr.toastrConfig.preventDuplicates=true;

      this.usuario= new Usuario();

    this.loginForm = this.fb.group({
      usuario: ["", Validators.required],
      password: ["", Validators.required],

    });

    /*
    this.ruteadorService.servidorActivoInicio().then((estado) => {
      if (!estado) {
        this.toastr.error('El Servidor no esta disponible.');

      }
    });*/
   

    this.limpiarCampos();
  }

  f: number = 0;
  async iniciarLogin() {

/*
    this.ruteadorService.servidorActivoInicio().then((estado) => {
      if (!estado) {
        this.toastr.error('El Servidor no esta disponible.');
      }
    });*/

    
    this.intentandoLogin = true;

    try {

      this.toastr.previousToastMessage?.slice();

      this.loguinService.consultarUsuario(this.loginForm.get('usuario')?.value, this.loginForm.get('password')?.value);


      await this.loguinService.obtenerUsuarios().subscribe(async usuarios => {
        this.f++;
        this.usuarios = usuarios;
        if (this.usuarios.length > 0) {
          this.usuario = this.usuarios[0];
       
          const myObjUsuario = JSON.stringify(this.usuario);
        
          localStorage.setItem('usuario', myObjUsuario);
          //this.cargarDatosPersona(this.usuario._idPersona!);
          await this.personaService.consultarPersona(this.usuario._idPersona!);

          //this.datosPersonaService.extraerPersonaDeBase();
          this.router.navigate(["/dashboard/dashboard"]);

        }
        else {
          this.toastr.error('No se ha encontrado al usuario', 'Inicio de Sessión');
          this.limpiarCampos();
        }
      });
    }
    catch {
      
    }


    this.intentandoLogin = false;
  }


  cargarDatosPersona(_id:String) {

    //this.personaService.obtenerPersonas$().subscribe(personas => {
     // this.personas = personas;

    //});
    
  }




  limpiarCampos() {
    this.loginForm.setValue({
      usuario: '',
      password: ''
    });
  }

  ngOnInit(): void {
  }

}
