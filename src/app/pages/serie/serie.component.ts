import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription, debounceTime, fromEvent } from 'rxjs';

import { Result } from 'src/app/interfaces/API-response.interface';
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

  public serie!: SerieDetailResponse;

  public isLargeScreen = window.innerWidth > 600;

  private resizeSubscription!: Subscription;

  public episodes: Episode[] = [];

  public recommendedSeries: Result[] = [];

  constructor( private activatedRoute: ActivatedRoute,
               private loadingService: LoadingService,
               private seriesService: SeriesService,
               private titleService: Title,
               private cdRef: ChangeDetectorRef ) { }

  async ngOnInit(): Promise<void> {
    this.activatedRoute.paramMap.subscribe( async paramMap => {
      this.loadingService.setLoading(true);
      const id = paramMap.get('id');
      if (id === null) {
        return;
      } else {
        try {
          this.checkScreenSize();
          this.resizeSubscription = fromEvent(window, 'resize')
          .pipe(debounceTime(1000))
          .subscribe(() => this.checkScreenSize());
          const [serie, episodes, recommendedSeries] = await Promise.all([
            this.getSerieDetails( id ),
            this.getAllEpisodes( id ),
            this.getRecommendedSeries( id ),
          ]);
          this.serie = serie;
          this.titleService.setTitle(this.serie.name + ' • Reel VERSE');
          this.episodes = episodes;
          this.recommendedSeries = recommendedSeries;
        } catch (error) {
          console.error(error);
        } finally {
          this.loadingService.setLoading(false);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.loadingService.setLoading(true);
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  private async getSerieDetails( id: string ): Promise<SerieDetailResponse> {
    const resp = await this.seriesService.getSerieDetails( id );
    return resp;
  }

  private checkScreenSize(): void {
    this.isLargeScreen = window.innerWidth > 600;
    this.cdRef.detectChanges();
  }

  private async getAllEpisodes( id: string ): Promise<Episode[]> {
    const resp = await this.seriesService.getAllEpisodes( id );
    return resp.episodes;

  }

  private async getRecommendedSeries( id: string ): Promise<Result[]> {
    const resp = await this.seriesService.getRecommendedSeries( id );
    return resp.results;
  }


}
