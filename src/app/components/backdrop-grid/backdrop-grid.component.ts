import { Component, Input } from '@angular/core';
import { Result } from 'src/app/interfaces/API-response.interface';


@Component({
  selector: 'app-backdrop-grid',
  templateUrl: './backdrop-grid.component.html',
  styleUrls: ['./backdrop-grid.component.css']
})
export class BackdropGridComponent {

  @Input() data: Result[] = [];


  constructor() { }

}
