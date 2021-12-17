import { Grupo } from '../../dataModels/grupo';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { GlobalDataService } from '../login/globalDataServices';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {


  server: RequestInfo = GlobalDataService.getServer();

  //GRUPO
  private grupos: Grupo[];
  private grupos$: Subject<Grupo[]>;

  resultado: any;
  constructor() {
    this.grupos = [];
    this.grupos$ = new Subject();
  }

  //GRUPO

  //AGREGAR
  async agregarGrupo(grupo: Grupo) {
    try {

      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            crearGrupo(input:{
              tipo:"${grupo.tipo}"            
            }){
              tipo
            }
          }`,
        })
      })
        .then((res) => res.json())
        .then((result) => {

          this.consultarGrupo();
        });
    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  //CONSULTAR
  async consultarGrupo() {

    this.grupos = [];

    try {

      await fetch(this.server, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },

        body: JSON.stringify({
          query: `{
            grupo{
              _id
              tipo
              permisos{
                _id
                idPermiso
                nombre
              }
            }
                  }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
          result.data.grupo.map((tp: any) => {


            let grupo = new Grupo();
            grupo._id = tp._id;
            grupo.tipo = tp.tipo;
            grupo.color = "#fff";
            grupo.permisos = tp.permisos;
            this.grupos.push(grupo);

            this.grupos$.next(this.grupos);

          });
        });

    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  //ELIMINAR
  async eliminarGrupo(_id: any) {
    try {

      await fetch(this.server, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            eliminarGrupo(_id:"${_id}"){
              _id
              tipo
            }
          }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
          this.consultarGrupo();
        });

    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  //ACTUALIZAR
  async actualizarGrupo(_id: any, grupo: Grupo) {
    try {

      await fetch(this.server, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            actualizarGrupo(_id:"${_id}",
            input:{
              tipo:"${grupo.tipo}"
            }){
              _id
            }
          }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
          this.consultarGrupo();
        });

    } catch (e) {
      console.log("ERROR: " + e);
    }
  }


  //ACTUALIZAR
  async actualizarGrupoPermiso(_id: any, _grupo: Grupo) {
    try {


      let lista = '';
      _grupo.permisos!.forEach(element => {
        console.log("estado de permiso: "+element.estado);
        if(element.estado)
        {
        lista+= `{ 
          idPermiso:"${element.idPermiso}"
          nombre:"${element.nombre}"
        },`}
      });



      await fetch(this.server, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            actualizarGrupo(_id:"${_id}",
            input:{
              tipo:"${_grupo.tipo}"
            
              permisos:[
                ${lista}
              ]

          }){
              _id
              tipo
              permisos{
                _id
                idPermiso
                nombre
              }
              
            }
          }`


        })

  })
        .then((res) => res.json())
        .then((result) => {
          this.consultarGrupo();
  });

    } catch (e) {
  console.log("ERROR: " + e);
}
  }



obtenerGrupos$(): Observable < Grupo[] > {
  return this.grupos$.asObservable();
}

}
