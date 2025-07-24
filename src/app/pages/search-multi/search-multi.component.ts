import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { debounceTime } from 'rxjs';
import { Result } from 'src/app/interfaces/API-response.interface';

import { Genre, GenreResponse } from 'src/app/interfaces/genres.interface';
import { LoadingService } from 'src/app/services/loading.service';

import { MoviesService } from 'src/app/services/movies.service';
import { SearchService } from 'src/app/services/search.service';
import { GenresCacheService } from 'src/app/services/genres-cache.service';

@Component({
  selector: 'app-search-multi',
  templateUrl: './search-multi.component.html',
  styleUrls: ['./search-multi.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchMultiComponent implements OnInit, OnDestroy {
  public form!: FormGroup;

  public showSearch: boolean = false;

  public searchInput: string = '';

  public genres: Genre[] = [];

  public trendingAll: Result[] = [];

  public loading = false;

  public results: Result[] = [];

  public page: number = 1;

  @HostListener('window:scroll', ['$event'])
  async onScroll() {
    const position =
      (document.documentElement.scrollTop || document.body.scrollTop) + 1800;
    const max =
      document.documentElement.scrollHeight || document.body.scrollHeight;

    if (position > max && !this.showSearch) {
      const resp = await this.getTrendingAll(++this.page);
    }
  }

  constructor(
    private searchService: SearchService,
    private moviesService: MoviesService,
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private titleService: Title,
    private genresCacheService: GenresCacheService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.createInputSearch();
    try {
      this.titleService.setTitle('Búsqueda • ReelVERSE');
      const [genres, trendingAll] = await Promise.all([
        this.getGenres(),
        this.getTrendingAll(this.page),
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
      searchInput: ['', [Validators.required, Validators.minLength(3)]],
    });
    this.subscribeToInputChanges();
  }

  private subscribeToInputChanges(): void {
    this.form
      .get('searchInput')
      ?.valueChanges.pipe(debounceTime(1000))
      .subscribe(async (value) => {
        if (value.length) {
          this.showSearch = true;
          this.search(value);
          this.searchInput = value;
        } else {
          this.showSearch = false;
        }
      });
  }

  private async search(value: string): Promise<void> {
    this.loading = true;
    this.results = await this.getSearchResults(value);
    this.loading = false;
  }

  private async getGenres(): Promise<void> {
    const resp = await this.genresCacheService.getMovieGenres();
    this.genres = resp.genres;
  }

  public onGenreSelected(results: Result[]): void {
    this.showSearch = true;
    this.results = results;
  }

  private async getTrendingAll(page: number): Promise<void> {
    const resp = await this.moviesService.getTrendingAll(page);
    this.trendingAll.push(...resp.results);
  }

  private async getSearchResults(query: string): Promise<Result[]> {
    const resp = await this.searchService.getSearchResults(query);
    const results: Result[] = resp.results;
    return results;
  }
}
