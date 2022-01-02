import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Escuela } from 'src/app/dataModels/escuela';
import { RuteadorService } from 'src/app/router/ruteador.service';
import { EscuelaService } from 'src/app/services/catalogos/escuela.service';
import { PerfilService } from 'src/app/services/perfil/perfil.service';
import { PersonaService } from "src/app/services/persona/persona/persona.service";
import { Persona, DatoBasicoPersona } from '../../../../dataModels/persona';

declare var tableUtil: any;

@Component({
  selector: 'app-view-persons',
  templateUrl: './verPersona.component.html',
  styleUrls: []
})
export class ViewPersonsComponent implements OnInit {

  personas: Persona[] = [];
  personasBusqueda: Persona[] = [];
  _idEliminar?: Persona;
  cantidadEscuelas = 0;
  listBusquedaPalabras: String[] = [];
  coincidirTodas: boolean = false;
  textoBusqueda: String = "";
  colorFilaContador = 0;


  listaEscuelasTodas: Escuela[] = [];
  listaEscuelasSeleccion: Escuela[] = [];


  //MOSTRAR U OCULTAR COLUMNAS
  mostrarCedula = true;
  mostrarNombres = true;
  mostrarApellidos = true;
  mostrarCelular = true;
  mostrarFechaNacimiento = true;
  mostrarFoto = true;
  mostrarResumenProcesos = true;
  mostrarEscuela = true;
  mostrarAccion = true;



  constructor(private personaService: PersonaService, private sesion: RuteadorService,
    private ruteadorService: RuteadorService, private router: Router,
    private escuelaService: EscuelaService,private perfilService:PerfilService) {
    sesion.existeUsuarioActivo();
  }

  ngOnInit(): void {

      console.log("ATRAS FUNCIONA ESTA DESACTIVADO");

      this.ruteadorService.servidorActivo(this.router.url);

      //new tableUtil();

      this.personaService.consultarPersonas();


      this.personaService.obtenerPersonas$().subscribe(personas => {
        this.personas = personas;
        this.buscar("");
      });


      this.escuelaService.consultarEscuelaCantidad().then((cantidad) => {
        this.cantidadEscuelas = cantidad;
      })

      this.escuelaService.consultarEscuela();
      this.escuelaService.obtenerEscuelas$().subscribe(tp => {
        this.listaEscuelasTodas = tp;
      });
  

  }


  idAEliminar(_id: any) {
    let tp: Persona = new Persona();
    this._idEliminar = this.personas.find(p => p._id === _id);
  }

  eliminarPersona() {
    console.log("ELIMINAR: " + this._idEliminar?._id);
    this.personaService.eliminarPersona(this._idEliminar?._id);
  }

  obtenerPorcentajeEscuelas(escuelas: Escuela[]): String {
    if (escuelas !== undefined) {
      if (escuelas.length > 0) {
        let porcentaje = (escuelas.length / this.cantidadEscuelas) * 100;
        return porcentaje.toString() + "%"
      }
    }
    return "0%";
  }




  buscar(event: any) {

    this.textoBusqueda = event.target !== undefined ? event.target.value : "";


    this.buscarOcurrencia();



  }

