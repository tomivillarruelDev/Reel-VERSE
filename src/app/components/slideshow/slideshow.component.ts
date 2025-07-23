import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';
import { MoviesService } from 'src/app/services/movies.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Subscription, debounceTime, fromEvent } from 'rxjs';
import { Result } from 'src/app/interfaces/API-response.interface';
import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import { SeriesService } from '../../services/series.service';
import { GenresCacheService } from '../../services/genres-cache.service';

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.css'],
})
export class SlideshowComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
  @Input() data!: Result[];
  // Indica si los logos ya se cargaron y están listos para mostrar el slideshow
  public slideDataLoaded = false;
  @Output() slideshowLoaded = new EventEmitter<void>();

  public isLargeScreen = window.innerWidth > 600;

  private resizeSubscription!: Subscription;

  private swiper!: Swiper;
  // Inicializa Swiper cuando el DOM está listo con los logos
  private initSwiper(): void {
    this.swiper = new Swiper('.swiper-large-screen', {
      modules: [Navigation, Pagination, Autoplay, EffectFade],
      loop: true,
      freeMode: true,
      effect: 'fade',
      fadeEffect: { crossFade: true },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      autoplay: {
        delay: 10000,
        disableOnInteraction: false,
      },
    });
  }

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private moviesService: MoviesService,
    private seriesService: SeriesService,
    private genresCacheService: GenresCacheService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data && this.data.length > 0) {
      // Reiniciar bandera antes de cargar nuevos logos
      this.slideDataLoaded = false;
      this.data = this.data.slice(0, 7);

      this.getMoviesLogoAndGenreMovies();
    }
  }

  ngOnInit(): void {
    this.checkScreenSize();
    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(1000))
      .subscribe(() => this.checkScreenSize());
  }

  ngAfterViewInit(): void {
    // La inicialización de Swiper se realiza tras cargar los logos en getMoviesLogo
  }
  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  private checkScreenSize(): void {
    this.isLargeScreen = window.innerWidth > 600;
    this.cdRef.detectChanges();
  }

  onRedirectToDetailPage(object: Result) {
    if (object) {
      if (object.title) {
        this.router.navigate(['/movie', object.id]);
      } else if (object.name) {
        this.router.navigate(['/serie', object.id]);
      }
    }
  }

  private async getLogos(mediaType: 'movie' | 'tv'): Promise<void> {
    const logoPaths = await Promise.all(
      this.data.map((item) => {
        if (mediaType === 'movie') {
          return this.moviesService.getMovieLogo(item.id);
        } else {
          return this.seriesService.getSerieLogo(item.id);
        }
      })
    );
    this.data.forEach((item, index) => {
      item.logo_path = logoPaths[index];
    });
  }

  private async getGenres(mediaType: 'movie' | 'tv'): Promise<void> {
    // Recopilar todos los IDs de géneros únicos (solo el primero de cada película/serie)
    const uniqueGenreIds = [
      ...new Set(
        this.data
          .map((item: Result) => item.genre_ids[0])
          .filter((id) => id !== undefined)
      ),
    ];

    // Usar el servicio de caché para obtener los géneros
    const genreMap = await this.genresCacheService.getGenresByIds(
      uniqueGenreIds,
      mediaType
    );

    // Asignar el nombre del género a cada elemento usando el mapa
    this.data.forEach((item: Result) => {
      const firstGenreId = item.genre_ids[0];
      if (firstGenreId && genreMap.has(firstGenreId)) {
        item.genre_name = genreMap.get(firstGenreId) || null;
      } else {
        item.genre_name = null;
      }
    });
  }

  private async getMoviesLogoAndGenreMovies(): Promise<void> {
    if (!this.data || this.data.length === 0) {
      return;
    }

    // Determinar el tipo de contenido basado en el primer elemento
    // o usar media_type si está disponible
    const mediaType = this.determineMediaType();

    // Cargar logos y géneros en paralelo
    await Promise.all([this.getLogos(mediaType), this.getGenres(mediaType)]);

    // Marcar que los datos del slideshow ya están cargados
    this.slideDataLoaded = true;
    this.cdRef.detectChanges();

    // Iniciar Swiper ahora que el DOM está listo
    setTimeout(() => {
      this.initSwiper();
      this.slideshowLoaded.emit();
    }, 0);
  }

  private determineMediaType(): 'movie' | 'tv' {
    // Si hay media_type definido, usarlo
    if (this.data[0]?.media_type) {
      return this.data[0].media_type === 'tv' ? 'tv' : 'movie';
    }

    // Si no, determinar por la presencia de title (movie) o name (tv)
    return this.data[0]?.title ? 'movie' : 'tv';
  }

  // Método estático para limpiar el caché si es necesario
  public static clearGenresCache(): void {
    GenresCacheService.clearCache();
  }

  // Método para obtener información del caché (útil para debugging)
  public static getCacheInfo(): {
    moviesList: boolean;
    seriesList: boolean;
    moviesIndividual: number;
    seriesIndividual: number;
  } {
    return GenresCacheService.getCacheInfo();
  }
}
