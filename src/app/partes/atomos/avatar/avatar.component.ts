import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'atomo-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: []
})
export class AvatarComponent implements OnInit {

  @Input()
  avatarComponentData!: AvatarComponentData;
  constructor() { 
    
  }

  ngOnInit(): void {
  }

}

export class AvatarComponentData {
  imagen!: any;
  imagenError!: any;
  ancho!: any;
  alto!: any;
}