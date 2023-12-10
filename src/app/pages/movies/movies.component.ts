import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Result } from 'src/app/interfaces/API-response.interface';
import { Genre } from 'src/app/interfaces/genres.interface';

import { LoadingService } from 'src/app/services/loading.service';
import { MoviesService } from 'src/app/services/movies.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
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

  @ViewChild('slideshowElement', {read: ElementRef}) slideshowElement!: ElementRef;

  @ViewChild('actionElement', {read: ElementRef}) actionElement!: ElementRef;

  @ViewChild('genresElement', { read: ElementRef }) genresElement!: ElementRef;

  @ViewChild('trendingElement', {read: ElementRef}) trendingElement!: ElementRef;

  @ViewChild('topRatedElement', {read: ElementRef}) topRatedElement!: ElementRef;

  @ViewChild('familyElement',{read: ElementRef}) familyElement!: ElementRef;

  @ViewChild('comedyElement', {read: ElementRef}) comedyElement!: ElementRef;

  @ViewChild('horrorElement',{read: ElementRef}) horrorElement!: ElementRef;

  @ViewChild('dramaElement', {read: ElementRef}) dramaElement!: ElementRef;


  constructor( private loadingService: LoadingService,
               private moviesService: MoviesService,
               private titleService: Title ) {}

  async ngOnInit(): Promise<void> {
    try{
      this.titleService.setTitle(this.title + ' • Reel VERSE');
      const [ actionMovies, genres ] = await Promise.all([
        this.getActionMovies(),
        this.getGenres()
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      this.loadingService.setLoading(false);
    }
    
  }

  ngAfterViewInit(): void {

    const trendingMoviesObserver = new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && this.trendingMovies.length === 0 ){
        this.getTrendingMovies();
      }
    }, {
      rootMargin: '50px 0px'
    });
    trendingMoviesObserver.observe( this.trendingElement.nativeElement );

    const topRatedMoviesObserver = new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && this.topRatedMovies.length === 0){
        this.getTopRatedMovies();
      }
    }, {
      rootMargin: '50px 0px'
    });
    topRatedMoviesObserver.observe( this.topRatedElement.nativeElement );

    const familyMoviesObserver = new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && this.familyMovies.length === 0){
        this.getFamilyMovies();
      }
    }, {
      rootMargin: '50px 0px'
    });
    familyMoviesObserver.observe( this.familyElement.nativeElement );

    const comedyMoviesObserver = new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && this.comedyMovies.length === 0){
        this.getComedyMovies();
      }
    }, {
      rootMargin: '50px 0px'
    });
    comedyMoviesObserver.observe( this.comedyElement.nativeElement );

    const horrorMoviesObserver = new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && this.horrorMovies.length === 0){
        this.getHorrorMovies();

      }
    }, {
      rootMargin: '50px 0px'
    });
    horrorMoviesObserver.observe( this.horrorElement.nativeElement );

    const dramaMoviesObserver = new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && this.dramaMovies.length === 0){
        this.getDramaMovies();
      }
    }, {
      rootMargin: '50px 0px'
    });
    dramaMoviesObserver.observe( this.dramaElement.nativeElement );
  
    
  }

  ngOnDestroy(): void {
    this.loadingService.setLoading(true);
  }

  async getActionMovies(): Promise<void> {
    const resp = await this.moviesService.getMoviesByGenre(28);
    this.actionMovies = resp.results;
  }

  async getGenres(): Promise<void> {
    const resp = await this.moviesService.getMovieGenres();
    this.genres = resp.genres;
  } 

  public onGenreSelected(results: Result[]): void {
    this.search = true;
    this.results = results;
  }

  async getTrendingMovies(): Promise<void> {
    const resp = await this.moviesService.getTrendingMovies();
    this.trendingMovies = resp.results;
  } 

  async getTopRatedMovies(): Promise<void> {
    const resp = await this.moviesService.getTopRatedMovies();
    this.topRatedMovies = resp.results;
  }

  async getFamilyMovies(): Promise<void> {
    const resp = await this.moviesService.getMoviesByGenre(10751, 4);
    this.familyMovies = resp.results;
  }

  async getComedyMovies(): Promise<void> {
    const resp = await this.moviesService.getMoviesByGenre(35, 1);
    this.comedyMovies = resp.results;
  }

  async getHorrorMovies(): Promise<void> {
    const resp = await this.moviesService.getMoviesByGenre(27);
    this.horrorMovies = resp.results;
  }

  async getDramaMovies(): Promise<void> {
    const resp = await this.moviesService.getMoviesByGenre(18, 1);
    this.dramaMovies = resp.results;
  }

}
