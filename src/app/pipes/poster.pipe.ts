import { Pipe, PipeTransform, Injectable } from '@angular/core';

export type ImageSize =
  | 'w92'
  | 'w154'
  | 'w185'
  | 'w342'
  | 'w500'
  | 'w780'
  | 'original';

@Injectable({
  providedIn: 'root',
})
@Pipe({
  name: 'poster',
})
export class PosterPipe implements PipeTransform {
  private supportsWebP: boolean | null = null;

  constructor() {
    this.checkWebPSupport();
  }

  transform(poster: string, size: ImageSize = 'w500'): string {
    if (poster) {
      const baseUrl = 'https://image.tmdb.org/t/p/';

      // Para tamaños pequeños, usar tamaños optimizados
      const optimizedSize = this.getOptimizedSize(size);

      return `${baseUrl}${optimizedSize}${poster}`;
    } else {
      return './assets/no-image.png';
    }
  }

  private getOptimizedSize(requestedSize: ImageSize): ImageSize {
    // Mapear tamaños solicitados a tamaños optimizados
    const sizeMap: Record<ImageSize, ImageSize> = {
      w92: 'w154', // Muy pequeño -> pequeño
      w154: 'w185', // Pequeño -> un poco más grande
      w185: 'w342', // Mediano -> mediano-grande
      w342: 'w500', // Grande -> extra grande
      w500: 'w780', // Extra grande -> muy grande
      w780: 'original', // Muy grande -> original
      original: 'original',
    };

    return sizeMap[requestedSize] || 'w500';
  }

  private async checkWebPSupport(): Promise<void> {
    if (this.supportsWebP !== null) return;

    try {
      const webpData =
        'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
      const img = new Image();

      const promise = new Promise<boolean>((resolve) => {
        img.onload = img.onerror = () => resolve(img.height === 2);
      });

      img.src = webpData;
      this.supportsWebP = await promise;
    } catch {
      this.supportsWebP = false;
    }
  }
}
