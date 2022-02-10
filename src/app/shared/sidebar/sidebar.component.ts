import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DatoBasicoPersona, Persona } from 'src/app/dataModels/persona';
import { SessionUsuario } from 'src/app/dataModels/sessionUsuario';
import { General } from 'src/app/dataModels/staticGeneral';
import { MemoriaService } from 'src/app/services/compartido/memoria.service';
import { DatosPersonaService } from 'src/app/services/persona/datos-persona.service';
import { PersonaService } from 'src/app/services/persona/persona/persona.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: [],
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
    let objSesionUsuario = localStorage.getItem(General.DATOS_SESION);
    console.log('EXTRAER SESION USUARIO');
    console.log(objSesionUsuario);
    if (objSesionUsuario != null) {
      const sessionUsuario = JSON.parse(objSesionUsuario) as SessionUsuario;
      this.usuarioSesion = sessionUsuario;
    }
  }
}
