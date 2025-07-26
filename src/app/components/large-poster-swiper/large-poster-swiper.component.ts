import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';

import { Result } from 'src/app/interfaces/API-response.interface';
import { Person } from 'src/app/interfaces/person.interface';
import { BaseImagePreloadService } from '../../services/base-image-preload.service';

import Swiper from 'swiper';

@Component({
  selector: 'app-large-poster-swiper',
  templateUrl: './large-poster-swiper.component.html',
  styleUrls: ['./large-poster-swiper.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LargePosterSwiperComponent implements OnInit, AfterViewInit {
  @Input() data!: Result[];
  @Input() people!: Person[];
  swiper!: Swiper;

  constructor(
    private router: Router,
    private baseImagePreloadService: BaseImagePreloadService
  ) {}

  // TrackBy functions para optimizar ngFor
  trackByMovieId = (index: number, item: Result): number => {
    return item.id || index;
  };

  trackByPersonId = (index: number, item: Person): number => {
    return item.id || index;
  };

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      this.swiper = new Swiper('.swiper-large-poster', {
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
            slidesPerView: 4,
            spaceBetween: 20,
            resistanceRatio: 0.5,
          },
        },
      });

      // Preload optimizado usando configuración predefinida
      if (this.data && this.data.length > 0) {
        const config = BaseImagePreloadService.getPreloadConfig('large-poster');
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
