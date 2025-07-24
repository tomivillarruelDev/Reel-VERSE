import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Person, PersonResponse } from '../interfaces/person.interface';
import { Genre, GenreResponse } from '../interfaces/genres.interface';
import { APIResponse } from '../interfaces/API-response.interface';
import { MovieDetailResponse } from '../interfaces/movie-detail-response.interface';
import { CastResponse } from '../interfaces/cast-response.interface';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private url = 'https://api.themoviedb.org/3/';

  public loading: boolean = false;

  constructor(private http: HttpClient, private cacheService: CacheService) {}

  get params() {
    return {
      api_key: 'b8699b9eda6852f056378fab66fa911b',
      language: 'es-MX',
      include_adult: 'false',
    };
  }

  public async getPlayingNowMovies(): Promise<APIResponse> {
    const cacheKey = 'playing-now-movies';

    // Verificar caché primero
    const cachedData = this.cacheService.get<APIResponse>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const resp = await firstValueFrom(
      this.http.get<APIResponse>(`${this.url}movie/now_playing?`, {
        params: this.params,
      })
    );

    // Guardar en caché por 10 minutos
    this.cacheService.set(cacheKey, resp, 10 * 60 * 1000);
    return resp;
  }

  public async getRecommendedMovies(id: string): Promise<APIResponse> {
    const cacheKey = `recommended-movies-${id}`;

    const cachedData = this.cacheService.get<APIResponse>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const resp = await firstValueFrom(
      this.http.get<APIResponse>(`${this.url}movie/${id}/recommendations?`, {
        params: this.params,
      })
    );

    // Caché más largo para recomendaciones
    this.cacheService.set(cacheKey, resp, 30 * 60 * 1000);
    return resp;
  }

  public async getPopularMovies(): Promise<APIResponse> {
    const cacheKey = 'popular-movies';

    const cachedData = this.cacheService.get<APIResponse>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const resp = await firstValueFrom(
      this.http.get<APIResponse>(`${this.url}movie/popular?`, {
        params: this.params,
      })
    );

    this.cacheService.set(cacheKey, resp, 15 * 60 * 1000);
    return resp;
  }

  public async getTopRatedMovies(): Promise<APIResponse> {
    const resp = await firstValueFrom(
      this.http.get<APIResponse>(`${this.url}movie/top_rated?`, {
        params: this.params,
      })
    );
    return resp;
  }

  public async getTrendingAll(page: number = 1): Promise<APIResponse> {
    if (this.loading) {
      return {
        page: 0,
        results: [],
        total_pages: 0,
        total_results: 0,
      };
    }
    this.loading = true;
    const resp = await firstValueFrom(
      this.http.get<APIResponse>(`${this.url}trending/all/week?`, {
        params: {
          ...this.params,
          page: page,
        },
      })
    );
    this.loading = false;
    return resp;
  }

  public async getTrendingMovies(): Promise<APIResponse> {
    const resp = await firstValueFrom(
      this.http.get<APIResponse>(`${this.url}trending/movie/week?`, {
        params: this.params,
      })
    );
    return resp;
  }

  public async getMoviesFromNYearsAgo(yearsAgo: number): Promise<APIResponse> {
    let currentYear = new Date().getFullYear();
    let targetYear = currentYear - yearsAgo;

    const resp = await firstValueFrom(
      this.http.get<APIResponse>(`${this.url}discover/movie?`, {
        params: {
          ...this.params,
          primary_release_year: targetYear,
        },
      })
    );
    return resp;
  }

  public async getMovieGenres(): Promise<GenreResponse> {
    const resp = await firstValueFrom(
      this.http.get<GenreResponse>(`${this.url}genre/movie/list`, {
        params: this.params,
      })
    );
    return resp;
  }

  public async getMovieGenresById(genreId: number): Promise<Genre | null> {
    const genres = await this.getMovieGenres();
    const genre = genres.genres.find((g) => g.id === genreId);

    return genre || null;
  }

  public async getMoviesByGenre(
    genreId: number,
    yearsAgo: number = 0,
    page: number = 1
  ): Promise<APIResponse> {
    let currentYear = new Date().getFullYear();
    let targetYear = currentYear - yearsAgo;
    const resp = await firstValueFrom(
      this.http.get<APIResponse>(`${this.url}discover/movie?`, {
        params: {
          ...this.params,
          with_genres: genreId,
          primary_release_year: targetYear,
          page: page,
        },
      })
    );
    return resp;
  }

  public async getMovieDetails(id: string): Promise<MovieDetailResponse> {
    const resp = await firstValueFrom(
      this.http.get<MovieDetailResponse>(`${this.url}movie/${id}?`, {
        params: this.params,
      })
    );
    return resp;
  }

  public async getSimilarMovies(id: string): Promise<APIResponse> {
    const resp = await firstValueFrom(
      this.http.get<APIResponse>(`${this.url}movie/${id}/similar?`, {
        params: this.params,
      })
    );
    return resp;
  }

  public async getMovieCast(id: string): Promise<CastResponse> {
    const resp = await firstValueFrom(
      this.http.get<CastResponse>(`${this.url}movie/${id}/credits?`, {
        params: this.params,
      })
    );
    return resp;
  }

  public async getMovieLogo(movieId: number): Promise<string | null> {
    try {
      const resp = await firstValueFrom(
        this.http.get<any>(`${this.url}movie/${movieId}/images`, {
          params: { ...this.params, language: 'es' },
        })
      );

      // Busca en orden de prioridad: español, sin idioma, inglés
      let logo = resp.logos.find((l: any) => l.iso_639_1 === 'es'); // Español primero

      if (!logo) {
        logo = resp.logos.find((l: any) => l.iso_639_1 === null); // Sin idioma (símbolos)
      }

      if (!logo) {
        logo = resp.logos.find((l: any) => l.iso_639_1 === 'en'); // Inglés como último recurso
      }

      return logo?.file_path ?? null;
    } catch (err) {
      console.error(`Error al obtener logo de movie ID ${movieId}:`, err);
      return null;
    }
  }
}
