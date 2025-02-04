import { Etapa } from 'src/app/dataModels/etapa';
import { RuteadorService } from './../../router/ruteador.service';
import { Component, OnInit } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { ChartModule } from 'primeng/chart';

import { ButtonModule } from 'primeng/button';
import { Observable, Subscription } from 'rxjs';
import { EtapaService } from 'src/app/services/catalogos/etapa.service';
import { PersonaService } from 'src/app/services/persona/persona/persona.service';
import { Persona } from 'src/app/dataModels/persona';
import { EscuelaService } from 'src/app/services/catalogos/escuela.service';
import { Escuela } from 'src/app/dataModels/escuela';
import { SplitterModule } from 'primeng/splitter';
import { MemoriaService } from 'src/app/services/compartido/memoria.service';
import { UtilidadesService } from 'src/app/services/compartido/utilidades.service';
import { Router } from '@angular/router';
import { Paginas } from 'src/app/shared/general/staticGeneral';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [],
})
export class DashboardComponent implements OnInit {
  messages: any[] = [];
  subscription!: Subscription;
  c = 0;

  //COMUN

  //::: PERSONAS POR ETAPA
  checked: boolean = false;
  etapas: Etapa[] = [];
  estapasString: String[] = [];
  personas: Persona[] = [];
  cantidadPersonasPorEtapa: number[] = [];

  personasPorEtapa: any;
  adultosPorSexo: any;
  anioActual: number = 0;
  mesActual: number = 0;
  chartOptions: any;
  edadNull = 0;

  coloresTodos: String[] = [
    '#BBBEC3',
    '#10B981',
    '#BBEAD9',
    '#30316A',
    '#E11D48',
    '#F3C78E',
    '#D7C5FA',
    '#FD8E7A',
    '#4D4AE8',
    '#EE5050',
    '#ce3874',
    '#00AD6E',
  ];
  
  coloresSeleccion: String[] = [];

  //:::: PERSONAS POR ESCUELAS FINALIZADAS
  escuelas: Escuela[] = [];
  personasPorEscuelas: PersonasPorEscuelas[] = [];
  cantidadEscuelas = 0;

  //CODIGO DE IGLESIA
  codIglesia: String = '';

  personasCumpleanioMes: Persona[] = [];
  clientes$!: Observable<Persona[]>;

  personasSinEscuela = 0;
  nuevasPersonas = 0;

  constructor(
    private router: Router,
    private sesion: RuteadorService,
    private etapaService: EtapaService,
    private personaService: PersonaService,
    private escuelaService: EscuelaService,
    private memoriaService: MemoriaService,
    private utilidadesService: UtilidadesService
  ) {
    this.etapaService = new EtapaService();
    //this.personaService = new PersonaService();

    this.anioActual = new Date().getFullYear();

    this.personas = [];
    this.cantidadPersonasPorEtapa = [];
    this.coloresSeleccion = [];
    this.edadNull = 0;
    this.estapasString = [];
    this.etapas = [];
    this.personasPorEscuelas = [];
  }

  updateChartOptions() {
    this.chartOptions = this.getLightTheme();
  }

  getLightTheme() {
    return {
      plugins: {
        legend: {
          labels: {
            color: '#495057',
          },
        },
      },
    };
  }

  async ngOnInit(): Promise<void> {
    //console.log('VOY A ELIMINAR LA IMAGEN ');
    //this.utilidadesService.eliminarImagenFirebase('');
    //this.router.navigate(["inicio/padre"]);

    this.c++;
    this.personas = [];
    //this.memoriaService.sendMessage();

    //OBTENGO EL CODIGO DE IGLESIA A PARTIR DE LOS DATOS DE SESION DEL USUARIO
    //this.codIglesia = this.utilidadesService.obtenerCodIglesiaSesion()!;

    //ESTABLEZCO EL CODIGO DE LA IGLESIA EN EL SERVICIO PARA CONSULTAR POR CODIGO DE IGLESIAS
    //this.personaService.establecerCodIglesia(this.codIglesia);

    this.sesion.existeUsuarioActivo();

    this.updateChartOptions();

    //::: PERSONAS POR ETAPA

    if (!this.memoriaService.existeLocalPersona()) {
      this.personaService.consultarPersonas();
    } else {
      let personas: any = this.memoriaService.obtenerLocalPersona();
      if (personas) {
        this.personas = personas;
        this.cargarWidgets();
      }
    }

    await this.personaService.obtenerPersonas$().subscribe((personas) => {
      this.personas = personas;

      this.memoriaService.guardarLocalPersona(personas);

      this.cargarWidgets();
    });
  }

