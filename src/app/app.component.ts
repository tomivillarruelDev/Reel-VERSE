import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { LoadingService } from './services/loading.service';
import { DeviceDetectionService } from './services/device-detection.service';
import { Observable } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title = 'reelVERSE';

  isLoading: Observable<boolean>;

  constructor(
    private loadingService: LoadingService,
    private router: Router,
    private deviceDetectionService: DeviceDetectionService,
    private cdr: ChangeDetectorRef
  ) {
    // Agregar startWith para asegurar un valor inicial
    this.isLoading = this.loadingService.isLoading.pipe(startWith(false));
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        window.scrollTo(0, 0);
      }
    });

    // Aplicar optimizaciones CSS basadas en el dispositivo después del ciclo de detección
    setTimeout(() => {
      this.deviceDetectionService.applyCSSOptimizations();
    }, 0);
  }
}
