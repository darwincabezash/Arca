import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class HeaderComponent implements OnInit {

  constructor(private router :Router) { }


  cerrarSesion(){
    localStorage.setItem('usuario','');
    this.router.navigate(["/login"]);


  }

  ngOnInit(): void {
  }

}
