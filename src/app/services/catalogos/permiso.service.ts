import { Permiso } from '../../dataModels/permiso';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { GlobalDataService } from '../login/globalDataServices';

@Injectable({
  providedIn: 'root'
})
export class PermisoService {

  server:RequestInfo=GlobalDataService.getServer();



  //PERMISO
  private permisos: Permiso[];
  private permisos$: Subject<Permiso[]>;

  resultado: any;
  constructor() {
    this.permisos = [];
    this.permisos$ = new Subject();
  }

  //PERMISO


  //CONSULTAR
  async consultarPermiso() {

    this.permisos = [];

    try {

      await fetch(this.server, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },

        body: JSON.stringify({
          query: `{
            permiso{
              _id
              nombre
              estado
            }
                  }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
          result.data.permiso.map((pe: any) => {
            let permiso = new Permiso();
            permiso._id = pe._id;
            permiso.nombre = pe.nombre;
            permiso.estado=pe.estado;
            this.permisos.push(permiso);
          });
          this.permisos$.next(this.permisos);

        });
    } catch (e) {
      console.log("ERROR: " + e);
    }
  }
  obtenerPermisos$(): Observable<Permiso[]> {
    return this.permisos$.asObservable();
  }








}
