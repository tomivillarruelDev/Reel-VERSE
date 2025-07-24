import { ElementRef } from '@angular/core';

export class MoviesObserverHelper {
  static createObserver(
    callback: () => void,
    condition: () => boolean,
    rootMargin: string = '50px 0px'
  ): IntersectionObserver {
    return new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && condition()) {
          callback();
        }
      },
      { rootMargin }
    );
  }

  static setupObserver(
    observer: IntersectionObserver,
    element: ElementRef,
    observers: IntersectionObserver[]
  ): void {
    observer.observe(element.nativeElement);
    observers.push(observer);
  }

  static createMoviesObserverConfig() {
    return {
      trending: {
        rootMargin: '50px 0px',
        threshold: 0.1,
      },
      topRated: {
        rootMargin: '50px 0px',
        threshold: 0.1,
      },
      family: {
        rootMargin: '50px 0px',
        threshold: 0.1,
      },
      comedy: {
        rootMargin: '50px 0px',
        threshold: 0.1,
      },
      horror: {
        rootMargin: '50px 0px',
        threshold: 0.1,
      },
      drama: {
        rootMargin: '50px 0px',
        threshold: 0.1,
      },
    };
  }

  static disconnectAllObservers(observers: IntersectionObserver[]): void {
    observers.forEach((observer) => {
      observer.disconnect();
    });
    observers.length = 0; // Limpia el array
  }
}
