import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


import { PipesModule } from '../pipes/pipes.module';
import { NavbarComponent } from './navbar/navbar.component';
import { SlideshowComponent } from './slideshow/slideshow.component';
import { PosterGridComponent } from './poster-grid/poster-grid.component';
import { BackdropSwiperComponent } from './backdrop-swiper/backdrop-swiper.component';
import { LargePosterSwiperComponent } from './large-poster-swiper/large-poster-swiper.component';
import { SquarePosterSwiperComponent } from './square-poster-swiper/square-poster-swiper.component';
import { TextPosterSwiperComponent } from './text-poster-swiper/text-poster-swiper.component';
import { FooterComponent } from './footer/footer.component';
import { PosterSwiperComponent } from './poster-swiper/poster-swiper.component';
import { GenresComponent } from './genres/genres.component';
import { BackdropGridComponent } from './backdrop-grid/backdrop-grid.component';
import { LoadingComponent } from './loading/loading.component';


@NgModule({
  declarations: [
    NavbarComponent,
    SlideshowComponent,
    PosterGridComponent,
    BackdropSwiperComponent,
    LargePosterSwiperComponent,
    SquarePosterSwiperComponent,
    TextPosterSwiperComponent,
    FooterComponent,
    PosterSwiperComponent,
    GenresComponent,
    BackdropGridComponent,
    LoadingComponent,
  ],
  exports: [
    NavbarComponent,
    SlideshowComponent,
    PosterGridComponent,
    PosterSwiperComponent,
    BackdropSwiperComponent,
    LargePosterSwiperComponent,
    SquarePosterSwiperComponent,
    TextPosterSwiperComponent,
    FooterComponent,
    GenresComponent,
    BackdropGridComponent,
    LoadingComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    PipesModule
  ]
})
export class ComponentsModule { }
