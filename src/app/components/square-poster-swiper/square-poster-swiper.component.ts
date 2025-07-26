import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';

import { Result } from 'src/app/interfaces/API-response.interface';
import { BaseImagePreloadService } from '../../services/base-image-preload.service';

import Swiper from 'swiper';

@Component({
  selector: 'app-square-poster-swiper',
  templateUrl: './square-poster-swiper.component.html',
  styleUrls: ['./square-poster-swiper.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SquarePosterSwiperComponent implements OnInit, AfterViewInit {
  @Input() data!: Result[];
  swiper!: Swiper;

  constructor(
    private router: Router,
    private baseImagePreloadService: BaseImagePreloadService
  ) {}

  // TrackBy function para optimizar ngFor
  trackByMovieId = (index: number, item: Result): number => {
    return item.id || index;
  };

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      this.swiper = new Swiper('.swiper-square-poster', {
        loop: false,
        freeMode: false,
        speed: 400, // Reducido para mejor responsividad
        // Optimizaciones para Android/móviles
        touchRatio: 1,
        touchAngle: 45,
        grabCursor: true,
        preventInteractionOnTransition: true,
        breakpoints: {
          0: {
            slidesPerView: 2,
            spaceBetween: 10,
            resistanceRatio: 0.85,
          },
          440: {
            slidesPerView: 3,
            spaceBetween: 10,
            resistanceRatio: 0.85,
          },
          600: {
            slidesPerView: 4,
            spaceBetween: 10,
            resistanceRatio: 0.75,
          },
          1100: {
            slidesPerView: 6,
            spaceBetween: 10,
            resistanceRatio: 0.5,
          },
        },
      });

      // Preload optimizado usando configuración predefinida
      if (this.data && this.data.length > 0) {
        const config = BaseImagePreloadService.getPreloadConfig('backdrop');
        // Ajustar para square poster (menos imágenes visibles)
        config.visibleCount = 4;
        config.preloadCount = 2;
        this.baseImagePreloadService.preloadSwiperImages(this.data, config);
      }
    });
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
