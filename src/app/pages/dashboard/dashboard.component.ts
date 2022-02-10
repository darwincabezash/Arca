import { Etapa } from 'src/app/dataModels/etapa';
import { RuteadorService } from './../../router/ruteador.service';
import { Component, OnInit } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { ChartModule } from 'primeng/chart';

import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';
import { EtapaService } from 'src/app/services/catalogos/etapa.service';
import { PersonaService } from 'src/app/services/persona/persona/persona.service';
import { Persona } from 'src/app/dataModels/persona';
import { EscuelaService } from 'src/app/services/catalogos/escuela.service';
import { Escuela } from 'src/app/dataModels/escuela';
import { SplitterModule } from 'primeng/splitter';
import { MemoriaService } from 'src/app/services/compartido/memoria.service';
import { UtilidadesService } from 'src/app/services/compartido/utilidades.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [],
})
export class DashboardComponent implements OnInit {
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
  chartOptions: any;
  edadNull = 0;

  coloresTodos: String[] = [
    '#19A091',
    '#DC535B',
    '#00b1dd',
    '#DB8031',
    '#EDAE1B',
    '#018cca',
    '#E9D01A',
    '#3c5da4',
    '#a0c047',
    '#a05095',
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

  constructor(
    private sesion: RuteadorService,
    private etapaService: EtapaService,
    private personaService: PersonaService,
    private escuelaService: EscuelaService,
    private memoriaService: MemoriaService,
    private utilidadesService: UtilidadesService
  ) {
    this.etapaService = new EtapaService();
    this.personaService = new PersonaService();

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

  ngOnInit(): void {
    //OBTENGO EL CODIGO DE IGLESIA A PARTIR DE LOS DATOS DE SESION DEL USUARIO
    this.codIglesia = this.utilidadesService.obtenerCodIglesiaSesion()!;

    //ESTABLEZCO EL CODIGO DE LA IGLESIA EN EL SERVICIO PARA CONSULTAR POR CODIGO DE IGLESIAS
    this.personaService.establecerCodIglesia(this.codIglesia);

    this.sesion.existeSessionActiva();
    console.log('VOY A CONSULTAR PERDONAS');

    this.updateChartOptions();

    //::: PERSONAS POR ETAPA
    this.personaService.consultarPersonas();
    this.personaService.obtenerPersonas$().subscribe((personas) => {
      this.personas = personas;
      console.log('VOY A CONSULTAR PERDONAS, TENGO: ' + this.personas.length);
      this.memoriaService.guardarLocalPersona(personas);

      this.etapaService.consultarEtapa();
      this.etapaService.obtenerEtapas$().subscribe((et) => {
        this.etapas = et;
        this.generarEtapasString();
        this.generarCantidadPersonasPorEtapa();
        this.convertirCantidadPersonaAPorcentajes();
        this.generarPersonasPorEtapas();
        this.mostrarCumpleañosMes();
      });
    });

    this.escuelaService.consultarEscuela();
    this.escuelaService.obtenerEscuelas$().subscribe((es) => {
      this.escuelas = es;
      this.cantidadEscuelas = es.length;
      console.log(es.length);
    });
  }

  //GENERA UN ARREGLO CON LOS NOMBRES DE LAS ETAPAS
  generarEtapasString() {
    this.estapasString = [];
    this.etapas.forEach((et) => {
      this.estapasString.push(et.tipo!);
    });

    this.escuelas.forEach((es) => {
      let escuelaTemp = new PersonasPorEscuelas();
      escuelaTemp._id = es._id;
      escuelaTemp.tipo = es.tipo;
      escuelaTemp.cantidad = 0;
      this.personasPorEscuelas.push(escuelaTemp);
    });
  }

  //::: PERSONAS POR ETAPA

  //GENERA UN ARREGLO CLASIFICANDO LA CANTIDAD DE PERSONAS POR ETAPA
  generarCantidadPersonasPorEtapa() {
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
          //console.log("ID_ESUELA: " +escuelaP._id);

          //RECORRO EL ARREGLO DE LAS PERSONAS POR ESCUELAS PARA INCREMENTAR LOS NUMEROS
          for (let i = 0; i < this.personasPorEscuelas.length; i++) {
            if (escuelaP.idEscuela === this.personasPorEscuelas[i]._id) {
              this.personasPorEscuelas[i].cantidad!++;

              break;
            }
          }
        });
      }
      //console.log("TOTALES");
      /*for (let i = 0; i < this.personasPorEscuelas.length; i++) {
        console.log("ESCUELA: " + this.personasPorEscuelas[i].tipo + "  CANTIDAD:  " + this.personasPorEscuelas[i].cantidad);
      }*/

      /*
            console.log("sexo ;:   " + sexoPersona?.length);
      
      
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
      let f1 = this.obtenerFechaNacimintoFormateada(persona.datoBasicoPersona!.fechaNacimiento).toString();
      let f2 = this.obtenerFechaNacimintoFormateada(new Date()).toString();

      if (f1 === f2) {
        this.personasCumpleanioMes.push(persona);

        console.log(
          'DAT 1:' +
          this.obtenerFechaNacimintoFormateada(
            persona.datoBasicoPersona!.fechaNacimiento
          )
        );
        console.log(
          'DAT 2:' + this.obtenerFechaNacimintoFormateada(new Date().toString())
        );
      }
    });
    console.log(
      '!tamaño personas cumple;: ' + this.personasCumpleanioMes.length
    );
  }

  //ESTA FUNCION TAMBIEN SE REPITE EN EL SERVICIO DE PERSONAS, ES MEJOR PONERLA EN UN LUGAR PARA REUSARLA
  obtenerFechaNacimintoFormateada(_fechaNacimiento: any) {
    let _fechaCumpleanio: String = '';
    try {
      if (_fechaNacimiento !== undefined) {
        let _dia = new Date(_fechaNacimiento).toLocaleString('es', {
          day: 'numeric',
        });
        let _mes: String = new Date(_fechaNacimiento).toLocaleString('es', {
          month: 'long',
        });
        let _anio: String = new Date(_fechaNacimiento).toLocaleString('es', {
          year: 'numeric',
        });

        _fechaCumpleanio =
          _dia +
          ' de ' +
          _mes[0].toUpperCase() +
          _mes.slice(1) +
          (Number(_anio) > 1999 ? ' del ' : ' de ') +
          _anio;

        return _fechaCumpleanio;
      } else {
        _fechaCumpleanio = 'No Disponible';
      }
    } catch {
      _fechaCumpleanio = 'No Disponible';
    }
    return _fechaCumpleanio;
  }
}

class PersonasPorEscuelas {
  _id?: String;
  tipo?: String;
  cantidad?: number;
}
