import { Component, Input } from '@angular/core';
import { Result } from 'src/app/interfaces/API-response.interface';

@Component({
  selector: 'app-poster-grid',
  templateUrl: './poster-grid.component.html',
  styleUrls: ['./poster-grid.component.css']
})
export class PosterGridComponent {

  @Input() data: Result[] = [];
  
  constructor() { }

}
