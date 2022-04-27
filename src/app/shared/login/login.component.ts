import { Iglesia } from './../../dataModels/iglesia';
import { LoginService } from './../../services/login/login.service';
import { Usuario } from './../../dataModels/usuario';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RuteadorService } from 'src/app/router/ruteador.service';
import { GlobalDataService } from 'src/app/global/globalDataServices';
import { PersonaService } from 'src/app/services/persona/persona/persona.service';
import { DatoBasicoPersona, Persona } from 'src/app/dataModels/persona';
import { DatosPersonaService } from 'src/app/services/persona/datos-persona.service';
import { IglesiaService } from 'src/app/services/iglesia/iglesia/iglesia.service';
import { Sesiones } from 'src/app/shared/general/staticGeneral';
import { delay } from 'rxjs';
import { SessionUsuario } from 'src/app/dataModels/sessionUsuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  server: RequestInfo = GlobalDataService.getServer();
  private usuario: Usuario;
  usuarios: Usuario[] = [];
  personas: Persona[] = [];

  intentandoLogin = false;
  estadoServidor = false;

  private iglesia: Iglesia;
  iglesias: Iglesia[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loguinService: LoginService,
    private toastr: ToastrService,
    private sesion: RuteadorService,
    private personaService: PersonaService,
    private datosPersonaService: DatosPersonaService,
    private ruteadorService: RuteadorService,
    private iglesiaService: IglesiaService
  ) {
    this.toastr.toastrConfig.maxOpened = 1;
    this.toastr.toastrConfig.preventDuplicates = true;

    this.usuario = new Usuario();
    this.iglesia = new Iglesia();

    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required],
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

      this.loguinService.consultarUsuario(
        this.loginForm.get('usuario')?.value,
        this.loginForm.get('password')?.value
      );

      /*
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
          //this.router.navigate(["/dashboard/dashboard"]);

        }
        else {
          this.toastr.error('No se ha encontrado al usuario', 'Inicio de Sessión');
          this.limpiarCampos();
        }
      });*/

      //console.log('))))))))) SE VA A CONSULTAR EL USUARIO');
      //OBTIENE EL USUARIO
      await this.loguinService.obtenerUsuarios().subscribe(async (usuarios) => {
        //console.log('))))))))) SE CONSULTO EL USUARIO');
        this.f++;
        this.usuarios = usuarios;
        if (this.usuarios.length > 0) {
          //PROCEDER
          this.usuario = this.usuarios[0];
          this.personaService.establecerCodIglesia(this.usuario.codIglesia!);

          //console.log('))))))))) USUARIO TIENE: ' + this.usuario.codIglesia);

          const myObjUsuario = JSON.stringify(this.usuario);

          localStorage.setItem('usuario', myObjUsuario);
          //this.cargarDatosPersona(this.usuario._idPersona!);
          //await this.personaService.consultarPersona(this.usuario._idPersona!);

          //this.datosPersonaService.extraerPersonaDeBase();
          //this.router.navigate(["/dashboard/dashboard"]);*/

          //OBTENIENDO INFORMACION DE LA IGLESIA A LA QUE PERTENECE EL USUARIO
          this.iglesiaService.consultarIglesia(this.usuario.codIglesia!);
          //console.log('))))))))) COD IGLESIA;:  ' + this.usuario.codIglesia);
          await this.iglesiaService
            .obteneriglesia()
            .subscribe(async (iglesias) => {
              this.f++;
              this.iglesias = iglesias;
              if (this.iglesias.length > 0) {
                this.iglesia = this.iglesias[0];
              }

              /*
           const myObjUsuario = JSON.stringify(this.usuario);
         
           localStorage.setItem('usuario', myObjUsuario);
           //this.cargarDatosPersona(this.usuario._idPersona!);||
           await this.personaService.consultarPersona(this.usuario._idPersona!);
 
           //this.datosPersonaService.extraerPersonaDeBase();
           //this.router.navigate(["/dashboard/dashboard"]);*/

              let sessionUsuario = new SessionUsuario();
              sessionUsuario.usuario = this.usuario;
              sessionUsuario.iglesia = this.iglesia;

              //General.DATOS_SESION
              const myObjSesionUsuario = JSON.stringify(sessionUsuario);

              localStorage.setItem(Sesiones.DATOS_SESION, myObjSesionUsuario);
              //this.cargarDatosPersona(this.usuario._idPersona!);
              //await this.personaService.consultarPersona(this.usuario._idPersona!);

              //this.datosPersonaService.extraerPersonaDeBase();
              //this.router.navigate(["/dashboard/dashboard"]);
              //console.log('))))))))) SE ALMACENO EL USUARIO');

              //}

              //console.log('))))))))) VA A CONSULTAR LA PERSONA');
              console.log("ID DE PERSONA: " + this.usuario._idPersona);
              await this.personaService.consultarPersona(
                this.usuario._idPersona!
              );

              //console.log('))))))))) VA A EXTRAER LA PERSONA DE BASE LOCAL');
              this.datosPersonaService.extraerPersonaDeBase();
              //this.router.navigate(['/dashboard/dashboard']);

              this.router.navigate(['/inicio/dashboard']);

              console.log("LLEGO AQUI");
                         
            });
        } else {
          this.toastr.error(
            'No se ha encontrado al usuario',
            'Inicio de Sessión'
          );
          this.limpiarCampos();
        }
      });
    } catch {
      console.log('entro 1');
    }

    this.intentandoLogin = false;
  }

  cargarDatosPersona(_id: String) {
    //this.personaService.obtenerPersonas$().subscribe(personas => {
    // this.personas = personas;
    //});
  }

  limpiarCampos() {
    this.loginForm.setValue({
      usuario: '',
      password: '',
    });
  }

  ngOnInit(): void {}
}
