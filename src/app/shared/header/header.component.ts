import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDataService } from 'src/app/services/general/user-data.service';
import { Sesiones } from 'src/app/shared/general/staticGeneral';
import * as $ from 'jquery';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class HeaderComponent implements OnInit {


  _mostrarNuevPersona:boolean=false;

  constructor(private router: Router, private userDataService: UserDataService) { }


  cerrarSesion(){
    this.eliminarSession();
    this.router.navigate(["/login"]);
  }

  eliminarSession() {
    localStorage.setItem(Sesiones.DATOS_SESION, "");
    localStorage.setItem("persona", "");
    localStorage.setItem('usuario', "");
    localStorage.setItem('datos_persona', '');
  }

  ngOnInit(): void {




    this.userDataService.obtenerNotificacionNuevaPersona$().subscribe(_id => {
      if (_id.length > 0) {
        this._mostrarNuevPersona = true;
      } else {
        this._mostrarNuevPersona = false;
      }
    });

  }

}
