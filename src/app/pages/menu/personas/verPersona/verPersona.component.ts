import { Sesiones } from './../../../../shared/general/staticGeneral';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Escuela } from 'src/app/dataModels/escuela';
import { RuteadorService } from 'src/app/router/ruteador.service';
import { EscuelaService } from 'src/app/services/catalogos/escuela.service';
import { PerfilService } from 'src/app/services/perfil/perfil.service';
import { PersonaService } from 'src/app/services/persona/persona/persona.service';
import { Persona, DatoBasicoPersona } from '../../../../dataModels/persona';
import { jsPDF } from 'jspdf';
import { ToastrService } from 'ngx-toastr';
import { MemoriaService } from 'src/app/services/compartido/memoria.service';
import { ButtonModule } from 'primeng/button';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import html2canvas from 'html2canvas';
import { MenuItem } from 'primeng/api/menuitem';
import { Paginas } from 'src/app/shared/general/staticGeneral';
import { SessionUsuario } from 'src/app/dataModels/sessionUsuario';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

declare var tableUtil: any;

@Component({
  selector: 'app-view-persons',
  templateUrl: './verPersona.component.html',
  styleUrls: ['./verPersonaStyle.css'],
})
export class VerPersonaComponent implements OnInit {
  usuarioSesion: SessionUsuario;

  personas: Persona[] = [];
  personasBusqueda: Persona[] = [];
  _idEliminar?: Persona;
  cantidadEscuelas = 0;
  listBusquedaPalabras: String[] = [];
  coincidirTodas: boolean = false;
  textoBusqueda: String = '';
  colorFilaContador = 0;

  listaEscuelasTodas: Escuela[] = [];
  listaEscuelasSeleccion: Escuela[] = [];

  //MOSTRAR U OCULTAR COLUMNAS
  mostrarCedula = true;
  mostrarNombreCompleto = true;
  mostrarNombres = false;
  mostrarApellidos = false;
  mostrarCelular = true;
  mostrarFechaNacimiento = true;
  mostrarProcesos = true;
  mostrarEscuela = true;
  mostrarAccion = true;

  codIglesia: String = '';

  items: MenuItem[] = [];
  tooltipItems: MenuItem[] = [];
  leftTooltipItems: MenuItem[] = [];

  mostrarVistaReporte = false;
  vistaReporteHorizontal = false;
  tituloReporte = '';

  subscription!: Subscription;
  messages: any[] = [];

  anchoOrientacionReporte = '70%';

  constructor(
    private personaService: PersonaService,
    private sesion: RuteadorService,
    private ruteadorService: RuteadorService,
    private router: Router,
    private escuelaService: EscuelaService,
    private perfilService: PerfilService,
    private toastr: ToastrService,
    private memoriaService: MemoriaService,
    private location: Location
  ) {
    this.usuarioSesion = new SessionUsuario();
    this.toastr.toastrConfig.maxOpened = 1;
    this.toastr.toastrConfig.preventDuplicates = true;
    sesion.existeUsuarioActivo();

    this.subscription = this.memoriaService
      .getMessage()
      .subscribe((message) => {
        if (message) {
          this.messages.push(message);
          let per: any = this.memoriaService.obtenerLocalPersona();

          if (per) {
            this.personas = per;
          }
        } else {
          // clear messages when empty message received
          this.messages = [];
        }
      });
  }

  downloadPDF() {
    // Extraemos el
    const DATA = document.getElementById('data');
    const doc = new jsPDF(this.vistaReporteHorizontal ? 'l' : 'p', 'pt', 'a4');
    const options = {
      orientation: this.vistaReporteHorizontal ? 'l' : 'p',
      background: 'white',
      scale: 3,
    };
    window.scrollTo(0, 0);
    html2canvas(DATA!, options)
      .then((canvas) => {
        const img = canvas.toDataURL('image/PNG');

        // Add image Canvas to PDF
        const bufferX = 15;
        const bufferY = 15;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        return doc;
      })
      .then((docResult) => {
        docResult.save(`${new Date().toISOString()}_tutorial.pdf`);
      });
  }

