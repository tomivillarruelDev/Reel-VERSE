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
import { Person } from 'src/app/interfaces/person.interface';

import { LoadingService } from 'src/app/services/loading.service';

import { MoviesService } from 'src/app/services/movies.service';
import { SeriesService } from 'src/app/services/series.service';
import { HomeObserverHelper } from './home-observer.helper';
import { trackByMovieId } from 'src/app/pipes/track-by.pipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('recommendedElement', { read: ElementRef })
  recommendedElement!: ElementRef;

  @ViewChild('popularElement', { read: ElementRef })
  popularElement!: ElementRef;

  @ViewChild('seriesElement', { read: ElementRef }) seriesElement!: ElementRef;

  @ViewChild('topElement', { read: ElementRef }) topElement!: ElementRef;

  @ViewChild('justAddedElement', { read: ElementRef })
  justAddedElement!: ElementRef;

  @ViewChild('trendingElement', { read: ElementRef })
  trendingElement!: ElementRef;

  @ViewChild('upComingElement', { read: ElementRef })
  upComingElement!: ElementRef;

  @ViewChild('kidsElement', { read: ElementRef }) kidsElement!: ElementRef;

  @ViewChild('heroesElement', { read: ElementRef }) heroesElement!: ElementRef;

  @ViewChild('sciFiAndFantasyElement', { read: ElementRef })
  sciFiAndFantasyElement!: ElementRef;

  @ViewChild('actionElement', { read: ElementRef }) actionElement!: ElementRef;

  @ViewChild('comedyElement', { read: ElementRef }) comedyElement!: ElementRef;

  @ViewChild('horrorElement', { read: ElementRef }) horrorElement!: ElementRef;

  @ViewChild('crimeElement', { read: ElementRef }) crimeElement!: ElementRef;

  // Array para manejar todos los observers
  private observers: IntersectionObserver[] = [];

  public playingNowMovies: Result[] = [];

  public recommendedMovies: Result[] = [];

  public popularMovies: Result[] = [];

  public series: Result[] = [];

  public topMovies: Result[] = [];

  public justAdded: Result[] = [];

  public trendingAll: Result[] = [];

  public upComingMovies: Result[] = [];

  public kidsSeries: Result[] = [];

  public heroesMovies: Result[] = [];

  public sciFiAndFantasySeries: Result[] = [];

  public actionMovies: Result[] = [];

  public comedySeries: Result[] = [];

  public horrorMovies: Result[] = [];

  public crimeSeries: Result[] = [];

  public people: Person[] = [];

  // Funciones TrackBy para optimizar ngFor
  trackByMovieId = (index: number, item: Result): number => {
    return item.id || index;
  };

  trackByPersonId = (index: number, item: Person): number => {
    return item.id || index;
  };

  constructor(
    private moviesService: MoviesService,
    private seriesService: SeriesService,
    private loadingService: LoadingService,
    private titleService: Title,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.loadingService.setLoading(true, 'home');
    try {
      this.titleService.setTitle('ReelVERSE');
      await this.getPlayingNowMovies();
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingService.setLoading(false, 'home');
    }
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObservers();
  }

  private setupIntersectionObservers(): void {
    // Configuración de observers para todas las secciones
    const observerConfigs = [
      {
        element: this.recommendedElement,
        callback: () => {
          const movieId = this.getRotatingMovieId();
          this.getRecommended(movieId);
        },
        condition: () => this.recommendedMovies.length === 0,
        rootMargin: '0px 0px',
      },
      {
        element: this.popularElement,
        callback: () => this.getPopularMovies(),
        condition: () => this.popularMovies.length === 0,
        rootMargin: '0px 0px',
      },
      {
        element: this.seriesElement,
        callback: () => this.getSeries(),
        condition: () => this.series.length === 0,
        rootMargin: '50px 0px',
      },
      {
        element: this.justAddedElement,
        callback: () => this.getJustAdded(),
        condition: () => this.justAdded.length === 0,
        rootMargin: '50px 0px',
      },
      {
        element: this.trendingElement,
        callback: () => this.getTrendingAll(),
        condition: () => this.trendingAll.length === 0,
        rootMargin: '50px 0px',
      },
      {
        element: this.upComingElement,
        callback: () => this.getUpComingMovies(),
        condition: () => this.upComingMovies.length === 0,
        rootMargin: '50px 0px',
      },
      {
        element: this.kidsElement,
        callback: () => this.getKidsSeries(),
        condition: () => this.kidsSeries.length === 0,
        rootMargin: '50px 0px',
      },
      {
        element: this.heroesElement,
        callback: () => this.getHeroesMovies(),
        condition: () => this.heroesMovies.length === 0,
        rootMargin: '50px 0px',
      },
      {
        element: this.sciFiAndFantasyElement,
        callback: () => this.getSciFiAndFantasySeries(),
        condition: () => this.sciFiAndFantasySeries.length === 0,
        rootMargin: '50px 0px',
      },
      {
        element: this.actionElement,
        callback: () => this.getActionMovies(),
        condition: () => this.actionMovies.length === 0,
        rootMargin: '50px 0px',
      },
      {
        element: this.comedyElement,
        callback: () => this.getComedySeries(),
        condition: () => this.comedySeries.length === 0,
        rootMargin: '50px 0px',
      },
      {
        element: this.horrorElement,
        callback: () => this.getHorrorMovies(),
        condition: () => this.horrorMovies.length === 0,
        rootMargin: '50px 0px',
      },
      {
        element: this.crimeElement,
        callback: () => this.getCrimeSeries(),
        condition: () => this.crimeSeries.length === 0,
        rootMargin: '50px 0px',
      },
    ];

    observerConfigs.forEach((config) => {
      try {
        if (config.element && config.element.nativeElement) {
          const observer = HomeObserverHelper.createObserver(
            config.callback,
            config.condition,
            config.rootMargin
          );
          HomeObserverHelper.setupObserver(
            observer,
            config.element,
            this.observers
          );
        } else {
          console.warn('Element not found for observer setup:', config);
        }
      } catch (error) {
        console.error('Error setting up observer:', error, config);
      }
    });
  }

  ngOnDestroy(): void {
    // Limpiar el loading específico de home
    this.loadingService.setLoading(false, 'home');
    // Limpieza de observers para evitar memory leaks
    this.observers.forEach((observer) => {
      observer.disconnect();
    });
    this.observers = [];
  }

  private async getPlayingNowMovies(): Promise<void> {
    try {
      const resp = await this.moviesService.getPlayingNowMovies();
      this.playingNowMovies = resp.results;
      this.cdr.markForCheck(); // Marca para verificación de cambios
    } catch (error) {
      console.error('Error loading playing now movies:', error);
    }
  }

  private async getRecommended(id: string): Promise<void> {
    try {
      const resp = await this.moviesService.getRecommendedMovies(id);
      this.recommendedMovies = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading recommended movies:', error);
    }
  }

  private async getPopularMovies(): Promise<void> {
    try {
      const resp = await this.moviesService.getPopularMovies();
      this.popularMovies = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading popular movies:', error);
    }
  }

  private async getSeries(): Promise<void> {
    try {
      const resp = await this.seriesService.getTrendingSeries();
      this.series = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading series:', error);
    }
  }

  private async getTopRatedMovies(): Promise<void> {
    try {
      const resp = await this.moviesService.getTopRatedMovies();
      this.topMovies = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading top rated movies:', error);
    }
  }

  private async getJustAdded(): Promise<void> {
    try {
      const resp = await this.moviesService.getMoviesFromNYearsAgo(2);
      this.justAdded = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading just added movies:', error);
    }
  }

  private async getTrendingAll(): Promise<void> {
    try {
      const resp = await this.moviesService.getTrendingAll();
      this.trendingAll = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading trending all:', error);
    }
  }

  private async getUpComingMovies(): Promise<void> {
    try {
      const resp = await this.moviesService.getMoviesFromNYearsAgo(1);
      this.upComingMovies = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading upcoming movies:', error);
    }
  }

  private async getKidsSeries(): Promise<void> {
    try {
      const resp = await this.seriesService.getSeriesByGenre(10762);
      this.kidsSeries = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading kids series:', error);
    }
  }

  private async getHeroesMovies(): Promise<void> {
    try {
      const resp = await this.moviesService.getMoviesByGenre(16, 1);
      this.heroesMovies = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading heroes movies:', error);
    }
  }

  private async getSciFiAndFantasySeries(): Promise<void> {
    try {
      const resp = await this.seriesService.getSeriesByGenre(10765);
      this.sciFiAndFantasySeries = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading sci-fi and fantasy series:', error);
    }
  }

  private async getActionMovies(): Promise<void> {
    try {
      const resp = await this.moviesService.getMoviesByGenre(28);
      this.actionMovies = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading action movies:', error);
    }
  }

  private async getComedySeries(): Promise<void> {
    try {
      const resp = await this.seriesService.getSeriesByGenre(35);
      this.comedySeries = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading comedy series:', error);
    }
  }

  private async getHorrorMovies(): Promise<void> {
    try {
      const resp = await this.moviesService.getMoviesByGenre(27);
      this.horrorMovies = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading horror movies:', error);
    }
  }

  private async getCrimeSeries(): Promise<void> {
    try {
      const resp = await this.seriesService.getSeriesByGenre(80, 1);
      this.crimeSeries = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading crime series:', error);
    }
  }

  private getRotatingMovieId(): string {
    // Lista de IDs de películas populares para rotar
    const movieIds = [
      '1061474',
      '1087192',
      '575265',
      '1234821',
      '950387',
      '1232546',
      '496243',
    ];

    // Calcula el índice basado en intervalos de 2 meses
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-11

    // Calcula el número total de períodos de 2 meses desde una fecha base
    const baseYear = 2025; // Año base para calcular
    const totalMonths = (year - baseYear) * 12 + month;
    const intervalIndex = Math.floor(totalMonths / 2);
    const rotationIndex = intervalIndex % movieIds.length;

    return movieIds[rotationIndex];
  }
}
