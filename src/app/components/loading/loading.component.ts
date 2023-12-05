import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit{

  

    constructor() { }
  
    ngOnInit(): void {
      document.body.classList.add('no-scroll');
    }
  
    ngOnDestroy(): void {
      document.body.classList.remove('no-scroll');
    }

}