  _imprimir() {
    //NUEVO
    const DATA = document.getElementById('htmlData');
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'in',
      format: [4, 2],
    });

    doc.text('Hello world!', 10, 10);
    doc.save('a4.pdf');

    doc.text('Hello world!', 1, 1);
    doc.save('two-by-four.pdf');

    //
  }

  async ngOnInit(): Promise<void> {
    this.items = [
      {
        icon: 'pi pi-pencil',
        command: () => {
          this.t();
        },
      },
      {
        icon: 'pi pi-refresh',
        command: () => {
          this.t();
        },
      },
      {
        icon: 'pi pi-trash',
        command: () => {
          this.t();
        },
      },
    ];

    this.ruteadorService.servidorActivo(this.router.url);

    //new tableUtil();

    //OBTENGO EL CODIGO DE IGLESIA A PARTIR DE LOS DATOS DE SESION DEL USUARIO
    //this.codIglesia = this.utilidadesService.obtenerCodIglesiaSesion()!;

    //ESTABLEZCO EL CODIGO DE LA IGLESIA EN EL SERVICIO PARA CONSULTAR POR CODIGO DE IGLESIAS
    //this.personaService.establecerCodIglesia(this.codIglesia);

    //console.log("MI CODIGO DE IGLESIA :  " +this.codIglesia);

    //ESTO ES LO QUE DEBERIA ESTAR ACTIVO-------------------------------------------- SI LO DEMAS NO FUNCIONA, DESCOMENTAR ESTE BLOQUE

    //)))))))))))))XXXXXXXXXX

    if (!this.memoriaService.existeLocalPersona()) {
      this.personaService.consultarPersonas();

      await this.personaService.obtenerPersonas$().subscribe((personas) => {
        this.personas = personas;

        this.memoriaService.guardarLocalPersona(personas);
        this.buscar('');
      });
      this.obtenerEscuelas();
    } else {
      this.personas = this.memoriaService.obtenerLocalPersona()!;
      this.obtenerEscuelas();
    }

    /*
    console.log('LLEGO A OBTENER PERSONA LOCAL');
    let personas: any = this.memoriaService.obtenerLocalPersona();
    console.log('TAMAÑO PERSONAS: ' + personas.length);
    if (personas) {
      this.personas = personas;
      this.escuelaService.consultarEscuelaCantidad().then((cantidad) => {
        this.cantidadEscuelas = cantidad;
      });
    } else {
      //SE DEBE MOSTRAR UN ERROR POR QUE NO SE PUDO OBTENER EL CODIGO DE IGLESIA Y A PARTIR DE AHI LAS PERSONAS QUE PERTENECEN A ESE IGLESIA
      this.toastr.error('Existe un error al cargar la información.');
    }*/

    //------------------------------------------------------------------------------

    this.buscar('');

    /*
    if (this.codIglesia != undefined) {
      this.personaService.consultarPersonas();

      this.personaService.obtenerPersonas$().subscribe((personas) => {
        this.personas = personas;
        console.log('CANTIDAD DE PERSONAS - x: ' + personas.length);
        this.buscar('');
      });

      this.escuelaService.consultarEscuelaCantidad().then((cantidad) => {
        this.cantidadEscuelas = cantidad;
      });

      this.escuelaService.consultarEscuela();
      this.escuelaService.obtenerEscuelas$().subscribe((tp) => {
        this.listaEscuelasTodas = tp;
      });
    } else {
      //SE DEBE MOSTRAR UN ERROR POR QUE NO SE PUDO OBTENER EL CODIGO DE IGLESIA Y A PARTIR DE AHI LAS PERSONAS QUE PERTENECEN A ESE IGLESIA
      this.toastr.error('Existe un error al cargar la información.');
    }*/

    this.extraerSesionUsuario();
  }

  obtenerEscuelas() {
    this.escuelaService.consultarEscuela();
    this.escuelaService.obtenerEscuelas$().subscribe((tp) => {
      this.listaEscuelasTodas = tp;
    });

    this.escuelaService.consultarEscuelaCantidad().then((cantidad) => {
      this.cantidadEscuelas = cantidad;
    });

    /*this.personas.forEach((a) => {
      console.log(a.datoBasicoPersona!.nombres);
      a.escuela!.forEach((b) => {
        console.log(b.tipo);
      });
    });*/
  }

  t() {}

  idAEliminar(_id: any) {
    let tp: Persona = new Persona();
    this._idEliminar = this.personas.find((p) => p._id === _id);
  }

  async eliminarPersona() {
    await this.personaService.eliminarPersona(this._idEliminar?._id);
    this.personaService.consultarPersonas();

    await this.personaService.obtenerPersonas$().subscribe((personas) => {
      this.personas = personas;

      this.memoriaService.guardarLocalPersona(personas);
      this.buscar('');
    });
  }

  obtenerPorcentajeEscuelas(escuelas: Escuela[]): String {
    if (escuelas !== undefined) {
      if (escuelas.length > 0) {
        let porcentaje = (escuelas.length / this.cantidadEscuelas) * 100;
        return porcentaje.toString() + '%';
      }
    }
    return '0%';
  }

  buscar(event: any) {
    this.textoBusqueda = event.target !== undefined ? event.target.value : '';

    this.buscarOcurrencia();
  }

  buscarOcurrencia() {
    if (
      this.textoBusqueda.length > 0 ||
      this.listaEscuelasSeleccion.length > 0
    ) {
      this.personasBusqueda = [];
      this.listBusquedaPalabras = [];

      this.listBusquedaPalabras = this.textoBusqueda.split(' ');

      this.removerEspaciosAreglo();

      //console.log(this.listBusqueda);

      if (this.coincidirTodas) {
        this.buscarOcurrenciaExacta();
      } else {
        this.buscarOcurrenciaLibre();
      }

      //return this.personas.some(word => this.personas.toLowerCase().includes(word.toLowerCase()));
    } else {
      this.personasBusqueda = this.personas;
    }
  }

  removerEspaciosAreglo() {
    for (let i = 0; i < this.listBusquedaPalabras.length; i++) {
      if (this.listBusquedaPalabras[i].length === 0) {
        this.listBusquedaPalabras.splice(i, 1);
        i = 0;
      }
    }
  }

  buscarOcurrenciaLibre() {
    let repetirForEach = true;
    let stringPersona = '';
    let personaAñadidaPalabra = false;

    //RECORRE CADA PERSONA
    this.personas.forEach((persona) => {
      //CONVIERTE LA PERSONA A TEXTO
      stringPersona = JSON.stringify(persona).toLocaleLowerCase();

      //REPETIR ARREGLO DE OCURRENCIAS PALABRAS
      this.listBusquedaPalabras.forEach((busqueda) => {
        if (repetirForEach) {
          //VER SI LA BUSQUEDA ESTA EN EL TEXTO DE LA PERSONA
          if (stringPersona.includes(busqueda.toString().toLocaleLowerCase())) {
            this.personasBusqueda.push(persona);
            repetirForEach = false;
            personaAñadidaPalabra = true;
          }
        }
      });
      repetirForEach = true;

      if (!personaAñadidaPalabra) {
        this.listaEscuelasSeleccion.forEach((escuelaSeleccion) => {
          if (repetirForEach) {
            //RECORRE LAS ESCUELAS DE LA PERSONA
            persona.escuela!.forEach((escuelaPersona) => {
              //VER SI LA ESCUELA SELECCIONADA ESTA ENTRE LAS ESCUELAS DE LA PERSONA
              if (escuelaSeleccion._id === escuelaPersona.idEscuela) {
                this.personasBusqueda.push(persona);
                repetirForEach = false;
              }
            });
          }
        });
      }
      repetirForEach = true;

      personaAñadidaPalabra = false;
    });
  }

  buscarOcurrenciaEscuelasLibre() {}

  buscarOcurrenciaExacta() {
    let repetirForEach = true;
    let stringPersona = '';
    //let tamañoOcurrencias = this.listBusquedaPalabras.length;
    let contadorOcurrenciaEncontrada = 0;
    let contadorEscuelaEncontrada = 0;
    let personaAñadidaPalabra = false;

    //VARIABLES PARA VERIFICAR SI SE CUMPLIERON LAS BUSQUEDAS
    let ocurrenciaTextoCumple = false;
    let ocurrenciaEscuelaCumple = false;

    //RECORRE CADA PERSONA
    this.personas.forEach((persona) => {
      //CONVIERTE LA PERSONA A TEXTO
      stringPersona = JSON.stringify(persona).toLocaleLowerCase();

      //REPETIR ARREGLO DE OCURRENCIAS PALABRAS
      this.listBusquedaPalabras.forEach((palabraBusqueda) => {
        //VER SI LA BUSQUEDA ESTA EN EL TEXTO DE LA PERSONA
        if (
          stringPersona.includes(palabraBusqueda.toString().toLocaleLowerCase())
        ) {
          contadorOcurrenciaEncontrada++;
          //repetirForEach = false;
        }
      });

      //SOLO ENTRA SI HUBO PALABRAS PARA BUSCAR
      if (this.listBusquedaPalabras.length > 0) {
        if (contadorOcurrenciaEncontrada === this.listBusquedaPalabras.length) {
          ocurrenciaTextoCumple = true;
          //this.personasBusqueda.push(persona);
          //personaAñadidaPalabra = true;
        } else {
          ocurrenciaTextoCumple = false;
        }
      } else {
        //ESTABLECE QUE SI CUMPLE POR QUE NO EXISTE PALABRAS PARA BUSCAR
        ocurrenciaTextoCumple = true;
      }

      contadorOcurrenciaEncontrada = 0;

      //SOLO ENTRA SI HAY ESCUELAS EN LA LISTA
      if (this.listaEscuelasSeleccion.length > 0) {
        this.listaEscuelasSeleccion.forEach((escuelaSeleccion) => {
          //if (repetirForEach) {

          //RECORRE LAS ESCUELAS DE LA PERSONA
          persona.escuela!.forEach((escuelaPersona) => {
            if (repetirForEach) {
              //VER SI LA ESCUELA SELECCIONADA ESTA ENTRE LAS ESCUELAS DE LA PERSONA
              if (escuelaSeleccion._id === escuelaPersona.idEscuela) {
                contadorEscuelaEncontrada++;

                //this.personasBusqueda.push(persona);
                repetirForEach = false;
              }
            }
          });

          repetirForEach = true;
        });
      } else {
        ocurrenciaEscuelaCumple = true;
      }

      if (contadorEscuelaEncontrada === this.listaEscuelasSeleccion.length) {
        ocurrenciaEscuelaCumple = true;
        //this.personasBusqueda.push(persona);
      } else {
        ocurrenciaEscuelaCumple = false;
      }

      contadorEscuelaEncontrada = 0;

      //}

      if (ocurrenciaTextoCumple && ocurrenciaEscuelaCumple) {
        this.personasBusqueda.push(persona);
      }
    });
  }

  onChangeCoincidirTodas(_coincidirTodas: any) {
    //@@@@
    this.coincidirTodas = _coincidirTodas.currentTarget.checked;
    this.buscarOcurrencia();
  }

  marcarEscuelas(_id: String) {
    let _escuela = new Escuela();
    _escuela = this.listaEscuelasTodas.find((e) => e._id === _id)!;
    this.listaEscuelasSeleccion.push(_escuela);
    this.listaEscuelasTodas = this.listaEscuelasTodas.filter(
      (e) => e._id !== _escuela._id
    );
    this.buscarOcurrencia();
  }

  desmarcarEscuelas(_id: String) {
    let _escuela = new Escuela();
    _escuela = this.listaEscuelasSeleccion.find((e) => e._id === _id)!;
    this.listaEscuelasTodas.push(_escuela);
    this.listaEscuelasSeleccion = this.listaEscuelasSeleccion.filter(
      (e) => e._id !== _escuela._id
    );
    this.buscarOcurrencia();
  }

  onChangeVerColumnaCedula(_estado: any) {
    //@@@@
    this.mostrarCedula = _estado.currentTarget.checked;
  }

  onChangeVerColumnaNombreCompleto(_estado: any) {
    //@@@@
    this.mostrarNombreCompleto = _estado.currentTarget.checked;
  }

  onChangeVerColumnaNombres(_estado: any) {
    //@@@@
    this.mostrarNombres = _estado.currentTarget.checked;
  }
  onChangeVerColumnaApellidos(_estado: any) {
    //@@@@
    this.mostrarApellidos = _estado.currentTarget.checked;
  }
  onChangeVerColumnaCelular(_estado: any) {
    //@@@@
    this.mostrarCelular = _estado.currentTarget.checked;
  }
  onChangeVerColumnaFechaNacimiento(_estado: any) {
    //@@@@
    this.mostrarFechaNacimiento = _estado.currentTarget.checked;
  }
  onChangeVerColumnaProceso(_estado: any) {
    //@@@@
    this.mostrarProcesos = _estado.currentTarget.checked;
  }
  onChangeVerColumnaEscuela(_estado: any) {
    //@@@@
    this.mostrarEscuela = _estado.currentTarget.checked;
  }
  onChangeVerColumnaAccion(_estado: any) {
    //@@@@
    this.mostrarAccion = _estado.currentTarget.checked;
  }

  ordenarPorCedula() {
    this.personas.sort(
      (a, b) => a.datoBasicoPersona!.cedula! - b.datoBasicoPersona!.cedula!
    );
  }
  ordenarPorNombres() {
    this.personas.sort((a, b) => {
      if (a.datoBasicoPersona!.nombres! > b.datoBasicoPersona!.nombres!)
        return 1;
      if (a.datoBasicoPersona!.nombres! < b.datoBasicoPersona!.nombres!)
        return -1;
      return 0;
    });
  }
  ordenarPorApellidos() {
    this.personas.sort((a, b) => {
      if (a.datoBasicoPersona!.apellidos! > b.datoBasicoPersona!.apellidos!)
        return 1;
      if (a.datoBasicoPersona!.apellidos! < b.datoBasicoPersona!.apellidos!)
        return -1;
      return 0;
    });
  }

  verPerfil(_persona: Persona) {
    this.perfilService.establecerPersona(
      _persona,
      true,
      Paginas.INICIO_VERPERSONA
    );
    this.router.navigate([Paginas.INICIO_PERFIL]);
  }

  obtenerLinkWhatsApp(_celular: any) {
    return 'http://wa.me/593' + _celular;
  }

  cambiarAVistaReporte() {
    this.mostrarVistaReporte = this.mostrarVistaReporte ? false : true;
  }

  cambiarReporteAHorizontal() {
    this.vistaReporteHorizontal = this.vistaReporteHorizontal ? false : true;
    if (this.vistaReporteHorizontal) {
      this.anchoOrientacionReporte = '100%';
    } else {
      this.anchoOrientacionReporte = '70%';
    }
  }

  extraerSesionUsuario() {
    let objSesionUsuario = localStorage.getItem(Sesiones.DATOS_SESION);
    if (objSesionUsuario != null) {
      const sessionUsuario = JSON.parse(objSesionUsuario) as SessionUsuario;
      this.usuarioSesion = sessionUsuario;
    }
  }

  editarPersona(_persona: Persona) {
    this.perfilService.establecerPersona(
      _persona,
      false,
      Paginas.INICIO_VERPERSONA
    );
    this.router.navigate([Paginas.INICIO_MODIFICARPERSONA]);
  }

  actualizarPagina() {
    //this.actualizarBase();
this.ngOnInit();  }

  async actualizarBase() {
    this.personaService.consultarPersonas();

    await this.personaService.obtenerPersonas$().subscribe((personas) => {
      console.log('VIENEN PERSONAS: ' + personas.length);
      //this.memoriaService.eliminarLocalPersona();
      this.memoriaService.guardarLocalPersona(personas);
      console.log('GUARDO EN MEMORIA');
      this.personas = [];

      this.personas = this.memoriaService.obtenerLocalPersona()!;
      console.log('REASIGNO A PERSONAS');
    });
  }
}
