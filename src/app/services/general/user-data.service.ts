import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

    val:number=0;
  constructor() { }

  sumar(){
    this.val=this.val+1;
  }

  obtener(){
    return this.val;
  }
}
