import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DatoBasicoPersona, Persona } from 'src/app/dataModels/persona';
import { SessionUsuario } from 'src/app/dataModels/sessionUsuario';
import { Sesiones } from 'src/app/shared/general/staticGeneral';
import { MemoriaService } from 'src/app/services/compartido/memoria.service';
import { DatosPersonaService } from 'src/app/services/persona/datos-persona.service';
import { PersonaService } from 'src/app/services/persona/persona/persona.service';
import * as $ from 'jquery';
//import * as AdminLTE from 'admin-lte';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.css'],
})
export class SidebarComponent implements OnInit {
  totalPersonas: number = 0;
  persona: Persona;
  usuarioSesion: SessionUsuario;

  datosPersonaSesion: any;
  personaLista: boolean = false;

  constructor(
    private personaService: PersonaService,
    private datosPersonaService: DatosPersonaService,
    private memoriaService: MemoriaService
  ) {
    this.persona = new Persona();
    this.usuarioSesion = new SessionUsuario();

    this.personaService.consultarDatosBasicosPersonas();
    /*this.personaService.obtenerPersonas$().subscribe((personas) => {
      this.totalPersonas = personas.length;
    });*/

    this.extraerSesionUsuario();

    this.extraerPersonaDeBase();
  }

  ngOnInit(): void {

$(document).ready(function () {
  $('.close-menu').click(function (e) {
    $('#sidebarMenu').removeClass('show');
  });
});


    $(document).ready(() => {


      /*$('#show-sidebar').click(function (e) {
        e.preventDefault();
      });*/



      /*$('.sidebar-dropdown > a').click(function (e) {
        e.preventDefault();
        $('.sidebar-submenu').slideUp(200);
        if ($(this).parent().hasClass('active')) {
          $('.sidebar-dropdown').removeClass('active');
          $(this).parent().removeClass('active');
        } else {
          $('.sidebar-dropdown').removeClass('active');
          $(this).next('.sidebar-submenu').slideDown(200);
          $(this).parent().addClass('active');
        }
      });

      $('#close-sidebar').click(function () {
        $('.page-wrapper').removeClass('toggled');
      });
      $('#show-sidebar').click(function () {
        $('.page-wrapper').addClass('toggled');
      });*/

    });

    /*var isLoadedBefore = localStorage.getItem('IsLoadedBefore');
    if (isLoadedBefore == 'true') {
      console.log("NO RECARGA");
      localStorage.setItem('IsLoadedBefore', 'false');
    } else {
      console.log('SI RECARGA');
      localStorage.setItem('IsLoadedBefore', 'true');
      /*use your reload method
window.location.reload();
    }*/

    let personas: any = this.memoriaService.obtenerLocalPersona();
    if (personas) {
      this.totalPersonas = personas.length;
      console.log('###  ' + this.totalPersonas);
    }
  }

  extraerPersonaDeBase() {
    this.datosPersonaSesion = localStorage.getItem('persona');
    if (this.datosPersonaSesion.length > 0) {
      this.personaLista = true;
      const _persona = JSON.parse(this.datosPersonaSesion) as Persona;
      this.persona = _persona;
    } else {
      //AQUI SE DEBE EMITIR UN ERROR EN CASO DE QUE NO SE HAYA PODIDO CARGAR A LA PERSONA
      let datoBasicoPersona: DatoBasicoPersona = new DatoBasicoPersona();
      this.persona = new Persona();
      this.persona.datoBasicoPersona = datoBasicoPersona;
    }
  }

  extraerSesionUsuario() {
    let objSesionUsuario = localStorage.getItem(Sesiones.DATOS_SESION);

    if (objSesionUsuario != null) {
      const sessionUsuario = JSON.parse(objSesionUsuario) as SessionUsuario;
      this.usuarioSesion = sessionUsuario;
    }
  }
}
