import { Injectable } from '@angular/core';
import { APIResponse } from '../interfaces/API-response.interface';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private url = 'https://api.themoviedb.org/3/';

  public loading: boolean = false;

  constructor( private http: HttpClient ) { }

  get params() {
    return {
      api_key: 'b8699b9eda6852f056378fab66fa911b',
      language : 'es-MX',
      include_adult: 'false'
    }
  }

  public async getSearchResults( query: string ): Promise<APIResponse> {
    if ( this.loading ){
      return {
        page: 0,
        results: [],
        total_pages: 0,
        total_results: 0
      };
    }
    this.loading = true;
    const resp = await firstValueFrom( this.http.get<APIResponse>(`${ this.url }search/multi?` ,{
      params: {
        ...this.params,
        query: query,
      }
    }));
    this.loading = false;
    return resp;
  }


}
