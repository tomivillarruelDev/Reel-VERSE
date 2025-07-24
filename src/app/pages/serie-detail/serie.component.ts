import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription, debounceTime, fromEvent } from 'rxjs';

import { Result } from 'src/app/interfaces/API-response.interface';
import { Episode } from 'src/app/interfaces/episode-serie-response.interface';
import { SerieDetailResponse } from 'src/app/interfaces/serie-detail-response.interface';

import { LoadingService } from 'src/app/services/loading.service';
import { SeriesService } from 'src/app/services/series.service';
import { BaseImagePreloadService } from '../../services/base-image-preload.service';

@Component({
  selector: 'app-serie',
  templateUrl: './serie.component.html',
  styleUrls: ['./serie.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SerieComponent implements OnInit, OnDestroy {
  public serie: SerieDetailResponse | null = null;

  public isLargeScreen = window.innerWidth > 600;

  private resizeSubscription!: Subscription;

  public episodes: Episode[] = [];

  public recommendedSeries: Result[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private seriesService: SeriesService,
    private titleService: Title,
    private cdRef: ChangeDetectorRef,
    private baseImagePreloadService: BaseImagePreloadService
  ) {}

  async ngOnInit(): Promise<void> {
    this.activatedRoute.paramMap.subscribe(async (paramMap) => {
      this.loadingService.setLoading(true, 'serie-detail');

      // Reset all data when changing route
      this.serie = null;
      this.recommendedSeries = [];
      this.episodes = [];
      this.cdRef.detectChanges();

      const id = paramMap.get('id');
      if (id === null) {
        this.loadingService.setLoading(false, 'serie-detail');
        return;
      } else {
        try {
          this.checkScreenSize();
          this.resizeSubscription = fromEvent(window, 'resize')
            .pipe(debounceTime(1000))
            .subscribe(() => this.checkScreenSize());
          const [serie, episodes, recommendedSeries] = await Promise.all([
            this.getSerieDetails(id),
            this.getAllEpisodes(id),
            this.getRecommendedSeries(id),
          ]);
          this.serie = serie;
          this.titleService.setTitle(this.serie.name + ' • ReelVERSE');
          this.episodes = episodes;
          this.recommendedSeries = recommendedSeries;

          // Preload de imágenes recomendadas y episodios
          this.preloadSerieImages();

          this.cdRef.detectChanges();
        } catch (error) {
          console.error(error);
        } finally {
          this.loadingService.setLoading(false, 'serie-detail');
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.loadingService.setLoading(false, 'serie-detail');
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  private async getSerieDetails(id: string): Promise<SerieDetailResponse> {
    const resp = await Promise.all([
      this.seriesService.getSerieDetails(id),
      this.seriesService.getSerieLogo(+id),
    ]);

    if (resp[1]) {
      resp[0].logo_path = resp[1];
    }

    return resp[0];
  }

  private checkScreenSize(): void {
    this.isLargeScreen = window.innerWidth > 600;
    this.cdRef.detectChanges();
  }

  private async getAllEpisodes(id: string): Promise<Episode[]> {
    const resp = await this.seriesService.getAllEpisodes(id);
    return resp.episodes;
  }

  private async getRecommendedSeries(id: string): Promise<Result[]> {
    const resp = await this.seriesService.getRecommendedSeries(id);
    return resp.results;
  }

  private preloadSerieImages(): void {
    // Preload series recomendadas
    if (this.recommendedSeries && this.recommendedSeries.length > 0) {
      const config = BaseImagePreloadService.getPreloadConfig('poster');
      this.baseImagePreloadService.preloadSwiperImages(
        this.recommendedSeries,
        config
      );
    }

    // Preload episodios (usar backdrop config por still_path)
    if (this.episodes && this.episodes.length > 0) {
      const config = BaseImagePreloadService.getPreloadConfig('backdrop');
      // Convertir episodes a Result[] para usar el servicio base
      const episodeResults: any[] = this.episodes.map((ep) => ({
        ...ep,
        backdrop_path: ep.still_path,
      }));
      this.baseImagePreloadService.preloadSwiperImages(episodeResults, config);
    }
  }
}
