import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { ComponentsModule } from '../components/components.module';
import { DirectivesModule } from '../directives/directives.module';
import { SearchMultiComponent } from './search-multi/search-multi.component';
import { SeriesComponent } from './series/series.component';
import { MoviesComponent } from './movies/movies.component';
import { SerieComponent } from './serie-detail/serie.component';
import { MovieComponent } from './movie-detail/movie.component';
import { PipesModule } from '../pipes/pipes.module';
import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  declarations: [
    HomeComponent,
    SearchMultiComponent,
    SeriesComponent,
    MoviesComponent,
    SerieComponent,
    MovieComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    ReactiveFormsModule,
    PipesModule,
    PagesRoutingModule,
  ],
})
export class PagesModule {}