  buscarOcurrencia() {

    if (this.textoBusqueda.length > 0 || this.listaEscuelasSeleccion.length > 0) {
      this.personasBusqueda = [];
      this.listBusquedaPalabras = [];

      this.listBusquedaPalabras = this.textoBusqueda.split(" ");

      this.removerEspaciosAreglo();

      //console.log(this.listBusqueda);

      if (this.coincidirTodas) {
        console.log("ENTRO POR SI");
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
    let stringPersona = "";
    let personaAñadidaPalabra = false;

    //RECORRE CADA PERSONA
    this.personas.forEach(persona => {

      //CONVIERTE LA PERSONA A TEXTO
      stringPersona = JSON.stringify(persona).toLocaleLowerCase();

      //REPETIR ARREGLO DE OCURRENCIAS PALABRAS
      this.listBusquedaPalabras.forEach(busqueda => {
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
        this.listaEscuelasSeleccion.forEach(escuelaSeleccion => {
          if (repetirForEach) {

            //RECORRE LAS ESCUELAS DE LA PERSONA
            persona.escuela!.forEach(escuelaPersona => {

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

  buscarOcurrenciaEscuelasLibre() {

  }


  buscarOcurrenciaExacta() {
    let repetirForEach = true;
    let stringPersona = "";
    //let tamañoOcurrencias = this.listBusquedaPalabras.length;
    let contadorOcurrenciaEncontrada = 0;
    let contadorEscuelaEncontrada = 0;
    let personaAñadidaPalabra = false;

    //VARIABLES PARA VERIFICAR SI SE CUMPLIERON LAS BUSQUEDAS 
    let ocurrenciaTextoCumple = false;
    let ocurrenciaEscuelaCumple = false;


    //RECORRE CADA PERSONA
    this.personas.forEach(persona => {

      //CONVIERTE LA PERSONA A TEXTO
      stringPersona = JSON.stringify(persona).toLocaleLowerCase();

      //REPETIR ARREGLO DE OCURRENCIAS PALABRAS
      this.listBusquedaPalabras.forEach(palabraBusqueda => {

        //VER SI LA BUSQUEDA ESTA EN EL TEXTO DE LA PERSONA
        if (stringPersona.includes(palabraBusqueda.toString().toLocaleLowerCase())) {
          contadorOcurrenciaEncontrada++;
          //repetirForEach = false;
        }

      });

      //SOLO ENTRA SI HUBO PALABRAS PARA BUSCAR
      if (this.listBusquedaPalabras.length > 0) {
        if (contadorOcurrenciaEncontrada === this.listBusquedaPalabras.length) {
          ocurrenciaTextoCumple = true;
          console.log("CUMPLE EN PALABRAS INGRESADAS");
          //this.personasBusqueda.push(persona);
          //personaAñadidaPalabra = true;
        } else {
          ocurrenciaTextoCumple = false;
          console.log("NO CUMPLE EN PALABRAS INGRESADAS");
        }
      } else {
        //ESTABLECE QUE SI CUMPLE POR QUE NO EXISTE PALABRAS PARA BUSCAR 
        ocurrenciaTextoCumple = true;
      }


      contadorOcurrenciaEncontrada = 0;


      //SOLO ENTRA SI HAY ESCUELAS EN LA LISTA
      if (this.listaEscuelasSeleccion.length > 0) {

        this.listaEscuelasSeleccion.forEach(escuelaSeleccion => {
          //if (repetirForEach) {

          //RECORRE LAS ESCUELAS DE LA PERSONA
          persona.escuela!.forEach(escuelaPersona => {

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

  onChangeCoincidirTodas(_coincidirTodas: any) {//@@@@
    this.coincidirTodas = _coincidirTodas.currentTarget.checked;
    this.buscarOcurrencia();
  }



  marcarEscuelas(_id: String) {
    let _escuela = new Escuela();
    _escuela = this.listaEscuelasTodas.find(e => e._id === _id)!;
    this.listaEscuelasSeleccion.push(_escuela);
    this.listaEscuelasTodas = this.listaEscuelasTodas.filter(e => e._id !== _escuela._id);
    this.buscarOcurrencia();
  }

  desmarcarEscuelas(_id: String) {
    let _escuela = new Escuela();
    _escuela = this.listaEscuelasSeleccion.find(e => e._id === _id)!;
    this.listaEscuelasTodas.push(_escuela);
    this.listaEscuelasSeleccion = this.listaEscuelasSeleccion.filter(e => e._id !== _escuela._id);
    this.buscarOcurrencia();
  }




  onChangeVerColumnaCedula(_estado: any) {//@@@@
    this.mostrarCedula = _estado.currentTarget.checked;
  }

  onChangeVerColumnaNombres(_estado: any) {//@@@@
    this.mostrarNombres = _estado.currentTarget.checked;
  }
  onChangeVerColumnaApellidos(_estado: any) {//@@@@
    this.mostrarApellidos = _estado.currentTarget.checked;
  }
  onChangeVerColumnaCelular(_estado: any) {//@@@@
    this.mostrarCelular = _estado.currentTarget.checked;
  }
  onChangeVerColumnaFechaNacimiento(_estado: any) {//@@@@
    this.mostrarFechaNacimiento = _estado.currentTarget.checked;
  }
  onChangeVerColumnaFoto(_estado: any) {//@@@@
    this.mostrarFoto = _estado.currentTarget.checked;
  }
  onChangeVerColumnaResumenProceso(_estado: any) {//@@@@
    this.mostrarResumenProcesos = _estado.currentTarget.checked;
  }
  onChangeVerColumnaEscuela(_estado: any) {//@@@@
    this.mostrarEscuela = _estado.currentTarget.checked;
  }
  onChangeVerColumnaAccion(_estado: any) {//@@@@
    this.mostrarAccion = _estado.currentTarget.checked;
  }


  ordenarPorCedula() {
    this.personas.sort((a, b) => a.datoBasicoPersona!.cedula! - b.datoBasicoPersona!.cedula!);
  }
  ordenarPorNombres() {
    this.personas.sort((a, b) => {
      if (a.datoBasicoPersona!.nombres! > b.datoBasicoPersona!.nombres!) return 1;
      if (a.datoBasicoPersona!.nombres! < b.datoBasicoPersona!.nombres!) return -1;
      return 0;
    });
  }
  ordenarPorApellidos() {
    this.personas.sort((a, b) => {
      if (a.datoBasicoPersona!.apellidos! > b.datoBasicoPersona!.apellidos!) return 1;
      if (a.datoBasicoPersona!.apellidos! < b.datoBasicoPersona!.apellidos!) return -1;
      return 0;
    });
  }

  

  verPerfil(_persona:Persona) {
    this.perfilService.establecerPersona(_persona,true);
    this.router.navigate(["/dashboard/perfil"]);

  }


  obtenerLinkWhatsApp(_celular: any) {
    return "http://wa.me/593" + _celular;
  }
}
