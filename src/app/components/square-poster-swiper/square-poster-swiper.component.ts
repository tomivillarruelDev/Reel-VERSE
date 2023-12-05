import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Result } from 'src/app/interfaces/API-response.interface';
import Swiper from 'swiper';
import {  Navigation } from 'swiper/modules';

@Component({
  selector: 'app-square-poster-swiper',
  templateUrl: './square-poster-swiper.component.html',
  styleUrls: ['./square-poster-swiper.component.css']
})
export class SquarePosterSwiperComponent implements OnInit, AfterViewInit {

  @Input() data!: Result[];
  swiper!: Swiper;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout( () => {
      this.swiper = new Swiper('.swiper-square-poster', {
        modules: [Navigation],
        loop: false,
        slidesPerView: 6,
        spaceBetween: 20,
        freeMode: true,
        navigation: {
          nextEl: '.square-poster-next',
          prevEl: 'square-poster-prev',
        },
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

}
