import { LoginService } from './../../services/login/login.service';
import { Usuario } from './../../dataModels/usuario';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RuteadorService } from 'src/app/router/ruteador.service';
import { GlobalDataService } from 'src/app/services/login/globalDataServices';

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



  constructor(private fb: FormBuilder, private router: Router,
    private loguinService: LoginService, private toastr: ToastrService,
    private sesion: RuteadorService) {

      this.toastr.toastrConfig.maxOpened=1;
      this.toastr.toastrConfig.preventDuplicates=true;

      this.usuario= new Usuario();

    this.loginForm = this.fb.group({
      usuario: ["", Validators.required],
      password: ["", Validators.required],

    });

    this.limpiarCampos();
  }


  async iniciarLogin() {
    this.toastr.previousToastMessage?.slice();
    console.log("iniciando consulta");

    this.loguinService.consultarUsuario(this.loginForm.get('usuario')?.value, this.loginForm.get('password')?.value);


    this.loguinService.obtenerUsuarios().subscribe(usuarios => {
      this.usuarios = usuarios;
      if(this.usuarios.length>0)
      {
        this.usuario=this.usuarios[0];
       
        const myObjUsuario = JSON.stringify(this.usuario);
        localStorage.setItem('usuario',myObjUsuario);

        this.router.navigate(["/dashboard/verPersonas"]);
      }
      else{
        this.toastr.error('No se ha encontrado al usuario', 'Inicio de Sessión');
        this.limpiarCampos();
      }
    });





//    this.toastr.success('Persona registrada correctamente', 'Registro de Personas');

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
