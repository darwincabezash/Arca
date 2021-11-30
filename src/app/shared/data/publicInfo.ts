import { Persona } from "src/app/dataModels/persona";

export class PublicInfo{
    private static totalPersonas:number=0;
     static personas: Persona[]=[];


    static actualizarTotalPersonas(total: number){
        this.totalPersonas=total;
    }

    static obtenerTotalPersonas(){
        return this.totalPersonas;
    }
}
