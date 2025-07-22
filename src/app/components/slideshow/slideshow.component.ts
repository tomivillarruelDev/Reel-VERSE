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
    private moviesService: MoviesService
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

  private async getMoviesLogo(): Promise<void> {
    const logoPaths = await Promise.all(
      this.data.map((item) => this.moviesService.getMovieLogo(item.id))
    );
    this.data.forEach((item, index) => {
      item.logo_path = logoPaths[index];
    });
  }

  private async getGenreMovies(): Promise<void> {
    // Recopilar todos los IDs de géneros únicos (solo el primero de cada película)
    const uniqueGenreIds = [
      ...new Set(
        this.data
          .map((item: Result) => item.genre_ids[0])
          .filter((id) => id !== undefined)
      ),
    ];

    const genrePromises = uniqueGenreIds.map((genreId) =>
      this.moviesService.getMovieGenresById(genreId)
    );

    const uniqueGenres = await Promise.all(genrePromises);

    // Crear un mapa de ID de género a nombre de género para acceso rápido
    const genreMap = new Map<number, string>();
    uniqueGenres.forEach((genre, index) => {
      if (genre) {
        genreMap.set(uniqueGenreIds[index], genre.name);
      }
    });

    // Asignar el nombre del género a cada película basado en su primer genre_id
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
    if (!this.data) {
      return;
    }
    await Promise.all([this.getMoviesLogo(), this.getGenreMovies()]);
    // Marcar que los logos y géneros ya están cargados
    this.slideDataLoaded = true;
    this.cdRef.detectChanges();

    // Iniciar Swiper ahora que el DOM (logos) está listo
    setTimeout(() => {
      this.initSwiper();
      this.slideshowLoaded.emit();
    }, 0);
  }
}
