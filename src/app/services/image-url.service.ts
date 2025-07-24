import { Injectable } from '@angular/core';
import { ImageSize } from '../pipes/poster.pipe';

@Injectable({
  providedIn: 'root',
})
export class ImageUrlService {
  private supportsWebP: boolean | null = null;

  constructor() {
    this.checkWebPSupport();
  }

  /**
   * Construye URL optimizada para imágenes
   */
  getPosterUrl(poster: string, size: ImageSize = 'w500'): string {
    if (!poster) {
      return 'assets/no-image.png';
    }

    const optimizedSize = this.getOptimizedSize(size);
    const baseUrl = 'https://image.tmdb.org/t/p';

    if (this.supportsWebP) {
      return `${baseUrl}/${optimizedSize}${poster}`;
    }

    return `${baseUrl}/${optimizedSize}${poster}`;
  }

  /**
   * Preload múltiples URLs de imagen
   */
  buildImageUrls(posters: string[], size: ImageSize = 'w342'): string[] {
    return posters
      .filter((poster) => poster)
      .map((poster) => this.getPosterUrl(poster, size));
  }

  private async checkWebPSupport(): Promise<void> {
    if (this.supportsWebP !== null) return;

    try {
      const webP =
        'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
      const img = new Image();

      const result = await new Promise<boolean>((resolve) => {
        img.onload = img.onerror = () => resolve(img.height === 2);
        img.src = webP;
      });

      this.supportsWebP = result;
    } catch {
      this.supportsWebP = false;
    }
  }

  private getOptimizedSize(requestedSize: ImageSize): ImageSize {
    const sizeMap: Record<ImageSize, ImageSize> = {
      w92: 'w154',
      w154: 'w185',
      w185: 'w342',
      w342: 'w500',
      w500: 'w780',
      w780: 'original',
      original: 'original',
    };

    return sizeMap[requestedSize] || requestedSize;
  }
}
