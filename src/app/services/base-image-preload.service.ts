import { Injectable } from '@angular/core';
import { ImagePreloadService } from './image-preload.service';
import { ImageUrlService } from './image-url.service';
import { Result } from '../interfaces/API-response.interface';
import { ImageSize } from '../pipes/poster.pipe';

export interface PreloadConfig {
  visibleCount: number;
  preloadCount: number;
  concurrentLimit: number;
  delayMs: number;
  imageField: 'poster_path' | 'backdrop_path';
  size: ImageSize;
}

@Injectable({
  providedIn: 'root',
})
export class BaseImagePreloadService {
  constructor(
    protected imagePreloadService: ImagePreloadService,
    protected imageUrlService: ImageUrlService
  ) {}

  /**
   * Preload inteligente de imágenes para componentes Swiper
   */
  preloadSwiperImages(data: Result[], config: PreloadConfig): void {
    if (!data || data.length === 0) return;

    // Preload imágenes visibles inicialmente
    const visibleData = data.slice(0, config.visibleCount);
    const imageUrls = this.buildImageUrls(
      visibleData,
      config.imageField,
      config.size
    );

    this.imagePreloadService.preloadImagesWithLimit(
      imageUrls,
      config.concurrentLimit
    );

    // Preload siguientes imágenes para scroll suave
    if (data.length > config.visibleCount) {
      setTimeout(() => {
        const nextData = data.slice(
          config.visibleCount,
          config.visibleCount + config.preloadCount
        );
        const nextImageUrls = this.buildImageUrls(
          nextData,
          config.imageField,
          config.size
        );

        this.imagePreloadService.preloadImagesWithLimit(
          nextImageUrls,
          Math.ceil(config.concurrentLimit / 2)
        );
      }, config.delayMs);
    }
  }

  /**
   * Configuraciones predefinidas por tipo de componente
   */
  static getPreloadConfig(
    componentType: 'poster' | 'backdrop' | 'large-poster' | 'square-poster'
  ): PreloadConfig {
    const configs: Record<string, PreloadConfig> = {
      poster: {
        visibleCount: 6,
        preloadCount: 3,
        concurrentLimit: 3,
        delayMs: 1000,
        imageField: 'poster_path',
        size: 'w342',
      },
      backdrop: {
        visibleCount: 4,
        preloadCount: 2,
        concurrentLimit: 3,
        delayMs: 1500,
        imageField: 'backdrop_path',
        size: 'w780',
      },
      'large-poster': {
        visibleCount: 5,
        preloadCount: 3,
        concurrentLimit: 2,
        delayMs: 1200,
        imageField: 'poster_path',
        size: 'w500',
      },
      'square-poster': {
        visibleCount: 4,
        preloadCount: 2,
        concurrentLimit: 2,
        delayMs: 1000,
        imageField: 'backdrop_path',
        size: 'w780',
      },
    };

    return configs[componentType];
  }

  private buildImageUrls(
    data: Result[],
    imageField: string,
    size: ImageSize
  ): string[] {
    return data
      .filter((item) => item[imageField as keyof Result])
      .map((item) =>
        this.imageUrlService.getPosterUrl(
          item[imageField as keyof Result] as string,
          size
        )
      );
  }
}
