import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Result } from 'src/app/interfaces/API-response.interface';
import { Person, PersonResponse } from 'src/app/interfaces/person.interface';

import { LoadingService } from 'src/app/services/loading.service';

import { MoviesService } from 'src/app/services/movies.service';
import { SeriesService } from 'src/app/services/series.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('recommendedElement', {read: ElementRef}) recommendedElement!: ElementRef;

  @ViewChild('popularElement', {read: ElementRef}) popularElement!: ElementRef;

  @ViewChild('seriesElement', {read: ElementRef}) seriesElement!: ElementRef;

  @ViewChild('topElement', {read: ElementRef}) topElement!: ElementRef;

  @ViewChild('justAddedElement', {read: ElementRef}) justAddedElement!: ElementRef;

  @ViewChild('trendingElement', {read: ElementRef}) trendingElement!: ElementRef;

  @ViewChild('upComingElement', {read: ElementRef}) upComingElement!: ElementRef;

  @ViewChild('kidsElement', {read: ElementRef}) kidsElement!: ElementRef;

  @ViewChild('heroesElement', {read: ElementRef}) heroesElement!: ElementRef;

  @ViewChild('sciFiAndFantasyElement', {read: ElementRef}) sciFiAndFantasyElement!: ElementRef;

  @ViewChild('actionElement', {read: ElementRef}) actionElement!: ElementRef;

  @ViewChild('comedyElement', {read: ElementRef}) comedyElement!: ElementRef;

  @ViewChild('horrorElement', {read: ElementRef}) horrorElement!: ElementRef;

  @ViewChild('crimeElement', {read: ElementRef}) crimeElement!: ElementRef;

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

  constructor( private moviesService: MoviesService,
               private seriesService: SeriesService,
               private loadingService: LoadingService,
               private titleService: Title ) {}

  async ngOnInit(): Promise<void> {
    try{
      this.titleService.setTitle('Reel VERSE');
      const resp = await this.getPlayingNowMovies();
        // this.getRecommended('953'), 
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingService.setLoading(false);
    }
    
  }

  ngAfterViewInit(): void {
    const recommendedMoviesObserver= new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && this.recommendedMovies.length === 0){
        this.getRecommended('953');
      }
    });
    recommendedMoviesObserver.observe( this.recommendedElement.nativeElement );
    
    const popularMoviesObserver= new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && this.popularMovies.length === 0){
        this.getPopularMovies();
      }
    }, {
      rootMargin: '0px 0px',
    }
    );
    popularMoviesObserver.observe( this.popularElement.nativeElement );

    const seriesObserver= new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && this.series.length === 0){
        this.getSeries();
      }
    }, {
      rootMargin: '50px 0px'
    });
    seriesObserver.observe( this.seriesElement.nativeElement );

    const topMoviesObserver= new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && this.topMovies.length === 0){
        this.getTopRatedMovies();
      }
    }, {
      rootMargin: '50px 0px'
    });
    topMoviesObserver.observe( this.topElement.nativeElement );

    const justAddedObserver= new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && this.justAdded.length === 0){
        this.getJustAdded();
      }
    }, {
      rootMargin: '50px 0px'
    });
    justAddedObserver.observe( this.justAddedElement.nativeElement );

    const trendingAllObserver= new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && this.trendingAll.length === 0){
        this.getTrendingAll();
      }
    }, {
      rootMargin: '50px 0px'
    });
    trendingAllObserver.observe( this.trendingElement.nativeElement );
    
    const upComingMoviesObserver= new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && this.upComingMovies.length === 0){
        this.getUpComingMovies();
      }
    }, {
      rootMargin: '50px 0px'
    });
    upComingMoviesObserver.observe( this.upComingElement.nativeElement );

    const kidsSeriesObserver= new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && this.kidsSeries.length === 0){
        this.getKidsSeries();
      }
    });
    kidsSeriesObserver.observe( this.kidsElement.nativeElement );

    const heroesMoviesObserver= new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && this.heroesMovies.length === 0){
        this.getHeroesMovies();
      }
    }, {
      rootMargin: '50px 0px'
    });
    heroesMoviesObserver.observe( this.heroesElement.nativeElement );

    const sciFiAndFantasySeriesObserver= new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && this.sciFiAndFantasySeries.length === 0){
        this.getSciFiAndFantasySeries();
      }
    }, {
      rootMargin: '50px 0px'
    });
    sciFiAndFantasySeriesObserver.observe( this.sciFiAndFantasyElement.nativeElement );

    const actionMoviesObserver= new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && this.actionMovies.length === 0){
        this.getActionMovies();
      }
    }, {
      rootMargin: '50px 0px'
    });
    actionMoviesObserver.observe( this.actionElement.nativeElement );

    const comedySeriesObserver= new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && this.comedySeries.length === 0){
        this.getComedySeries();
      }
    }, {
      rootMargin: '50px 0px'
    });
    comedySeriesObserver.observe( this.comedyElement.nativeElement );

    const horrorMoviesObserver= new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && this.horrorMovies.length === 0){
        this.getHorrorMovies();
      }
    }, {
      rootMargin: '50px 0px'
    });
    horrorMoviesObserver.observe( this.horrorElement.nativeElement );

    const crimeSeries= new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && this.crimeSeries.length === 0){
        this.getCrimeSeries();
      }
    }, {
      rootMargin: '50px 0px'
    });
    crimeSeries.observe( this.crimeElement.nativeElement );
  
  }

  ngOnDestroy(): void {
    this.loadingService.setLoading(true);
  }

  private async getPlayingNowMovies(): Promise<void> {
    const resp = await this.moviesService.getPlayingNowMovies();
    this.playingNowMovies = resp.results;
  }

  private async getRecommended( id: string ): Promise<void> {
    const resp = await this.moviesService.getRecommendedMovies( id );
    this.recommendedMovies = resp.results;
  }

  private async getPopularMovies(): Promise<void> {
    const resp = await this.moviesService.getPopularMovies();
    this.popularMovies = resp.results;
  }

  private async getSeries(): Promise<void> {
    const resp = await this.seriesService.getTrendingSeries();
    this.series = resp.results;
  }

  private async getTopRatedMovies(): Promise<void> {
    const resp = await this.moviesService.getTopRatedMovies();
    this.topMovies = resp.results;
  }

  private async getJustAdded(): Promise<void> {
    const resp = await this.moviesService.getMoviesFromNYearsAgo(2);
    this.justAdded = resp.results;
  }

  private async getTrendingAll(): Promise<void> {
    const resp = await this.moviesService.getTrendingAll();
    this.trendingAll = resp.results;
  }

  private async getUpComingMovies(): Promise<void> {
    const resp = await this.moviesService.getMoviesFromNYearsAgo(1);
    this.upComingMovies = resp.results;
  }

  private async getKidsSeries(): Promise<void> {
    const resp = await this.seriesService.getSeriesByGenre(10762);
    this.kidsSeries = resp.results;
  }

  private async getHeroesMovies(): Promise<void> {
    const resp = await this.moviesService.getMoviesByGenre(16, 1);
    this.heroesMovies = resp.results;
  }

  private async getSciFiAndFantasySeries(): Promise<void> {
    const resp = await this.seriesService.getSeriesByGenre(10765);
    this.sciFiAndFantasySeries = resp.results;
  }

  private async getActionMovies(): Promise<void> {
    const resp = await this.moviesService.getMoviesByGenre(28);
    this.actionMovies = resp.results;
  }

  private async getComedySeries(): Promise<void> {
    const resp = await this.seriesService.getSeriesByGenre(35);
    this.comedySeries = resp.results;
  }

  private async getHorrorMovies(): Promise<void> {
    const resp = await this.moviesService.getMoviesByGenre(27);
    this.horrorMovies = resp.results;
  }

  private async getCrimeSeries(): Promise<void> {
    const resp = await this.seriesService.getSeriesByGenre(80, 1);
    this.crimeSeries = resp.results;
  }
  
}
