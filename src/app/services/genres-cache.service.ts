import { Injectable } from '@angular/core';
import { Genre, GenreResponse } from '../interfaces/genres.interface';
import { MoviesService } from './movies.service';
import { SeriesService } from './series.service';

@Injectable({
  providedIn: 'root',
})
export class GenresCacheService {
  // Cache para géneros completos (lista de géneros)
  private static movieGenresListCache: Genre[] | null = null;
  private static seriesGenresListCache: Genre[] | null = null;

  // Cache para géneros individuales por ID (nombre del género)
  private static movieGenresCache = new Map<number, string>();
  private static seriesGenresCache = new Map<number, string>();

  constructor(
    private moviesService: MoviesService,
    private seriesService: SeriesService
  ) {}

  /**
   * Obtiene la lista completa de géneros de películas (con caché)
   */
  async getMovieGenres(): Promise<GenreResponse> {
    if (GenresCacheService.movieGenresListCache) {
      return { genres: GenresCacheService.movieGenresListCache };
    }

    const response = await this.moviesService.getMovieGenres();
    GenresCacheService.movieGenresListCache = response.genres;

    // También llenar el caché de géneros individuales
    response.genres.forEach((genre) => {
      GenresCacheService.movieGenresCache.set(genre.id, genre.name);
    });

    return response;
  }

  /**
   * Obtiene la lista completa de géneros de series (con caché)
   */
  async getSerieGenres(): Promise<GenreResponse> {
    if (GenresCacheService.seriesGenresListCache) {
      return { genres: GenresCacheService.seriesGenresListCache };
    }

    const response = await this.seriesService.getSerieGenres();
    GenresCacheService.seriesGenresListCache = response.genres;

    // También llenar el caché de géneros individuales
    response.genres.forEach((genre) => {
      GenresCacheService.seriesGenresCache.set(genre.id, genre.name);
    });

    return response;
  }

  /**
   * Obtiene un género específico por ID (con caché optimizado)
   */
  async getMovieGenreById(genreId: number): Promise<Genre | null> {
    // Si ya está en el caché individual, devolverlo
    if (GenresCacheService.movieGenresCache.has(genreId)) {
      const name = GenresCacheService.movieGenresCache.get(genreId)!;
      return { id: genreId, name };
    }

    // Si no está, cargar toda la lista (que llenará el caché)
    const response = await this.getMovieGenres();

    // Buscar el género específico
    const genre = response.genres.find((g) => g.id === genreId);
    return genre || null;
  }

  /**
   * Obtiene un género específico de serie por ID (con caché optimizado)
   */
  async getSerieGenreById(genreId: number): Promise<Genre | null> {
    // Si ya está en el caché individual, devolverlo
    if (GenresCacheService.seriesGenresCache.has(genreId)) {
      const name = GenresCacheService.seriesGenresCache.get(genreId)!;
      return { id: genreId, name };
    }

    // Si no está, cargar toda la lista (que llenará el caché)
    const response = await this.getSerieGenres();

    // Buscar el género específico
    const genre = response.genres.find((g) => g.id === genreId);
    return genre || null;
  }

  /**
   * Obtiene múltiples géneros por IDs de forma eficiente
   */
  async getGenresByIds(
    genreIds: number[],
    mediaType: 'movie' | 'tv'
  ): Promise<Map<number, string>> {
    const genreCache =
      mediaType === 'movie'
        ? GenresCacheService.movieGenresCache
        : GenresCacheService.seriesGenresCache;

    // Separar los géneros que ya están en caché de los que necesitan ser consultados
    const uncachedGenreIds = genreIds.filter(
      (genreId) => !genreCache.has(genreId)
    );

    // Si hay géneros no cacheados, cargar la lista completa
    if (uncachedGenreIds.length > 0) {
      if (mediaType === 'movie') {
        await this.getMovieGenres();
      } else {
        await this.getSerieGenres();
      }
    }

    // Crear el mapa de resultado
    const result = new Map<number, string>();
    genreIds.forEach((genreId) => {
      if (genreCache.has(genreId)) {
        result.set(genreId, genreCache.get(genreId)!);
      }
    });

    return result;
  }

  /**
   * Limpia todo el caché
   */
  static clearCache(): void {
    GenresCacheService.movieGenresListCache = null;
    GenresCacheService.seriesGenresListCache = null;
    GenresCacheService.movieGenresCache.clear();
    GenresCacheService.seriesGenresCache.clear();
  }

  /**
   * Obtiene información del estado del caché
   */
  static getCacheInfo(): {
    moviesList: boolean;
    seriesList: boolean;
    moviesIndividual: number;
    seriesIndividual: number;
  } {
    return {
      moviesList: GenresCacheService.movieGenresListCache !== null,
      seriesList: GenresCacheService.seriesGenresListCache !== null,
      moviesIndividual: GenresCacheService.movieGenresCache.size,
      seriesIndividual: GenresCacheService.seriesGenresCache.size,
    };
  }
}
