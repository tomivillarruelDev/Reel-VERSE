import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DeviceDetectionService {
  private userAgent: string;
  private isAndroidDevice: boolean;
  private isMobileDevice: boolean;
  private isLowEndDevice: boolean;

  constructor() {
    this.userAgent = navigator.userAgent.toLowerCase();
    this.isAndroidDevice = this.detectAndroid();
    this.isMobileDevice = this.detectMobile();
    this.isLowEndDevice = this.detectLowEndDevice();
  }

  /**
   * Detecta si el dispositivo es Android
   */
  private detectAndroid(): boolean {
    return this.userAgent.includes('android');
  }

  /**
   * Detecta si el dispositivo es móvil
   */
  private detectMobile(): boolean {
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      this.userAgent
    );
  }

  /**
   * Detecta si es un dispositivo de gama baja basado en varias métricas
   */
  private detectLowEndDevice(): boolean {
    // Detectar basado en memory API si está disponible
    const memory = (navigator as any).deviceMemory;
    if (memory && memory <= 2) {
      return true;
    }

    // Detectar basado en CPU cores
    const cores = navigator.hardwareConcurrency;
    if (cores && cores <= 2) {
      return true;
    }

    // Detectar Android de gama baja por user agent
    if (this.isAndroidDevice) {
      const androidVersion = this.getAndroidVersion();
      if (androidVersion && androidVersion < 8) {
        return true;
      }
    }

    return false;
  }

  /**
   * Obtiene la versión de Android
   */
  private getAndroidVersion(): number | null {
    const match = this.userAgent.match(/android (\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

  /**
   * Getters públicos
   */
  get isAndroid(): boolean {
    return this.isAndroidDevice;
  }

  get isMobile(): boolean {
    return this.isMobileDevice;
  }

  get isLowEnd(): boolean {
    return this.isLowEndDevice;
  }

  get shouldUseOptimizations(): boolean {
    return this.isMobileDevice || this.isLowEndDevice;
  }

  get shouldReduceAnimations(): boolean {
    return this.isAndroidDevice || this.isLowEndDevice;
  }

  /**
   * Retorna configuraciones optimizadas para Swiper basadas en el dispositivo
   */
  getSwiperOptimizations(): {
    speed: number;
    touchRatio: number;
    shouldDisableAnimations: boolean;
    shouldReduceImages: boolean;
  } {
    if (this.isLowEndDevice) {
      return {
        speed: 250,
        touchRatio: 1.3,
        shouldDisableAnimations: true,
        shouldReduceImages: true,
      };
    }

    if (this.isAndroidDevice) {
      return {
        speed: 300,
        touchRatio: 1.2,
        shouldDisableAnimations: false,
        shouldReduceImages: false,
      };
    }

    if (this.isMobileDevice) {
      return {
        speed: 350,
        touchRatio: 1.1,
        shouldDisableAnimations: false,
        shouldReduceImages: false,
      };
    }

    return {
      speed: 400,
      touchRatio: 1,
      shouldDisableAnimations: false,
      shouldReduceImages: false,
    };
  }

  /**
   * Aplica optimizaciones CSS dinámicamente
   */
  applyCSSOptimizations(): void {
    const body = document.body;

    if (this.shouldUseOptimizations) {
      body.classList.add('mobile-optimized');
    }

    if (this.shouldReduceAnimations) {
      body.classList.add('reduce-animations');
    }

    if (this.isLowEndDevice) {
      body.classList.add('low-end-device');
    }
  }
}
