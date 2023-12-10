import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Result } from 'src/app/interfaces/API-response.interface';

import Swiper from 'swiper';

@Component({
  selector: 'app-square-poster-swiper',
  templateUrl: './square-poster-swiper.component.html',
  styleUrls: ['./square-poster-swiper.component.css']
})
export class SquarePosterSwiperComponent implements OnInit, AfterViewInit {

  @Input() data!: Result[];
  swiper!: Swiper;

  constructor( private router: Router ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout( () => {
      this.swiper = new Swiper('.swiper-square-poster', {
        loop: false,
        freeMode: false,
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
            spaceBetween: 10,
          }
        }
      });
    }, 0)
  }

  onRedirectToDetailPage( object: Result ){
    if ( object ) {
      if (object.title) {
        this.router.navigate([ '/movie', object.id ]);

      } else if (object.name) {
        this.router.navigate([ '/serie', object.id ]);
      }
    }
  } 

}
