import {
  AfterViewInit,
  Component,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';

import { Result } from 'src/app/interfaces/API-response.interface';
import { BaseImagePreloadService } from '../../services/base-image-preload.service';

import Swiper from 'swiper';

@Component({
  selector: 'app-text-poster-swiper',
  templateUrl: './text-poster-swiper.component.html',
  styleUrls: ['./text-poster-swiper.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextPosterSwiperComponent implements AfterViewInit {
  @Input() data!: Result[];

  @Input() topText: string = '';
  @Input() middleText: string = '';
  @Input() bottomText: string = '';

  swiper!: Swiper;

  constructor(
    private router: Router,
    private baseImagePreloadService: BaseImagePreloadService
  ) {}

  // TrackBy function para optimizar ngFor
  trackByMovieId = (index: number, item: Result): number => {
    return item.id || index;
  };

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.swiper = new Swiper('.swiper-text-poster', {
        loop: false,
        freeMode: false,
        speed: 800,
        breakpoints: {
          0: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          440: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          600: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          1100: {
            slidesPerView: 6,
            spaceBetween: 10,
          },
        },
      });

      // Preload optimizado usando configuración predefinida
      if (this.data && this.data.length > 0) {
        const config = BaseImagePreloadService.getPreloadConfig('poster');
        this.baseImagePreloadService.preloadSwiperImages(this.data, config);
      }
    }, 0);
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
