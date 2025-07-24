import { ChangeDetectorRef, Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription, debounceTime, fromEvent } from 'rxjs';

import { Result } from 'src/app/interfaces/API-response.interface';
import { Cast } from 'src/app/interfaces/cast-response.interface';
import { MovieDetailResponse } from 'src/app/interfaces/movie-detail-response.interface';

import { LoadingService } from 'src/app/services/loading.service';
import { MoviesService } from 'src/app/services/movies.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieComponent implements OnInit, OnDestroy {
  public movie: MovieDetailResponse | null = null;

  public isLargeScreen = window.innerWidth > 600;

  public recommendedMovies: Result[] = [];

  public cast: Cast[] = [];

  public producers: Cast[] = [];

  public directors: Cast[] = [];

  private resizeSubscription!: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private moviesService: MoviesService,
    private titleService: Title,
    private cdRef: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.activatedRoute.paramMap.subscribe(async (paramMap) => {
      this.loadingService.setLoading(true);

      // Reset all data when changing route
      this.movie = null as any;
      this.recommendedMovies = [];
      this.cast = [];
      this.producers = [];
      this.directors = [];

      const id = paramMap.get('id');
      if (id === null) {
        return;
      } else {
        try {
          this.checkScreenSize();
          this.resizeSubscription = fromEvent(window, 'resize')
            .pipe(debounceTime(1000))
            .subscribe(() => this.checkScreenSize());
          const [movie, recommendedMovies, cast, producer, directors] =
            await Promise.all([
              this.getMovieDetails(id),
              this.getRecommendedMovies(id),
              this.getMovieCast(id),
              this.getMovieProducers(id),
              this.getMovieDirectors(id),
            ]);
          this.movie = movie;
          this.titleService.setTitle(movie.title + ' • ReelVERSE');
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
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  private async getMovieDetails(id: string): Promise<MovieDetailResponse> {
    const resp = await Promise.all([
      this.moviesService.getMovieDetails(id),
      this.moviesService.getMovieLogo(+id),
    ]);

    if (resp[1]) {
      resp[0].logo_path = resp[1];
    }

    return resp[0];
  }

  private checkScreenSize(): void {
    this.isLargeScreen = window.innerWidth > 600;
    this.cdRef.detectChanges();
  }

  private async getRecommendedMovies(id: string): Promise<Result[]> {
    const resp = await this.moviesService.getRecommendedMovies(id);
    return resp.results;
  }

  private async getMovieCast(id: string): Promise<Cast[]> {
    const resp = await this.moviesService.getMovieCast(id);
    const cast = resp.cast.slice(0, 7);
    return cast;
  }

  private async getMovieProducers(id: string): Promise<Cast[]> {
    const resp = await this.moviesService.getMovieCast(id);
    const producers = resp.crew
      .filter((producer) => producer.known_for_department === 'Production')
      .slice(0, 2);
    return producers;
  }

  private async getMovieDirectors(id: string): Promise<Cast[]> {
    const resp = await this.moviesService.getMovieCast(id);
    const directors = resp.crew
      .filter((director) => director.known_for_department === 'Directing')
      .slice(0, 1);
    return directors;
  }
}
