import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIResponse } from '../interfaces/API-response.interface';
import { firstValueFrom } from 'rxjs';
import { GenreResponse } from '../interfaces/genres.interface';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {

  private url = 'https://api.themoviedb.org/3/';
  
  constructor( private http: HttpClient ) { }

  get params() {
    return {
      api_key: 'b8699b9eda6852f056378fab66fa911b',
      language : 'es-MX',
      include_adult: 'false',
    }
  }

  async getPopularSeries(): Promise<APIResponse> {
    const resp = await firstValueFrom( this.http.get<APIResponse>(`${ this.url }tv/popular?`,{
      params: this.params
    }));
    return resp;
  } //slider

  async getSerieGenres(): Promise<GenreResponse> {
    const resp = await firstValueFrom( this.http.get<GenreResponse>(`${ this.url }genre/tv/list?`,{
      params: this.params
    }));
    return resp;
  } //genres

  async getSeriesByGenre( genreId: number, yearsAgo: number = 0, page: number = 1 ): Promise<APIResponse> {
    let currentYear = new Date().getFullYear();
    let targetYear = currentYear - yearsAgo;
    const resp = await firstValueFrom( this.http.get<APIResponse>(`${ this.url }discover/tv?`,{
      params: {
        ...this.params,
        with_genres: genreId,
        first_air_date_year: targetYear,
        page: page
      }
    }));
    return resp;
  } 

  async getTrendingSeries(): Promise<APIResponse> {
    const resp = await firstValueFrom( this.http.get<APIResponse>(`${ this.url }trending/tv/week?`,{
      params: this.params
    }));
    return resp;
  } 

  public async getSeriesFromNYearsAgo(yearsAgo: number): Promise<APIResponse> {
    let currentYear = new Date().getFullYear();
    let targetYear = currentYear - yearsAgo;
  
    const resp = await firstValueFrom( this.http.get<APIResponse>(`${ this.url }discover/tv?`,{
      params: {
        ...this.params,
        first_air_date_year: targetYear,
        with_origin_country: 'US'
      }
    }));
    return resp;
  }

  async getTopRatedSeries(): Promise<APIResponse> {
    const resp = await firstValueFrom( this.http.get<APIResponse>(`${ this.url }tv/top_rated?`,{
      params: this.params
    }));
    return resp;
  } //top rated

  async getSeriesByRegion(region: string): Promise<APIResponse> {
    const resp = await firstValueFrom( this.http.get<APIResponse>(`${ this.url }discover/tv?`,{
      params: {
        ...this.params,
        watch_region: region
      }
    }));
    return resp;
  } //region 
  
  
}



