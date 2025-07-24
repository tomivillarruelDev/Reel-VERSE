import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MoviesComponent } from './movies/movies.component';
import { SeriesComponent } from './series/series.component';
import { MovieComponent } from './movie-detail/movie.component';
import { SerieComponent } from './serie/serie.component';
import { SearchMultiComponent } from './search-multi/search-multi.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'movies', component: MoviesComponent },
  { path: 'series', component: SeriesComponent },
  { path: 'movie/:id', component: MovieComponent },
  { path: 'serie/:id', component: SerieComponent },
  { path: 'search', component: SearchMultiComponent },
  { path: 'search/:text', component: SearchMultiComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
