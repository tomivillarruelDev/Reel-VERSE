import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Result } from 'src/app/interfaces/API-response.interface';
import { Genre } from 'src/app/interfaces/genres.interface';

import { LoadingService } from 'src/app/services/loading.service';
import { SeriesService } from 'src/app/services/series.service';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.css']
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

  @ViewChild('trendingElement',{read: ElementRef})trendingElement!: ElementRef;

  @ViewChild('newElement', {read: ElementRef})newElement!: ElementRef;

  @ViewChild('discoverElement',{read: ElementRef})discoverElement!: ElementRef;

  @ViewChild('actionElement',{read: ElementRef})actionElement!: ElementRef;

  @ViewChild('topElement',{read: ElementRef})topElement!: ElementRef;

  @ViewChild('latamElement',{read: ElementRef})latamElement!: ElementRef;

  @ViewChild('familyElement',{read: ElementRef})familyElement!: ElementRef;

  @ViewChild('dramaElement',{read: ElementRef})dramaElement!: ElementRef;

  @ViewChild('sciFiAndFantasYElement',{read: ElementRef})sciFiAndFantasYElement!: ElementRef;

  @ViewChild('warAndPoliticsElement',{read: ElementRef})warAndPoliticsElement!: ElementRef;


  constructor( private loadingService: LoadingService,
               private seriesService: SeriesService,
               private titleService: Title ) {}

  async ngOnInit() {
    try{
      this.titleService.setTitle(this.title + ' • Reel VERSE');
      const [ topRatedSeries, genres ] = await Promise.all([
        this.getTopRatedSeries(),
        this.getGenres()
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      this.loadingService.setLoading(false);
    }
  }

  ngAfterViewInit(): void {

    const trendingSeriesObserver = new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && this.trendingSeries.length === 0){
        this.getTrendingSeries();
      }
    });
    trendingSeriesObserver.observe( this.trendingElement.nativeElement );

    const newEpisodesObserver = new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && this.newEpisodes.length === 0){
        this.getNewEpisodes();
      }
    }, {
      rootMargin: '50px 0px'
    });
    newEpisodesObserver.observe( this.newElement.nativeElement );

    const discoverSeriesObserver = new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && this.discoverSeries.length === 0){
        this.getDiscoverSeries();
      }
    }, {
      rootMargin: '50px 0px'
    });
    discoverSeriesObserver.observe( this.discoverElement.nativeElement );

    const actionSeriesObserver = new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && this.actionSeries.length === 0){
        this.getActionSeries();
      }
    }, {
      rootMargin: '50px 0px'
    });
    actionSeriesObserver.observe( this.actionElement.nativeElement );

    const latamSeriesObserver = new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && this.latamSeries.length === 0){
        this.getLatamSeries();
      }
    }, {
      rootMargin: '50px 0px'
    });
    latamSeriesObserver.observe( this.latamElement.nativeElement );

    const familySeriesObserver = new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && this.familySeries.length === 0){
        this.getFamilySeries();
      }
    }, {
      rootMargin: '50px 0px'
    });
    familySeriesObserver.observe( this.familyElement.nativeElement );

    const dramaSeriesObserver = new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && this.dramaSeries.length === 0){
        this.getDramaSeries();
      }
    }, {
      rootMargin: '50px 0px'
    });
    dramaSeriesObserver.observe( this.dramaElement.nativeElement );

    const sciFiAndFantasySeriesObserver = new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && this.sciFiAndFantasySeries.length === 0){
        this.getSciFiAndFantasySeries();
      }
    }, {
      rootMargin: '50px 0px'
    });
    sciFiAndFantasySeriesObserver.observe( this.sciFiAndFantasYElement.nativeElement );

    const warAndPoliticsSeriesObserver = new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && this.warAndPoliticsSeries.length === 0){
        this.getWarAndPoliticsSeries();
      }
    }, {
      rootMargin: '50px 0px'
    });
    warAndPoliticsSeriesObserver.observe( this.warAndPoliticsElement.nativeElement );
  }

  ngOnDestroy(): void {
    this.loadingService.setLoading(true);
  }

  async getTopRatedSeries(): Promise<void> {
    const resp = await this.seriesService.getTopRatedSeries();
    this.topRatedSeries = resp.results;
  }

  async getGenres(): Promise<void> {
    const resp = await this.seriesService.getSerieGenres();
    this.genres = resp.genres;
  }

  public onGenreSelected(results: Result[]): void {
    this.search = true;
    this.results = results;
  }

  async getTrendingSeries(): Promise<void> {
    const resp = await this.seriesService.getTrendingSeries();
    this.trendingSeries = resp.results;
  }

  async getNewEpisodes(): Promise<void> {
    const resp = await this.seriesService.getSeriesFromNYearsAgo(2);
    this.newEpisodes = resp.results;
  }

  async getDiscoverSeries(): Promise<void> {
    const resp = await this.seriesService.getSeriesFromNYearsAgo(1);
    this.discoverSeries = resp.results;
  }

  async getActionSeries(): Promise<void> {
    const resp = await this.seriesService.getSeriesByGenre(10759);
    this.actionSeries = resp.results;
  }

  async getFamilySeries(): Promise<void> {
    const resp = await this.seriesService.getSeriesByGenre(10751);
    this.familySeries = resp.results;
  }

  async getLatamSeries(): Promise<void> {
    const resp = await this.seriesService.getSeriesByRegion('ARG');
    this.latamSeries = resp.results;
  }

  async getDramaSeries(): Promise<void> {
    const resp = await this.seriesService.getSeriesByGenre(18);
    this.dramaSeries = resp.results;
  }

  async getSciFiAndFantasySeries(): Promise<void> {
    const resp = await this.seriesService.getSeriesByGenre(10765);
    this.sciFiAndFantasySeries = resp.results;
  }

  async getWarAndPoliticsSeries(): Promise<void> {
    const resp = await this.seriesService.getSeriesByGenre(10768);
    this.warAndPoliticsSeries = resp.results;
  }

}

