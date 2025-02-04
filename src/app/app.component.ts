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

  }
}
