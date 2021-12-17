import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { GlobalDataService } from '../login/globalDataServices';

@Injectable({
    providedIn: 'root'
})

export class UtilidadesService {
    private estadoServidor:Boolean=true;
    private estadoServidor$: Subject<Boolean>;

    server: RequestInfo = GlobalDataService.getServer();

    constructor() {
        this.estadoServidor = true;
        this.estadoServidor$ = new Subject();
    }

    //CONSULTAR
    async servidorActivo() {
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

                    console.log(result.data.servidorActivo);
                    if (result.data.servidorActivo)
                    { this.estadoServidor = true; } else { this.estadoServidor =false;}
                    
                });

        } catch (e) {
            console.log("ERROR: " + e);
            this.estadoServidor =false;
        }

        this.estadoServidor$.next(this.estadoServidor);

    }

    obtenerEstadoServidor$(): Observable<Boolean> {
        return this.estadoServidor$.asObservable();
    }


}



