import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, debounceTime, fromEvent } from 'rxjs';
import { Result } from 'src/app/interfaces/API-response.interface';
import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';



@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.css']
})
export class SlideshowComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() data!: Result[];

  public isLargeScreen = window.innerWidth > 600;

  private resizeSubscription!: Subscription;

  private swiper!: Swiper;

  constructor( private cdRef: ChangeDetectorRef ) {}
  

  ngOnInit(): void {
    this.checkScreenSize();
    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(1000))
      .subscribe(() => this.checkScreenSize());
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.swiper = new Swiper('.swiper', {
        modules: [Navigation, Pagination, Autoplay, EffectFade],
        loop: true,
        freeMode: true,
        effect: 'fade',
        fadeEffect: { crossFade: true },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        slidesPerGroup: 5,
      });
    }, 0);
  }
  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  checkScreenSize(): void {
    this.isLargeScreen = window.innerWidth > 600;
    this.cdRef.detectChanges();
  }
  


}

