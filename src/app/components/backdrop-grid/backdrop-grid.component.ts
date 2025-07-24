import {
  Component,
  Input,
  ChangeDetectionStrategy,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Result } from 'src/app/interfaces/API-response.interface';
import { Episode } from 'src/app/interfaces/episode-serie-response.interface';
import { BaseImagePreloadService } from '../../services/base-image-preload.service';

@Component({
  selector: 'app-backdrop-grid',
  templateUrl: './backdrop-grid.component.html',
  styleUrls: ['./backdrop-grid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackdropGridComponent implements AfterViewInit {
  @Input() data: (Result | Episode)[] = [];

  constructor(
    private router: Router,
    private baseImagePreloadService: BaseImagePreloadService
  ) {}

  // TrackBy function para optimizar ngFor
  trackByMovieId = (index: number, item: Result | Episode): number => {
    return item.id || index;
  };

  ngAfterViewInit(): void {
    // Preload optimizado para backdrop grid (maneja Result y Episode)
    this.preloadBackdropImages();
  }

  private preloadBackdropImages(): void {
    if (this.data && this.data.length > 0) {
      // Para backdrop grid, usamos lógica personalizada ya que maneja Result y Episode
      const visibleData = this.data.slice(0, 8);
      const imageUrls = visibleData
        .map((item) => {
          if (this.isResult(item) && item.backdrop_path) {
            return `https://image.tmdb.org/t/p/w780${item.backdrop_path}`;
          } else if (this.isEpisode(item) && item.still_path) {
            return `https://image.tmdb.org/t/p/w780${item.still_path}`;
          }
          return '';
        })
        .filter((url) => url !== '');

      // Usar el servicio base para preload
      this.baseImagePreloadService[
        'imagePreloadService'
      ].preloadImagesWithLimit(imageUrls, 3);
    }
  }

  isResult(value: Result | Episode): value is Result {
    return (value as Result).backdrop_path !== undefined;
  }

  isEpisode(value: Result | Episode): value is Episode {
    return (value as Episode).still_path !== undefined;
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
