import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { UserDataService } from './services/general/user-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Arca';
  login?:any;

  constructor(private service:UserDataService) { 

  }


  ngOnInit(): void {



    const myObj = {
      name: 'darwin',
      age: 31,
    };
    
    const myObjStr = JSON.stringify(myObj);
    localStorage.setItem('LOGIN',myObjStr);


    

    
/*
    this.verificarLogin();
    if(this.login!=="1" ){
      console.log("NO LOGUEADO");
    }else{
      console.log("DENTRO"); 
    }
    this.loguear();

    if(this.login!=="1" ){
      console.log("NO LOGUEADO");
    }else{
      console.log("DENTRO"); 
    }*/


  }

  verificarLogin(){
    this.login = localStorage.getItem('LOGIN');
  }

  loguear(){
    localStorage.setItem('LOGIN',"1" );
  }

  cerrar(){

  }

  obtener(){

  }
  
}
