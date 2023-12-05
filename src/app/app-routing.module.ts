import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MovieComponent } from './pages/movie/movie.component';
import { SearchMultiComponent } from './pages/search-multi/search-multi.component';
import { SeriesComponent } from './pages/series/series.component';
import { MoviesComponent } from './pages/movies/movies.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'movies',
    component: MoviesComponent
  },
  {
    path: 'movie/:id',
    component: MovieComponent
  },
  
  {
    path: 'series',
    component: SeriesComponent
  },
  {
    path: 'search',
    component: SearchMultiComponent
  },
  {
    path: 'search/:text',
    component: SearchMultiComponent
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
