import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImagePreloadService {
  private preloadedImages = new Set<string>();
  private preloadQueue = new Map<string, Promise<void>>();

  constructor() {}

  /**
   * Preload de una imagen específica
   */
  preloadImage(url: string): Promise<void> {
    if (this.preloadedImages.has(url)) {
      return Promise.resolve();
    }

    if (this.preloadQueue.has(url)) {
      return this.preloadQueue.get(url)!;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        this.preloadedImages.add(url);
        this.preloadQueue.delete(url);
        resolve();
      };

      img.onerror = () => {
        this.preloadQueue.delete(url);
        reject(new Error(`Failed to preload image: ${url}`));
      };

      img.src = url;
    });

    this.preloadQueue.set(url, promise);
    return promise;
  }

  /**
   * Preload de múltiples imágenes
   */
  preloadImages(urls: string[]): Promise<void[]> {
    const preloadPromises = urls.map((url) => this.preloadImage(url));
    return Promise.all(preloadPromises);
  }

  /**
   * Preload de imágenes con límite de concurrencia
   */
  async preloadImagesWithLimit(
    urls: string[],
    limit: number = 3
  ): Promise<void> {
    const chunks = this.chunkArray(urls, limit);

    for (const chunk of chunks) {
      await this.preloadImages(chunk);
    }
  }

  /**
   * Verificar si una imagen está preloaded
   */
  isPreloaded(url: string): boolean {
    return this.preloadedImages.has(url);
  }

  /**
   * Limpiar caché de imágenes preloaded
   */
  clearPreloadCache(): void {
    this.preloadedImages.clear();
    this.preloadQueue.clear();
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
