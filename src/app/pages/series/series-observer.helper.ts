import { ElementRef } from '@angular/core';

export class SeriesObserverHelper {
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

  static createSeriesObserverConfig() {
    return {
      trending: {
        rootMargin: '50px 0px',
        threshold: 0.1,
      },
      topRated: {
        rootMargin: '50px 0px',
        threshold: 0.1,
      },
      popular: {
        rootMargin: '50px 0px',
        threshold: 0.1,
      },
      action: {
        rootMargin: '50px 0px',
        threshold: 0.1,
      },
      comedy: {
        rootMargin: '50px 0px',
        threshold: 0.1,
      },
      crime: {
        rootMargin: '50px 0px',
        threshold: 0.1,
      },
      documentary: {
        rootMargin: '50px 0px',
        threshold: 0.1,
      },
      drama: {
        rootMargin: '50px 0px',
        threshold: 0.1,
      },
      family: {
        rootMargin: '50px 0px',
        threshold: 0.1,
      },
      kids: {
        rootMargin: '50px 0px',
        threshold: 0.1,
      },
      mystery: {
        rootMargin: '50px 0px',
        threshold: 0.1,
      },
      news: {
        rootMargin: '50px 0px',
        threshold: 0.1,
      },
      reality: {
        rootMargin: '50px 0px',
        threshold: 0.1,
      },
      sciFiFantasy: {
        rootMargin: '50px 0px',
        threshold: 0.1,
      },
      soap: {
        rootMargin: '50px 0px',
        threshold: 0.1,
      },
      talk: {
        rootMargin: '50px 0px',
        threshold: 0.1,
      },
      war: {
        rootMargin: '50px 0px',
        threshold: 0.1,
      },
      western: {
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
