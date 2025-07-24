import { ElementRef } from '@angular/core';

export class HomeObserverHelper {
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
}
