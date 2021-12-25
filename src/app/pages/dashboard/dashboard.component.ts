import { RuteadorService } from './../../router/ruteador.service';
import { Component, OnInit } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { ChartModule } from 'primeng/chart';

import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: []
})
export class DashboardComponent implements OnInit {

  checked: boolean = false;



  personasPorEtapa: any;
  adultosPorSexo: any;

  chartOptions: any;



  constructor(private sesion: RuteadorService) {
    
    this.generarPersonasPorEtapas();
    this.generarAdultosPorSexo();
    this.updateChartOptions();
  }

  updateChartOptions() {
    this.chartOptions = this.getLightTheme();
  }

  getLightTheme() {
    return {
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      }
    }
  }

  ngOnInit(): void {
    
      this.sesion.existeUsuarioActivo();
  }

  update(event: Event) {
    //this.data = //create new data
  }

  generarPersonasPorEtapas() {
    this.personasPorEtapa = {
      labels: ['Niños', 'Pre-Adolecentes', 'Adolecentes', 'Jovenes', 'Adultos', 'Adultos Mayores'],
      datasets: [
        {
          data: [32, 8, 12, 15, 28, 5],

          backgroundColor: [
            "#EA6740",
            "#F1A560",
            "#DAEA96",
            "#A1D39E",
            "#5FB89D",
            "#2B80B2"
          ],
          hoverBackgroundColor: [
            "#EA6740",
            "#F1A560",
            "#DAEA96",
            "#A1D39E",
            "#5FB89D",
            "#2B80B2"
          ]
        }
      ]
    };
  }


  generarAdultosPorSexo() {
    this.adultosPorSexo = {
      labels: ['Hombres', 'Mujeres', '        ', '        ', '        ', '        ', '        ', '        ', '        '],
      datasets: [
        {
          data: [35,65,0,0,0,0,0,0,0],

          backgroundColor: [
            "#2AA9C7",
            "#F26162",
            "#FFF",
            "#FFF",
            "#FFF",
            "#FFF",
            "#FFF",
            "#FFF",
            "#FFF"
          ],
          hoverBackgroundColor: [
            "#2AA9C7",
            "#F26162",
            "#FFF",
            "#FFF",
            "#FFF",
            "#FFF",
            "#FFF",
            "#FFF",
            "#FFF"
          ]
        }
      ]
    };
  }

}
