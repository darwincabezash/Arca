import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Query } from '@angular/core';
declare var tableUtil: any;
import { Renderer2, Inject } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: []
})
export class TestComponent implements OnInit {
  constructor(
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private _document:Document
  ) { }

  ngOnInit(): void {
    new tableUtil();

   
}
}