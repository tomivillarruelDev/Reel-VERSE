import { AfterViewInit, Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { Result } from 'src/app/interfaces/API-response.interface';
import { Person } from 'src/app/interfaces/person.interface';

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

  constructor(private router: Router) {}

  // TrackBy functions para optimizar ngFor
  trackByMovieId = (index: number, item: Result): number => {
    return item.id || index;
  };

  trackByPersonId = (index: number, item: Person): number => {
    return item.id || index;
  };

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.swiper = new Swiper('.swiper-large-poster', {
        loop: false,
        freeMode: false,
        speed: 800,
        breakpoints: {
          0: {
            slidesPerView: 1.5,
            spaceBetween: 10,
          },
          440: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          600: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          1100: {
            slidesPerView: 4,
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
