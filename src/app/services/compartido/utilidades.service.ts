import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { GlobalDataService } from '../../global/globalDataServices';

import firebase from 'firebase/compat/app';
import "firebase/compat/storage";
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';
import {NgxImageCompressService} from "ngx-image-compress";
import { Sesiones } from 'src/app/shared/general/staticGeneral';
import { SessionUsuario } from 'src/app/dataModels/sessionUsuario';


firebase.initializeApp(environment.firebaseConfig)

@Injectable({
  providedIn: 'root',
})
export class UtilidadesService {
  private estadoServidor: Boolean = true;
  private estadoServidor$: Subject<Boolean>;
  imagenAnteriorSubidaError: string = '';

  usuarioSesion: SessionUsuario;

  storageRef = firebase.app().storage().ref();

  server: RequestInfo = GlobalDataService.getServer();

  imgResultBeforeCompression: string = '';
  imgResultAfterCompression: string = '';

  constructor(private imageCompress: NgxImageCompressService) {
    this.estadoServidor = true;
    this.estadoServidor$ = new Subject();
    this.usuarioSesion = new SessionUsuario();
  }

  //CONSULTAR
  async servidorActivo(): Promise<any> {
    try {
      await fetch(this.server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: `{
                                servidorActivo
                            }`,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.data.servidorActivo) {
            this.estadoServidor = true;
          } else {
            this.estadoServidor = false;
          }
        });
    } catch (e) {
      console.log('ERROR: ' + e);
      this.estadoServidor = false;
    }

    //this.estadoServidor$.next(this.estadoServidor);
    return this.estadoServidor;
  }

  /*obtenerEstadoServidor$(): Observable<Boolean> {
        return this.estadoServidor$.asObservable();
    }*/

  async subirImagenFirebase(
    nombre: string,
    imgBase64: any,
    codIglesia: any,
    imagenAnterior: any
  ): Promise<any> {
    if (this.imagenAnteriorSubidaError.length > 0) {
      await this.eliminarImagenSubidaAnterior(codIglesia);
    }

    try {
      //console.log("TAMAÑO ANTERIOR: "+this.imageCompress.byteCount(imgBase64));

      await this.imageCompress
        .compressFile(imgBase64, 50, 30) // 50% ratio, 50% quality
        .then((compressedImage) => {
          this.imgResultAfterCompression = compressedImage;
          //console.log("TAMAÑO nuevo: "+this.imageCompress.byteCount(compressedImage));
        });
      //qvlb27vmo7
      this.imagenAnteriorSubidaError = nombre;

      let respuesta = await this.storageRef
        .child(
          GlobalDataService.obtenerRutaImagenFirebase() +
            codIglesia +
            '/' +
            nombre
        )
        .putString(this.imgResultAfterCompression, 'data_url');

      //this.eliminarImagenFirebase(imagenAnterior);

      return await respuesta.ref.getDownloadURL();
    } catch (e) {
      return undefined;
    }
  }

  //ESTE METODO ELIMINA UNA IMAGEN SUBIDA ANTERIORMENTE SOLO SI EL USUARIO PROBO SUBIR VARIAS VECES UNA FOTO AL MOMENTO DEL REGISTRO
  async eliminarImagenSubidaAnterior(codIglesia: any) {
    let respuesta1 = await this.storageRef
      .child(
        GlobalDataService.obtenerRutaImagenFirebase() +
          codIglesia +
          '/' +
          this.imagenAnteriorSubidaError
      )
      .delete();
    //console.log("ELIMINANDO A : " + this.imagenAnteriorSubidaError);
  }

  //ESTE METODO ELIMINA UNA FOTO SUBIDA ANTERIORMENTE PERO A PARTIR DE UNA MODIFICACION, ES DECIR EL REGISTRO YA EXISTIA
  /*eliminarImagenFirebase(imagenAnterior: any) {
    let ret;
    try {
      ret = this.storageRef.storage.refFromURL(imagenAnterior).delete();
    } catch {}
  }*/

  eliminarUltimaImagenSubida() {
    this.imagenAnteriorSubidaError = '';
  }

  obtenerCodIglesiaSesion() {
    this.extraerDatosSesion();
    return this.usuarioSesion.usuario?.codIglesia;
  }

  extraerDatosSesion() {
    let objSesionUsuario = localStorage.getItem(Sesiones.DATOS_SESION);

    if (objSesionUsuario != null) {
      const sessionUsuario = JSON.parse(objSesionUsuario) as SessionUsuario;
      this.usuarioSesion = sessionUsuario;
    }
  }

  //RETORNA LA FECHA CON ESTE FORMATO: 2021-12-05
  obtenerFechaFormatoBasico(_fechaNacimiento: any) {
    let _fecha: String = '';
    try {
      if (_fechaNacimiento !== undefined) {
        let _dia = new Date(_fechaNacimiento).toLocaleString('fr-CA', {
          day: '2-digit',
        });
        let _mes: String = new Date(_fechaNacimiento).toLocaleString('fr-CA', {
          month: '2-digit',
        });
        let _anio: String = new Date(_fechaNacimiento).toLocaleString('fr-CA', {
          year: 'numeric',
        });

        _fecha = _anio + '-' + _mes + '-' + _dia;

        return _fecha;
      } else {
        _fecha = '';
      }
    } catch {
      _fecha = '';
    }
    return _fecha;
  }

  diasNuevaPersona(_fechaRegistro:any) {
    try {

      var date1 = new Date(_fechaRegistro);
      var date2 = new Date();
      var Time = date2.getTime() - date1.getTime();
      var Days = Time / (1000 * 3600 * 24);
      return Days;
    } catch (e) { return 100;}
  }


  campoEsValido(_dato: any): boolean {
    try {
      if (_dato == undefined) { return false; }
      if (_dato == null) { return false; }
      if (_dato == '') { return false; }
      if (_dato == ' ') { return false; }
      return true;
    } catch (e) {
      return false; 
    }
  }


}



