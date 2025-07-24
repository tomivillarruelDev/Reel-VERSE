import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Result } from 'src/app/interfaces/API-response.interface';
import { BaseImagePreloadService } from '../../services/base-image-preload.service';

@Component({
  selector: 'app-poster-grid',
  templateUrl: './poster-grid.component.html',
  styleUrls: ['./poster-grid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PosterGridComponent implements AfterViewInit {
  @Input() data: Result[] = [];

  constructor(
    private router: Router,
    private baseImagePreloadService: BaseImagePreloadService
  ) {}

  // TrackBy function para optimizar ngFor
  trackByMovieId = (index: number, item: Result): number => {
    return item.id || index;
  };

  ngAfterViewInit(): void {
    // Preload optimizado usando configuración predefinida
    const config = BaseImagePreloadService.getPreloadConfig('poster');
    // Customizar para grid (más imágenes visibles)
    config.visibleCount = 12;
    config.preloadCount = 6;
    this.baseImagePreloadService.preloadSwiperImages(this.data, config);
  }

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
