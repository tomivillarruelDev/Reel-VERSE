import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Result } from 'src/app/interfaces/API-response.interface';
import { Episode } from 'src/app/interfaces/episode-serie-response.interface';


@Component({
  selector: 'app-backdrop-grid',
  templateUrl: './backdrop-grid.component.html',
  styleUrls: ['./backdrop-grid.component.css']
})
export class BackdropGridComponent {

  @Input() data: (Result | Episode)[] = [];

  constructor( private router: Router ) { }

  isResult(value: Result | Episode): value is Result {
    return (value as Result).backdrop_path !== undefined;
  }
  
  isEpisode(value: Result | Episode): value is Episode {
    return (value as Episode).still_path !== undefined;
  }

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
