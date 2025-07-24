import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trackBy',
  pure: true,
})
export class TrackByPipe implements PipeTransform {
  transform(index: number, item: any): any {
    // Función genérica para trackBy
    return item?.id || item?.title || item?.name || index;
  }

  // Método estático para usar directamente en componentes
  static trackByFn(index: number, item: any): any {
    return item?.id || item?.title || item?.name || index;
  }
}

// Helper function para usar en templates
export function trackByMovieId(index: number, item: any): any {
  return item?.id || index;
}

export function trackByIndex(index: number, item: any): number {
  return index;
}
