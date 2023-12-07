import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Result } from 'src/app/interfaces/API-response.interface';
import { Cast } from 'src/app/interfaces/cast-response.interface';
import { Episode } from 'src/app/interfaces/episode-serie-response.interface';
import { SerieDetailResponse } from 'src/app/interfaces/serie-detail-response.interface';
import { LoadingService } from 'src/app/services/loading.service';
import { SeriesService } from 'src/app/services/series.service';

@Component({
  selector: 'app-serie',
  templateUrl: './serie.component.html',
  styleUrls: ['./serie.component.css']
})
export class SerieComponent implements OnInit, OnDestroy {

  @ViewChild('recommendedElement', {read: ElementRef})recommendedElement!: ElementRef;

  public serie!: SerieDetailResponse;

  public episodes: Episode[] = [];

  public recommendedSeries: Result[] = [];

  public cast: Cast[] = [];

  public producers: Cast[] = [];

  public directors: Cast[] = [];

  constructor( private activatedRoute: ActivatedRoute,
               private  loadingService: LoadingService,
               private seriesService: SeriesService ) { }

  async ngOnInit(): Promise<void> {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if ( id ) {
      try{
        const [ serie, episodes, recommended, cast, producer, directors] = await Promise.all([
          this.getSerieDetails( id ),
          this.getAllEpisodes( id ),
          this.getRecommendedSeries( id ),
          this.getSerieCast( id ),
          this.getSerieProducers( id ),
          this.getSerieDirectors( id )
        ]);
        this.serie = serie;
        this.episodes = episodes;

        this.recommendedSeries = recommended;
        this.cast = cast;
        this.producers = producer;
        this.directors = directors;
      } catch (error) {
        console.error(error);
      } finally {
        this.loadingService.setLoading(false);
      }
    }
  }

  ngOnDestroy(): void {
    this.loadingService.setLoading(true);
  }

  private async getSerieDetails( id: string ): Promise<SerieDetailResponse> {
    const resp = await this.seriesService.getSerieDetails( id );
    return resp;
  }

  private async getAllEpisodes( id: string ): Promise<Episode[]> {
    const resp = await this.seriesService.getAllEpisodes( id );
    console.log(resp);
    return resp.episodes;

  }

  private async getRecommendedSeries( id: string ): Promise<Result[]> {
    const resp = await this.seriesService.getRecommendedSeries( id );
    return resp.results;
  }

  private async getSerieCast( id: string ): Promise<Cast[]> {
    const resp = await this.seriesService.getSerieCast( id );
    const cast = resp.cast.slice(0 ,7);
    return cast;

  }

  private async getSerieProducers( id: string ): Promise<Cast[]> {
    const resp = await this.seriesService.getSerieCast( id );
    const producers = resp.crew.filter( producer => producer.known_for_department === 'Production' ).slice(0, 2);
    return  producers ;

  }

  private async getSerieDirectors( id: string ): Promise<Cast[]> {
    const resp = await this.seriesService.getSerieCast( id );
    const directors = resp.crew.filter( director => director.known_for_department === 'Directing'  ).slice(0, 1);
    return directors;

  }
}
