import { AfterViewInit, Component, Input } from '@angular/core';
import { Result } from 'src/app/interfaces/API-response.interface';
import Swiper from 'swiper';

@Component({
  selector: 'app-text-poster-swiper',
  templateUrl: './text-poster-swiper.component.html',
  styleUrls: ['./text-poster-swiper.component.css']
})
export class TextPosterSwiperComponent implements AfterViewInit {

  @Input() data!: Result[];
  
  @Input() topText: string = '';
  @Input() middleText: string = '';
  @Input() bottomText: string = '';
  
  swiper!: Swiper;

  constructor() {}

  ngAfterViewInit(): void {
    setTimeout( () => {
      this.swiper = new Swiper('.swiper-text-poster', {
        loop: false,
        slidesPerView: 6,
        freeMode: true,
        spaceBetween: 10,
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
          }
          
        },
      });
    },0)
  }

}
