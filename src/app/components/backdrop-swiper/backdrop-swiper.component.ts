import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Result } from 'src/app/interfaces/API-response.interface';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

@Component({
  selector: 'app-backdrop-swiper',
  templateUrl: './backdrop-swiper.component.html',
  styleUrls: ['./backdrop-swiper.component.css']
})
export class BackdropSwiperComponent implements OnInit, AfterViewInit {

  constructor( private router: Router) { }

  @Input() data!: Result[];
  swiper!: Swiper;

  ngOnInit(): void {}

  ngAfterViewInit() {
    setTimeout( () => {
      this.swiper = new Swiper('.swiper-backdrop', {
        modules: [Navigation],
        loop: false,
        slidesPerView: 4,
        spaceBetween: 20,
        freeMode: true,
        navigation: {
          nextEl: '.backdrop-next',
          prevEl: 'backdrop-prev',
        },
        breakpoints: {
          0: {
            slidesPerView: 1.5,
            spaceBetween: 10,
          },
          440:{
            slidesPerView: 2,
            spaceBetween: 10,
          },
          600: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          1100: {
            slidesPerView: 4,
            spaceBetween: 10,
          }
          
        },
      });
    }, 0);
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
