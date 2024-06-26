import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Result } from 'src/app/interfaces/API-response.interface';

@Component({
  selector: 'app-poster-grid',
  templateUrl: './poster-grid.component.html',
  styleUrls: ['./poster-grid.component.css']
})
export class PosterGridComponent {

  @Input() data: Result[] = [];
  
  constructor( private router: Router ) { }

  onRedirectToDetailPage( object: Result ){
    if ( object ) {
      if (object.title) {

        this.router.navigate([ '/movie', object.id ]);

      } else if (object.name) {
        this.router.navigate([ '/serie', object.id ]);
      }
    }
  }

}
