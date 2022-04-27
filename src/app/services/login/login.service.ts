import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Usuario } from 'src/app/dataModels/usuario';
import { GlobalDataService } from '../../global/globalDataServices';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  server: RequestInfo = GlobalDataService.getServer();
  private usuarios: Usuario[];

  private usuario: Usuario[] = [];;
  private usuarios$: Subject<Usuario[]>;


  constructor() {
    this.usuarios = [];
    this.usuarios$ = new Subject();
  }

  j:number = 0;

  //CONSULTAR
  async consultarUsuario(usuario: String, password: String) {
    this.usuarios$= new Subject();
    this.usuarios = [];
    this.j++;
    try {
      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `query{
              usuario(input:{
                usuario:"${usuario}"
                password:"${password}"
              }){
                _id
                usuario
                password
                _idPersona
                codIglesia
              }
            }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
          if (result.data.usuario.length > 0) {
            let usuario = new Usuario;
            usuario._id = result.data.usuario[0]._id;
            usuario.usuario = result.data.usuario[0].usuario;
            usuario.password = result.data.usuario[0].password;
            usuario._idPersona = result.data.usuario[0]._idPersona;
            usuario.codIglesia=result.data.usuario[0].codIglesia;
            this.usuarios.push(usuario);

          } else {

          }

        });
      this.usuarios$.next(this.usuarios);


    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.usuarios$.asObservable();
  }

}



