import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { Result } from 'src/app/interfaces/API-response.interface';

import { Genre, GenreResponse } from 'src/app/interfaces/genres.interface';
import { LoadingService } from 'src/app/services/loading.service';

import { MoviesService } from 'src/app/services/movies.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search-multi',
  templateUrl: './search-multi.component.html',
  styleUrls: ['./search-multi.component.css']
})
export class SearchMultiComponent implements OnInit, OnDestroy {

  public form!: FormGroup;

  public search: boolean = false;

  public searchInput: string = '';

  public genres: Genre[] = [];

  public trendingAll: Result[] = [];
  
  public results: Result[] = [];

  public page: number = 1;

  @HostListener('window:scroll', ['$event'])
  async onScroll(){
    const position = (document.documentElement.scrollTop || document.body.scrollTop) + 1800; 
    const max = (document.documentElement.scrollHeight || document.body.scrollHeight);

    if ( position > max && !this.search ) {
      const resp = await this.getTrendingAll(++this.page);   
    }
  }

  constructor( private searchService: SearchService,
               private moviesService: MoviesService,
               private fb: FormBuilder,
               private loadingService: LoadingService ) {}

  async ngOnInit(): Promise<void> {
    this.createInputSearch();
    try {
      const [ genres, trendingAll ] = await Promise.all([
        this.getGenres(), 
        this.getTrendingAll(this.page)
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingService.setLoading(false);
    }

  }

  ngOnDestroy(): void {
    this.loadingService.setLoading(true);
  }

 
  private createInputSearch(): void {
    this.form = this.fb.group({
      searchInput: ['', [Validators.required, Validators.minLength(3)] ]
    });
    this.subscribeToInputChanges();
  }

  private subscribeToInputChanges(): void {

    this.form.get('searchInput')?.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(async value => {
      if (value.length) {
        this.search = true;
        this.results = await this.getSearchResults(value);
        this.searchInput = value;
      } else {
        this.search = false;
      }
    });
  }
  
  private async getGenres(): Promise<void> {
    const resp = await this.moviesService.getMovieGenres();
    this.genres = resp.genres;
  }

  public onGenreSelected(results: Result[]): void {
    this.search = true;
    this.results = results;
    
  }

  private async getTrendingAll(page: number): Promise<void> {
    
    const resp = await this.moviesService.getTrendingAll(page);
    this.trendingAll.push(...resp.results);

  }
  
  private async getSearchResults( query: string ): Promise<Result[]> {
    const resp  = await this.searchService.getSearchResults( query );
    const results: Result[] = resp.results;
    return results;
  }
  

}