  cargarWidgets() {
    this.escuelas = [];
    this.cantidadEscuelas = 0;
    this.personasPorEscuelas = [];

    this.etapaService.consultarEtapa();
    this.etapaService.obtenerEtapas$().subscribe((et) => {
      this.etapas = et;
      this.generarEtapasString();
      this.generarCantidadPersonasPorEtapa();
      this.convertirCantidadPersonaAPorcentajes();
      this.generarPersonasPorEtapas();
    });

    this.escuelaService.consultarEscuela();
    this.escuelaService.obtenerEscuelas$().subscribe((es) => {
      this.escuelas = es;
      this.cantidadEscuelas = es.length;

      this.escuelas.forEach((es) => {
        let escuelaTemp = new PersonasPorEscuelas();
        escuelaTemp._id = es._id;
        escuelaTemp.tipo = es.tipo;
        escuelaTemp.cantidad = 0;
        this.personasPorEscuelas.push(escuelaTemp);
      });

      this.generarCantidadPersonasPorEtapa();
    });

    this.mostrarCumpleañosMes();
  }

  //GENERA UN ARREGLO CON LOS NOMBRES DE LAS ETAPAS
  generarEtapasString() {
    this.estapasString = [];
    this.etapas.forEach((et) => {
      this.estapasString.push(et.tipo!);
    });
  }

  limpiarArrayPersonasPorEscuelas() {
    this.personasPorEscuelas.forEach((p) => {
      p.cantidad = 0;
    });
  }
  //::: PERSONAS POR ETAPA

  //GENERA UN ARREGLO CLASIFICANDO LA CANTIDAD DE PERSONAS POR ETAPA
  generarCantidadPersonasPorEtapa() {
    this.limpiarArrayPersonasPorEscuelas();
    this.personasSinEscuela = 0;
    this.nuevasPersonas = 0;
    let personasEspejo = this.personas;
    this.edadNull = 0;

    //INICIALIZA LOS ARRAY CON TAMAÑOS PARA LA CANTIDAD DE ETAPAS
    this.cantidadPersonasPorEtapa = new Array(this.etapas.length);
    this.coloresSeleccion = new Array(this.etapas.length);

    //LLENA LOS ARREGLOS ANTERIORMENTE CREADOS CON CANTIDAD DE PERSONAS Y COLORES PARA CADA ETAPA
    for (let i = 0; i < this.etapas.length; i++) {
      this.cantidadPersonasPorEtapa[i] = 0;
      this.coloresSeleccion[i] = this.coloresTodos[i];
    }

    //REPITE CADA PERSONA
    this.personas.forEach((p) => {
      let edadPersona = this.obtenerEdad(
        this.anioActual,
        p.datoBasicoPersona?.fechaNacimiento
      );
      //let sexoPersona = p.datoBasicoPersona?.sexo;

      //VERIFICA SI LA EDAD ES CORRECTA
      if (edadPersona !== null) {
        //REPITE LAS ETAPAS
        for (let i = 0; i < this.etapas.length; i++) {
          //VERIFICA LA EDAD EN RANGO DE ETAPA_SERVICE
          if (
            edadPersona >= this.etapas[i].edadI! &&
            edadPersona <= this.etapas[i].edadF!
          ) {
            this.cantidadPersonasPorEtapa[i]++;
          }
        }
      } else {
        //ACUMULA LAS EDADES ERRONEAS
        this.edadNull++;
      }

      //SI LA PERSONA TIENE ESCUELAS
      if (p.escuela!.length > 0) {
        //RECORRO LAS ESCUELAS DE LA PERSONA

        p.escuela!.forEach((escuelaP) => {
          //RECORRO EL ARREGLO DE LAS PERSONAS POR ESCUELAS PARA INCREMENTAR LOS NUMEROS

          for (let i = 0; i < this.personasPorEscuelas.length; i++) {
            if (escuelaP.idEscuela === this.personasPorEscuelas[i]._id) {
              this.personasPorEscuelas[i].cantidad!++;
              break;
            }
          }
        });
      } else {
        this.personasSinEscuela++;
      }
      /*for (let i = 0; i < this.personasPorEscuelas.length; i++) {
      }*/

      /*
      
      
            //VERIFICA SI EL SE ES CORRECTO
            if (sexoPersona!.length > 0) {
      
              //REPITE LAS ETAPAS
              //for (let i = 0; i < this.etapas.length; i++) {
      
              //VERIFICA LA EDAD EN RANGO DE ETAPA_SERVICE
              if (sexoPersona === "H") {
      
                //this.cantidadPersonasPorEtapa[i]++;
              }
              //}
            } else {
      
              //ACUMULA LAS EDADES ERRONEAS
              this.edadNull++;
            }
      
      */

      if (
        this.utilidadesService.diasNuevaPersona(
          p.datoBasicoPersona?.fechaRegistro
        ) < 31
      ) {
        this.nuevasPersonas++;
      }
    });

    //VERIFICA SI EXITIERON EDADES ERRONEAS
    if (this.edadNull > 0) {
      //AÑADE UNA ULTIMA POSICION A LOS ARREGLOS PARA EL GRAFICO
      this.cantidadPersonasPorEtapa.push(this.edadNull);
      this.coloresSeleccion.push('#7B7B7B');
      this.estapasString.push('Sin Edad');
    }
  }

