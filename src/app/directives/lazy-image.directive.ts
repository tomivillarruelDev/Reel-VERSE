import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  Renderer2,
  ChangeDetectorRef,
} from '@angular/core';
import { ImagePreloadService } from '../services/image-preload.service';

@Directive({
  selector: '[appLazyImage]',
})
export class LazyImageDirective implements OnInit, OnDestroy {
  @Input() appLazyImage!: string;
  @Input() placeholder?: string;
  @Input() fallback?: string;

  private observer?: IntersectionObserver;
  private loaded = false;

  constructor(
    private el: ElementRef<HTMLImageElement>,
    private renderer: Renderer2,
    private imagePreloadService: ImagePreloadService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setPlaceholder();
    this.createObserver();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setPlaceholder(): void {
    const img = this.el.nativeElement;

    // Set placeholder con color oscuro mientras carga
    const placeholderSrc =
      this.placeholder ||
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTYxNjFGIi8+PC9zdmc+';

    this.renderer.setAttribute(img, 'src', placeholderSrc);
    this.renderer.addClass(img, 'lazy-loading');
  }

  private createObserver(): void {
    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.loaded) {
          this.loadImage();
        }
      });
    }, options);

    this.observer.observe(this.el.nativeElement);
  }

  private async loadImage() {
    if (this.loaded || !this.appLazyImage) return;

    const img = this.el.nativeElement;

    try {
      // Usar el servicio de preload si la imagen ya está en caché
      if (this.imagePreloadService.isPreloaded(this.appLazyImage)) {
        this.setImageSrc(this.appLazyImage);
      } else {
        // Preload la imagen antes de mostrarla
        await this.imagePreloadService.preloadImage(this.appLazyImage);
        this.setImageSrc(this.appLazyImage);
      }
    } catch (error) {
      console.warn('Error loading image:', error);
      if (this.fallback) {
        this.setImageSrc(this.fallback);
      }
    }
  }

  private setImageSrc(src: string): void {
    const img = this.el.nativeElement;

    this.renderer.setAttribute(img, 'src', src);
    this.renderer.removeClass(img, 'lazy-loading');
    this.renderer.addClass(img, 'lazy-loaded');

    this.loaded = true;

    if (this.observer) {
      this.observer.unobserve(img);
    }

    this.cdr.markForCheck();
  }
}
