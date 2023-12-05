import { AfterViewInit, Component, Input } from '@angular/core';
import { Result } from 'src/app/interfaces/API-response.interface';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

@Component({
  selector: 'app-poster-swiper',
  templateUrl: './poster-swiper.component.html',
  styleUrls: ['./poster-swiper.component.css']
})
export class PosterSwiperComponent  implements AfterViewInit {

  @Input() data!: Result[];
  
  swiper!: Swiper;

  constructor() {}

  ngAfterViewInit(): void {
    setTimeout( () => {
      this.swiper = new Swiper('.swiper-poster-grid', {
        modules: [Navigation],
        loop: false,
        freeMode: true,
        navigation: {
          nextEl: '.post-swiper-next',
          prevEl: 'post-swiper-prev',
        },
        breakpoints: {
          0: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          440:{
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
          }
        }
      });
    }, 0);
  }
} 
