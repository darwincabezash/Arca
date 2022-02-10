import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { GlobalDataService } from '../login/globalDataServices';

import firebase from 'firebase/compat/app';
import "firebase/compat/storage";
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';
import {NgxImageCompressService} from "ngx-image-compress";
import { General } from 'src/app/dataModels/staticGeneral';
import { SessionUsuario } from 'src/app/dataModels/sessionUsuario';


firebase.initializeApp(environment.firebaseConfig)

@Injectable({
    providedIn: 'root'
})

export class UtilidadesService {
    private estadoServidor: Boolean = true;
    private estadoServidor$: Subject<Boolean>;
    imagenAnteriorSubidaError: string = "";

    usuarioSesion: SessionUsuario;

    storageRef = firebase.app().storage().ref();

    server: RequestInfo = GlobalDataService.getServer();

  imgResultBeforeCompression: string = "";
  imgResultAfterCompression: string = "";

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
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query: `{
                                servidorActivo
                            }`,

                })

            })
                .then((res) => res.json())
                .then((result) => {

                    if (result.data.servidorActivo) { this.estadoServidor = true; } else { this.estadoServidor = false; }

                });

        } catch (e) {
            console.log("ERROR: " + e);
            this.estadoServidor = false;
        }

        //this.estadoServidor$.next(this.estadoServidor);
        return this.estadoServidor;
    }

    /*obtenerEstadoServidor$(): Observable<Boolean> {
        return this.estadoServidor$.asObservable();
    }*/


    async subirImagenFirebase(nombre: string, imgBase64: any): Promise<any> {
        if (this.imagenAnteriorSubidaError.length > 0) {
           await this.eliminarImagenSubidaAnterior();
        }


        
        try {
            console.log("TAMAÑO ANTERIOR: "+this.imageCompress.byteCount(imgBase64));
            
       await  this.imageCompress
          .compressFile(imgBase64, 50, 30) // 50% ratio, 50% quality
          .then(
            (compressedImage) => {
                  this.imgResultAfterCompression = compressedImage;
                  console.log("TAMAÑO nuevo: "+this.imageCompress.byteCount(compressedImage));
            }
       );
            //qvlb27vmo7
            this.imagenAnteriorSubidaError = nombre;
            let respuesta = await this.storageRef.child("arca/images/" + nombre).putString(this.imgResultAfterCompression , 'data_url');
            

            return await respuesta.ref.getDownloadURL();
        } catch (e) {
            return undefined;
        }
    }

async eliminarImagenSubidaAnterior(){
    let respuesta1 = await this.storageRef.child("arca/images/" + this.imagenAnteriorSubidaError).delete();
    console.log("ELIMINANDO A : " + this.imagenAnteriorSubidaError);
        }

    eliminarUltimaImagenSubida() {
        this.imagenAnteriorSubidaError = "";
    }


    obtenerCodIglesiaSesion() {
        this.extraerDatosSesion();
        return this.usuarioSesion.usuario?.codIglesia;

        
    }

     extraerDatosSesion(){
            let objSesionUsuario = localStorage.getItem(General.DATOS_SESION);
    
    
    if (objSesionUsuario!= null) {
      
      const sessionUsuario = JSON.parse(objSesionUsuario) as SessionUsuario;
      this.usuarioSesion = sessionUsuario;

        } 
        }

}