  //CONVIERTE LAS CANTIDADES DE PERSONAS A PORCENTAJES SOBRE 100
  convertirCantidadPersonaAPorcentajes() {
    let cantidad = 0;

    for (let i = 0; i < this.cantidadPersonasPorEtapa.length; i++) {
      //if (this.cantidadPersonasPorEtapa[i] > 0) {
      cantidad = this.cantidadPersonasPorEtapa[i];
      this.cantidadPersonasPorEtapa[i] = Math.round(
        (cantidad / this.personas.length) * 100
      );
    }
  }

  //OBTIENE EDAD DE PERSONA
  obtenerEdad(_añoActual: number, _fechaNacimiento: any) {
    let fechaN = new Date(_fechaNacimiento);
    if (_fechaNacimiento !== undefined) {
      return _añoActual - fechaN.getFullYear();
    } else {
      return null;
    }
  }

  generarPersonasPorEtapas() {
    this.personasPorEtapa = [];
    this.personasPorEtapa = {
      //labels: ['Niños', 'Pre-Adolecentes', 'Adolecentes', 'Jovenes', 'Adultos', 'Adultos Mayores'],
      labels: this.estapasString,
      datasets: [
        {
          //data: [32, 8, 12, 15, 28],
          data: this.cantidadPersonasPorEtapa,

          /*backgroundColor: [
            "#EA6740",
            "#F1A560",
            "#DAEA96",
            "#A1D39E",
          ],
          hoverBackgroundColor: [
            "#EA6740",
            "#F1A560",
            "#DAEA96",
            "#A1D39E",
          ]*/

          backgroundColor: this.coloresSeleccion,
          hoverBackgroundColor: this.coloresSeleccion,
        },
      ],
    };
  }

  generarAdultosPorSexo() {
    this.adultosPorSexo = {
      labels: [
        'Hombres',
        'Mujeres',
        '        ',
        '        ',
        '        ',
        '        ',
        '        ',
        '        ',
        '        ',
      ],
      datasets: [
        {
          data: [35, 65, 0, 0, 0, 0, 0, 0, 0],

          backgroundColor: [
            '#2AA9C7',
            '#F26162',
            '#FFF',
            '#FFF',
            '#FFF',
            '#FFF',
            '#FFF',
            '#FFF',
            '#FFF',
          ],
          hoverBackgroundColor: [
            '#2AA9C7',
            '#F26162',
            '#FFF',
            '#FFF',
            '#FFF',
            '#FFF',
            '#FFF',
            '#FFF',
            '#FFF',
          ],
        },
      ],
    };
  }

  obtenerPorcentaje(escuelas: any): String {
    if (escuelas !== undefined) {
      if (escuelas > 0) {
        let porcentaje = (escuelas / this.cantidadEscuelas) * 100;
        return porcentaje.toString() + '%';
      }
    }
    return '0%';
  }

  obtenerColorFondoBarra(_escuela: any) {
    let _porcentaje = 0;
    if (_escuela !== undefined) {
      if (_escuela.length > 0) {
        _porcentaje = (_escuela / this.cantidadEscuelas) * 100;

        //ROJO
        if (_porcentaje < 20) {
          return '#A91A17';
        }

        //NARANJA
        if (_porcentaje > 19 && _porcentaje < 46) {
          return '#E68E25';
        }

        //AZUL
        if (_porcentaje > 45 && _porcentaje < 80) {
          return '#3291CF';
        }

        //VERDE
        if (_porcentaje >= 80) {
          return '#2AC26A';
        }
      }
    }
    return 0;
  }

  mostrarCumpleañosMes() {
    this.personasCumpleanioMes = [];

    this.personas.forEach((persona) => {
      let f1 = this.obtenerFechaNacimintoFormateadaCumpleaño(
        persona.datoBasicoPersona!.fechaNacimiento
      ).toString();
      let f2 = this.obtenerFechaNacimintoFormateadaCumpleaño(
        new Date()
      ).toString();
      if (f1 === f2) {
        this.personasCumpleanioMes.push(persona);
      }
    });
  }

  //ESTA FUNCION TAMBIEN SE REPITE EN EL SERVICIO DE PERSONAS, ES MEJOR PONERLA EN UN LUGAR PARA REUSARLA
  obtenerFechaNacimintoFormateadaCumpleaño(_fechaNacimiento: any) {
    let _mesCumplanio: String = '';
    try {
      if (_fechaNacimiento !== undefined) {
        let _mes: String = new Date(_fechaNacimiento).toLocaleString('es', {
          month: 'long',
        });

        _mesCumplanio = _mes[0].toUpperCase() + _mes.slice(1);

        return _mesCumplanio;
      } else {
        _mesCumplanio = 'No Disponible';
      }
    } catch {
      _mesCumplanio = 'No Disponible';
    }
    return _mesCumplanio;
  }

  clic() {
    // this.personaService.consultarPersonas();
  }
}

class PersonasPorEscuelas {
  _id?: String;
  tipo?: String;
  cantidad?: number;
}
