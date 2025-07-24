import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { Result } from 'src/app/interfaces/API-response.interface';
import { Genre } from 'src/app/interfaces/genres.interface';

import { MoviesService } from 'src/app/services/movies.service';
import { SeriesService } from 'src/app/services/series.service';
import { GenresCacheService } from 'src/app/services/genres-cache.service';

import Swiper from 'swiper';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.css'],
})
export class GenresComponent implements OnInit, AfterViewInit {
  @Input() genres!: Genre[];

  @Input() type!: string;

  @Output() genreSelected = new EventEmitter<Result[]>();

  public selectedGenre = 0;

  private page = 1;

  private swiper!: Swiper;

  constructor(
    private moviesService: MoviesService,
    private seriesService: SeriesService,
    private genresCacheService: GenresCacheService
  ) {}

  // TrackBy function para optimizar ngFor
  trackByGenreId = (index: number, item: Genre): number => {
    return item.id || index;
  };

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.swiper = new Swiper('.swiper-genre', {
        loop: false,
        freeMode: false,
        speed: 800,
        spaceBetween: 1,
        breakpoints: {
          320: {
            slidesPerView: 2,
          },
          480: {
            slidesPerView: 6,
          },
          640: {
            slidesPerView: 8,
          },
          768: {
            slidesPerView: 6,
          },
          1024: {
            slidesPerView: 8,
          },
          1200: {
            slidesPerView: 11,
          },
        },
      });
    }, 0);
  }

  public async searchByGenre(genre: number): Promise<void> {
    switch (this.type) {
      case 'movie':
        this.selectedGenre = genre;
        const resp = await this.moviesService.getMoviesByGenre(genre, 0);
        const results: Result[] = resp.results;
        console.log('Buscando películas por género:', results);
        this.genreSelected.emit(results);

        break;

      case 'serie':
        this.selectedGenre = genre;
        const resp2 = await this.seriesService.getSeriesByGenre(genre, 0);
        const results2: Result[] = resp2.results;
        this.genreSelected.emit(results2);
        break;

      default:
        this.selectedGenre = genre;
        const respMovies = await this.moviesService.getMoviesByGenre(genre, 0);
        const movieResults: Result[] = respMovies.results;
        const respSeries = await this.seriesService.getSeriesByGenre(genre, 0);
        const seriesResults: Result[] = respSeries.results;
        const allResults: Result[] = [...movieResults, ...seriesResults];
        this.genreSelected.emit(allResults);
        break;
    }
  }

  async getGenres(): Promise<void> {
    switch (this.type) {
      case 'movie':
        const resp = await this.genresCacheService.getMovieGenres();
        this.genres = resp.genres;
        break;

      case 'serie':
        const resp2 = await this.genresCacheService.getSerieGenres();
        this.genres = resp2.genres;
        break;

      default:
        const resp3 = await this.genresCacheService.getMovieGenres();
        const resp4 = await this.genresCacheService.getSerieGenres();
        let genres = [...resp3.genres, ...resp4.genres];
        genres.sort(() => Math.random() - 0.5);
        this.genres = genres;
    }
  }
}
