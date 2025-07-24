import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Result } from 'src/app/interfaces/API-response.interface';
import { Genre } from 'src/app/interfaces/genres.interface';

import { LoadingService } from 'src/app/services/loading.service';
import { MoviesService } from 'src/app/services/movies.service';
import { GenresCacheService } from 'src/app/services/genres-cache.service';
import { MoviesObserverHelper } from './movies-observer.helper';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesComponent implements OnInit, AfterViewInit, OnDestroy {
  public title: string = 'Películas';

  public actionMovies: Result[] = [];

  public genres: Genre[] = [];

  public search: boolean = false;

  public trendingMovies: Result[] = [];

  public topRatedMovies: Result[] = [];

  public familyMovies: Result[] = [];

  public comedyMovies: Result[] = [];

  public horrorMovies: Result[] = [];

  public dramaMovies: Result[] = [];

  public results: Result[] = [];

  @ViewChild('slideshowElement', { read: ElementRef })
  slideshowElement!: ElementRef;

  @ViewChild('actionElement', { read: ElementRef }) actionElement!: ElementRef;

  @ViewChild('genresElement', { read: ElementRef }) genresElement!: ElementRef;

  @ViewChild('trendingElement', { read: ElementRef })
  trendingElement!: ElementRef;

  @ViewChild('topRatedElement', { read: ElementRef })
  topRatedElement!: ElementRef;

  @ViewChild('familyElement', { read: ElementRef }) familyElement!: ElementRef;

  @ViewChild('comedyElement', { read: ElementRef }) comedyElement!: ElementRef;

  @ViewChild('horrorElement', { read: ElementRef }) horrorElement!: ElementRef;

  @ViewChild('dramaElement', { read: ElementRef }) dramaElement!: ElementRef;

  // Array para manejar todos los observers
  private observers: IntersectionObserver[] = [];

  // Funciones TrackBy para optimizar ngFor
  trackByMovieId = (index: number, item: Result): number => {
    return item.id || index;
  };

  trackByGenreId = (index: number, item: Genre): number => {
    return item.id || index;
  };

  constructor(
    private loadingService: LoadingService,
    private moviesService: MoviesService,
    private titleService: Title,
    private genresCacheService: GenresCacheService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.titleService.setTitle(this.title + ' • ReelVERSE');
      const [actionMovies, genres] = await Promise.all([
        this.getActionMovies(),
        this.getGenres(),
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      this.loadingService.setLoading(false);
    }
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObservers();
  }

  private setupIntersectionObservers(): void {
    const observerConfigs = [
      {
        element: this.trendingElement,
        callback: () => this.getTrendingMovies(),
        condition: () => this.trendingMovies.length === 0,
        rootMargin: '50px 0px',
      },
      {
        element: this.topRatedElement,
        callback: () => this.getTopRatedMovies(),
        condition: () => this.topRatedMovies.length === 0,
        rootMargin: '50px 0px',
      },
      {
        element: this.familyElement,
        callback: () => this.getFamilyMovies(),
        condition: () => this.familyMovies.length === 0,
        rootMargin: '50px 0px',
      },
      {
        element: this.comedyElement,
        callback: () => this.getComedyMovies(),
        condition: () => this.comedyMovies.length === 0,
        rootMargin: '50px 0px',
      },
      {
        element: this.horrorElement,
        callback: () => this.getHorrorMovies(),
        condition: () => this.horrorMovies.length === 0,
        rootMargin: '50px 0px',
      },
      {
        element: this.dramaElement,
        callback: () => this.getDramaMovies(),
        condition: () => this.dramaMovies.length === 0,
        rootMargin: '50px 0px',
      },
    ];

    observerConfigs.forEach((config) => {
      const observer = MoviesObserverHelper.createObserver(
        config.callback,
        config.condition,
        config.rootMargin
      );
      MoviesObserverHelper.setupObserver(
        observer,
        config.element,
        this.observers
      );
    });
  }

  ngOnDestroy(): void {
    this.loadingService.setLoading(true);
    // Limpieza de observers usando el helper
    MoviesObserverHelper.disconnectAllObservers(this.observers);
  }

  async getActionMovies(): Promise<void> {
    try {
      const resp = await this.moviesService.getMoviesByGenre(28);
      this.actionMovies = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading action movies:', error);
    }
  }

  async getGenres(): Promise<void> {
    const resp = await this.genresCacheService.getMovieGenres();
    this.genres = resp.genres;
  }

  public onGenreSelected(results: Result[]): void {
    this.search = true;
    this.results = results;
  }

  async getTrendingMovies(): Promise<void> {
    try {
      const resp = await this.moviesService.getTrendingMovies();
      this.trendingMovies = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading trending movies:', error);
    }
  }

  async getTopRatedMovies(): Promise<void> {
    try {
      const resp = await this.moviesService.getTopRatedMovies();
      this.topRatedMovies = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading top rated movies:', error);
    }
  }

  async getFamilyMovies(): Promise<void> {
    try {
      const resp = await this.moviesService.getMoviesByGenre(10751, 4);
      this.familyMovies = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading family movies:', error);
    }
  }

  async getComedyMovies(): Promise<void> {
    try {
      const resp = await this.moviesService.getMoviesByGenre(35, 1);
      this.comedyMovies = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading comedy movies:', error);
    }
  }

  async getHorrorMovies(): Promise<void> {
    try {
      const resp = await this.moviesService.getMoviesByGenre(27);
      this.horrorMovies = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading horror movies:', error);
    }
  }

  async getDramaMovies(): Promise<void> {
    try {
      const resp = await this.moviesService.getMoviesByGenre(18, 1);
      this.dramaMovies = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading drama movies:', error);
    }
  }
}
