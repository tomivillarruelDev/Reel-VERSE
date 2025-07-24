import { AfterViewInit, Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { Result } from 'src/app/interfaces/API-response.interface';

import Swiper from 'swiper';

@Component({
  selector: 'app-poster-swiper',
  templateUrl: './poster-swiper.component.html',
  styleUrls: ['./poster-swiper.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PosterSwiperComponent implements AfterViewInit {
  @Input() data!: Result[];

  swiper!: Swiper;

  // Función TrackBy para optimizar ngFor
  trackByMovieId = (index: number, item: Result): number => {
    return item.id || index;
  };

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.swiper = new Swiper('.swiper-poster-grid', {
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
            slidesPerView: 4,

            spaceBetween: 10,
          },
          1100: {
            slidesPerView: 6,
            spaceBetween: 20,
          },
        },
      });
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
