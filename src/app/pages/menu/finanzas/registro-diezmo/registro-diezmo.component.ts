import { Diezmo } from './../../../../dataModels/diezmo';
import { Component, OnInit } from '@angular/core';
import { Persona } from 'src/app/dataModels/persona';
import { DiezmoService } from 'src/app/services/finanzas/diezmo/diezmo.service';
import { PersonaService } from 'src/app/services/persona/persona/persona.service';

@Component({
  selector: 'app-registro-diezmo',
  templateUrl: './registro-diezmo.component.html',
  styleUrls: []
})
export class RegistroDiezmoComponent implements OnInit {

  

  personas: Persona[] = [];
  diezmos: Diezmo[] = [];

  anioSeleccionado = 2022
  
  diezmoAñoSeleccionado: Diezmo[] = [];

  meses = ["Enero", "Febrero", "Marzo"];

  diezmosTodos: DTodos;

  constructor(private personaService: PersonaService, private diezmoService: DiezmoService) { 
    
    this.diezmosTodos= new DTodos();
  }

  ngOnInit(): void {

/*
      this.personaService.consultarPersonas();
      this.personaService.obtenerPersonas$().subscribe(personas => {
        this.personas = personas;
      });
    
    
    this.diezmoService.consultarDiezmos();
      this.diezmoService.obtenerDiezmos$().subscribe(diezmo => {
        this.diezmos = diezmo;
      });

    */

  }


  obtenerPersonaDiezmoAnioSeleccionado() {
    let _idPersona: String | undefined;
    let _persona: Persona | undefined;
    let _nombreApeliido: String | undefined;

    for (let i = 0; i < this.diezmos.length; i++){
     // _idPersona = this.personas[i]._id;
     // _persona=this.obtenerPersona(_idPersona);
      //_nombreApeliido = _persona?.datoBasicoPersona?.primerNombre + " " + _persona?.datoBasicoPersona?.primerApellido;

      /*

                _id
                estado
                dia
                mes
                anio
                fechaCreacion
                idPersona
                monto

      */


      

    }
  }


    /*let diezmoAño: DiezmosAño| undefined;
    diezmoAño = this.diezmosTodos.diezmosAño!.find(d => d.año === _año);
    if (diezmoAño) {
      this.diezmosTodos.diezmosAño! = this.diezmosTodos.diezmosAño!.filter(d => d.año !== _año);
      
    }*/

  
  modificar1(_año:Number) {
    
    let año: DAño| undefined;
    año = this.diezmosTodos.años!.find(d => d.año === _año);

    if (año) {
      
    }
  }
  
  modificar2(_diezmoAño:DAño,_mes:Number) {
  let mes: DMes| undefined;
    mes = _diezmoAño.mes!.find(d => d.mes === _mes);

 if (mes) {
      
    }
  }
  
  modificar3(_diezmoMes:DMes,_idPersona:String) {
      let persona: DPersona| undefined;
    persona = _diezmoMes.persona!.find(d => d._idPersona === _idPersona);

    if (persona) {
      
    }
  }
  
/*
  añadirAño(_año:Number):DiezmosAño {
    return new DiezmosAño;
  }
  modificarAño(dm:DiezmosMes) {
    return null
  }*/


  obtenerPersona(_id:any ) {
    return this.personas.find(persona => persona._id === _id);
  }


  obtenerDiezmoAnio() {
    return this.diezmos.find(diezmo => diezmo.anio === this.anioSeleccionado);
  }

}



export class DTodos{
  años?:DAño[]=[]
}

export class DAño{
  año?: Number
  mes?:DMes[]=[]
}

export class DMes{
  mes?: Number
  persona?: DPersona[]=[]
}

export class DPersona{
  _idPersona?: String
  _idTransaccion?: String
  monto?:Number
}