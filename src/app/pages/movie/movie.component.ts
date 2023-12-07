import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Result } from 'src/app/interfaces/API-response.interface';
import { Cast } from 'src/app/interfaces/cast-response.interface';
import { MovieDetailResponse } from 'src/app/interfaces/movie-detail-response.interface';
import { LoadingService } from 'src/app/services/loading.service';
import { MoviesService } from 'src/app/services/movies.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit, OnDestroy {

  public movie!: MovieDetailResponse;

  public recommendedMovies: Result[] = [];

  public cast: Cast[] = [];

  public producers: Cast[] = [];

  public directors: Cast[] = [];
  
  constructor( private activatedRoute: ActivatedRoute,
               private loadingService: LoadingService,
               private moviesService: MoviesService ) { }

  async ngOnInit(): Promise<void> {

    this.activatedRoute.paramMap.subscribe(async paramMap => {
      this.loadingService.setLoading(true);
      const id = paramMap.get('id');
      if (id === null) {
        return;
      } else {
        try{
          const [ movie, recommendedMovies, cast, producer, directors] = await Promise.all([
            this.getMovieDetails( id ),
            this.getRecommendedMovies( id ),
            this.getMovieCast( id ),
            this.getMovieProducers( id ),
            this.getMovieDirectors( id )
          ]);
          this.movie = movie;
          this.recommendedMovies = recommendedMovies;
          this.cast = cast;
          this.producers = producer;
          this.directors = directors;
        } catch (error) {
          console.error(error);
        } finally {
          this.loadingService.setLoading(false);
        }
      }
    });  
  }

  ngOnDestroy(): void {
    this.loadingService.setLoading(true);
  }

  private async getMovieDetails( id: string ): Promise<MovieDetailResponse> {
    const resp = await this.moviesService.getMovieDetails( id );
    return resp;
  }

  private async getRecommendedMovies( id: string ): Promise<Result[]> {
    const resp = await this.moviesService.getRecommendedMovies( id );
    return resp.results;
  }

  private async getMovieCast( id: string ): Promise<Cast[]> {
    const resp = await this.moviesService.getMovieCast( id );
    const cast = resp.cast.slice(0 ,7);
    return cast;

  }

  private async getMovieProducers( id: string ): Promise<Cast[]> {
    const resp = await this.moviesService.getMovieCast( id );
    const producers = resp.crew.filter( producer => producer.known_for_department === 'Production' ).slice(0, 2);
    return  producers ;

  }

  private async getMovieDirectors( id: string ): Promise<Cast[]> {
    const resp = await this.moviesService.getMovieCast( id );
    const directors = resp.crew.filter( director => director.known_for_department === 'Directing'  ).slice(0, 1);
    return directors;

  }

}


