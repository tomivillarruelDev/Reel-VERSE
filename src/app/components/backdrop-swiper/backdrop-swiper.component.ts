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
  selector: 'app-backdrop-swiper',
  templateUrl: './backdrop-swiper.component.html',
  styleUrls: ['./backdrop-swiper.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackdropSwiperComponent implements OnInit, AfterViewInit {
  constructor(
    private router: Router,
    private baseImagePreloadService: BaseImagePreloadService
  ) {}

  @Input() data!: Result[];
  swiper!: Swiper;

  // Función TrackBy para optimizar ngFor
  trackByMovieId = (index: number, item: Result): number => {
    return item.id || index;
  };

  ngOnInit(): void {}

  ngAfterViewInit() {
    requestAnimationFrame(() => {
      this.swiper = new Swiper('.swiper-backdrop', {
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
            slidesPerView: 1.5,
            spaceBetween: 10,
            resistanceRatio: 0.85,
          },
          440: {
            slidesPerView: 2,
            spaceBetween: 10,
            resistanceRatio: 0.85,
          },
          600: {
            slidesPerView: 3,
            spaceBetween: 10,
            resistanceRatio: 0.75,
          },
          1100: {
            slidesPerGroup: 2,
            slidesPerView: 4,
            spaceBetween: 10,
            resistanceRatio: 0.5,
          },
        },
      });

      // Preload optimizado usando configuración predefinida
      const config = BaseImagePreloadService.getPreloadConfig('backdrop');
      this.baseImagePreloadService.preloadSwiperImages(this.data, config);
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
