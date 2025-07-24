import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Result } from 'src/app/interfaces/API-response.interface';

@Component({
  selector: 'app-poster-grid',
  templateUrl: './poster-grid.component.html',
  styleUrls: ['./poster-grid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PosterGridComponent {
  @Input() data: Result[] = [];

  constructor(private router: Router) {}

  // TrackBy function para optimizar ngFor
  trackByMovieId = (index: number, item: Result): number => {
    return item.id || index;
  };

  onRedirectToDetailPage(object: Result) {
    if (object) {
      if (object.title) {
        this.router.navigate(['/movie', object.id]);
      } else if (object.name) {
        this.router.navigate(['/serie', object.id]);
      }
    }
  }
}
