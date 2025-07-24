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
import { SeriesService } from 'src/app/services/series.service';
import { GenresCacheService } from 'src/app/services/genres-cache.service';
import { SeriesObserverHelper } from './series-observer.helper';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeriesComponent implements OnInit, OnDestroy, AfterViewInit {
  public title: string = 'Series';

  public topRatedSeries: Result[] = [];

  public genres: Genre[] = [];

  public search: boolean = false;

  public trendingSeries: Result[] = [];

  public newEpisodes: Result[] = [];

  public discoverSeries: Result[] = [];

  public actionSeries: Result[] = [];

  public latamSeries: Result[] = [];

  public familySeries: Result[] = [];

  public dramaSeries: Result[] = [];

  public sciFiAndFantasySeries: Result[] = [];

  public warAndPoliticsSeries: Result[] = [];

  public results: Result[] = [];

  @ViewChild('trendingElement', { read: ElementRef })
  trendingElement!: ElementRef;

  @ViewChild('newElement', { read: ElementRef }) newElement!: ElementRef;

  @ViewChild('discoverElement', { read: ElementRef })
  discoverElement!: ElementRef;

  @ViewChild('actionElement', { read: ElementRef }) actionElement!: ElementRef;

  @ViewChild('topElement', { read: ElementRef }) topElement!: ElementRef;

  @ViewChild('latamElement', { read: ElementRef }) latamElement!: ElementRef;

  @ViewChild('familyElement', { read: ElementRef }) familyElement!: ElementRef;

  @ViewChild('dramaElement', { read: ElementRef }) dramaElement!: ElementRef;

  @ViewChild('sciFiAndFantasYElement', { read: ElementRef })
  sciFiAndFantasYElement!: ElementRef;

  @ViewChild('warAndPoliticsElement', { read: ElementRef })
  warAndPoliticsElement!: ElementRef;

  // Array para manejar todos los observers
  private observers: IntersectionObserver[] = [];

  // Funciones TrackBy para optimizar ngFor
  trackBySeriesId = (index: number, item: Result): number => {
    return item.id || index;
  };

  trackByGenreId = (index: number, item: Genre): number => {
    return item.id || index;
  };

  constructor(
    private loadingService: LoadingService,
    private seriesService: SeriesService,
    private titleService: Title,
    private genresCacheService: GenresCacheService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    try {
      this.titleService.setTitle(this.title + ' • ReelVERSE');
      const [topRatedSeries, genres] = await Promise.all([
        this.getTopRatedSeries(),
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
        callback: () => this.getTrendingSeries(),
        condition: () => this.trendingSeries.length === 0,
        rootMargin: '0px 0px',
      },
      {
        element: this.newElement,
        callback: () => this.getNewEpisodes(),
        condition: () => this.newEpisodes.length === 0,
        rootMargin: '50px 0px',
      },
      {
        element: this.discoverElement,
        callback: () => this.getDiscoverSeries(),
        condition: () => this.discoverSeries.length === 0,
        rootMargin: '50px 0px',
      },
      {
        element: this.actionElement,
        callback: () => this.getActionSeries(),
        condition: () => this.actionSeries.length === 0,
        rootMargin: '50px 0px',
      },
      {
        element: this.latamElement,
        callback: () => this.getLatamSeries(),
        condition: () => this.latamSeries.length === 0,
        rootMargin: '50px 0px',
      },
      {
        element: this.familyElement,
        callback: () => this.getFamilySeries(),
        condition: () => this.familySeries.length === 0,
        rootMargin: '50px 0px',
      },
      {
        element: this.dramaElement,
        callback: () => this.getDramaSeries(),
        condition: () => this.dramaSeries.length === 0,
        rootMargin: '50px 0px',
      },
      {
        element: this.sciFiAndFantasYElement,
        callback: () => this.getSciFiAndFantasySeries(),
        condition: () => this.sciFiAndFantasySeries.length === 0,
        rootMargin: '50px 0px',
      },
      {
        element: this.warAndPoliticsElement,
        callback: () => this.getWarAndPoliticsSeries(),
        condition: () => this.warAndPoliticsSeries.length === 0,
        rootMargin: '50px 0px',
      },
    ];

    observerConfigs.forEach((config) => {
      const observer = SeriesObserverHelper.createObserver(
        config.callback,
        config.condition,
        config.rootMargin
      );
      SeriesObserverHelper.setupObserver(
        observer,
        config.element,
        this.observers
      );
    });
  }

  ngOnDestroy(): void {
    this.loadingService.setLoading(true);
    // Limpieza de observers usando el helper
    SeriesObserverHelper.disconnectAllObservers(this.observers);
  }

  async getTopRatedSeries(): Promise<void> {
    try {
      const resp = await this.seriesService.getTopRatedSeries();
      this.topRatedSeries = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading top rated series:', error);
    }
  }

  async getGenres(): Promise<void> {
    const resp = await this.genresCacheService.getSerieGenres();
    this.genres = resp.genres;
  }

  public onGenreSelected(results: Result[]): void {
    this.search = true;
    this.results = results;
  }

  async getTrendingSeries(): Promise<void> {
    try {
      const resp = await this.seriesService.getTrendingSeries();
      this.trendingSeries = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading trending series:', error);
    }
  }

  async getNewEpisodes(): Promise<void> {
    try {
      const resp = await this.seriesService.getSeriesFromNYearsAgo(2);
      this.newEpisodes = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading new episodes:', error);
    }
  }

  async getDiscoverSeries(): Promise<void> {
    try {
      const resp = await this.seriesService.getSeriesFromNYearsAgo(1);
      this.discoverSeries = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading discover series:', error);
    }
  }

  async getActionSeries(): Promise<void> {
    try {
      const resp = await this.seriesService.getSeriesByGenre(10759);
      this.actionSeries = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading action series:', error);
    }
  }

  async getFamilySeries(): Promise<void> {
    try {
      const resp = await this.seriesService.getSeriesByGenre(10751);
      this.familySeries = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading family series:', error);
    }
  }

  async getLatamSeries(): Promise<void> {
    try {
      const resp = await this.seriesService.getSeriesByRegion('ARG');
      this.latamSeries = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading LATAM series:', error);
    }
  }

  async getDramaSeries(): Promise<void> {
    try {
      const resp = await this.seriesService.getSeriesByGenre(18);
      this.dramaSeries = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading drama series:', error);
    }
  }

  async getSciFiAndFantasySeries(): Promise<void> {
    try {
      const resp = await this.seriesService.getSeriesByGenre(10765);
      this.sciFiAndFantasySeries = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading sci-fi and fantasy series:', error);
    }
  }

  async getWarAndPoliticsSeries(): Promise<void> {
    try {
      const resp = await this.seriesService.getSeriesByGenre(10768);
      this.warAndPoliticsSeries = resp.results;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading war and politics series:', error);
    }
  }
}
