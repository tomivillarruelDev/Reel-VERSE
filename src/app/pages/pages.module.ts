import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { MovieComponent } from './movie/movie.component';
import { ComponentsModule } from '../components/components.module';
import { SearchMultiComponent } from './search-multi/search-multi.component';
import { SeriesComponent } from './series/series.component';
import { MoviesComponent } from './movies/movies.component';



@NgModule({
  declarations: [
    HomeComponent,
    MovieComponent,
    SearchMultiComponent,
    SeriesComponent,
    MoviesComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule
  ]
})
export class PagesModule { }
