import { Usuario } from 'src/app/dataModels/usuario';
import { GlobalDataService } from '../login/globalDataServices';
import { Injectable } from '@angular/core';
import { Observable, Subject, concatMapTo } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  server: RequestInfo = GlobalDataService.getServer();

  //USUARIO
  private usuarios: Usuario[];
  private usuarios$: Subject<Usuario[]>;

  resultado: any;
  constructor() {
    this.usuarios = [];
    this.usuarios$ = new Subject();
  }

  //GRUPO

  //AGREGAR
  async agregarUsuario(usuario: Usuario): Promise<any> {
    let _idUsuarioCreado = "";
    try {

      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
  crearUsuario(input:{
    usuario:"${usuario.usuario}"
    password:"${usuario.password}"
    _idPersona:"${usuario._idPersona}"
    codIglesia:"${usuario.codIglesia}"
  }){
    _id
  }
}`,
        })
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          _idUsuarioCreado =result.data.crearUsuario._id;
          //_idUsuarioCreado = "registro";
          //this.consultarUsuario();

        });
    } catch (e) {
      console.log("ERROR: " + e);
      _idUsuarioCreado = "";
    }
    return _idUsuarioCreado;
  }

  //CONSULTAR
  async consultarUsuario() {

    this.usuarios = [];

    try {

      await fetch(this.server, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },

        body: JSON.stringify({
          query: `{
            usuario{
              _id
              tipo
              color
            }
                  }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
          result.data.usuario.map((tp: any) => {
            let usuario = new Usuario();
            usuario._id = tp._id;
            usuario.usuario = tp.tipo;
            usuario.usuario = tp.color;
            this.usuarios.push(usuario);
          });
        });
      this.usuarios$.next(this.usuarios);

    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  //ELIMINAR
  async eliminarUsuario(_id: any) {
    try {

      await fetch(this.server, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            eliminarUsuario(_id:"${_id}"){
              _id
              tipo
            }
          }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
          this.consultarUsuario();

        });

    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  //ACTUALIZAR
  async actualizarUsuario(_id: any, usuario: Usuario) {
    try {

      await fetch(this.server, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{
            actualizarUsuario(_id:"${_id}",
            input:{
              tipo:"${usuario.usuario}"
              color:"${usuario.usuario}"
            }){
              _id
            }
          }`,

        })

      })
        .then((res) => res.json())
        .then((result) => {
          this.consultarUsuario();

        });

    } catch (e) {
      console.log("ERROR: " + e);
    }
  }

  obtenerUsuarios$(): Observable<Usuario[]> {
    return this.usuarios$.asObservable();
  }

}
