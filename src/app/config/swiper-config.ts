/**
 * Configuración optimizada para Swipers - Performance en móviles Android
 */

export interface SwiperOptimizedConfig {
  loop: boolean;
  freeMode: boolean;
  speed: number;
  touchRatio: number;
  touchAngle: number;
  grabCursor: boolean;
  preventInteractionOnTransition: boolean;
  resistanceRatio?: number;
  breakpoints: {
    [key: number]: {
      slidesPerView: number | 'auto';
      spaceBetween: number;
      resistanceRatio: number;
      slidesPerGroup?: number;
    };
  };
}

export const SWIPER_BASE_CONFIG: Partial<SwiperOptimizedConfig> = {
  loop: false,
  freeMode: false,
  speed: 400, // Optimizado para responsividad
  touchRatio: 1,
  touchAngle: 45,
  grabCursor: true,
  preventInteractionOnTransition: true,
};

export const SWIPER_BREAKPOINTS_POSTER = {
  0: {
    slidesPerView: 2,
    spaceBetween: 10,
    resistanceRatio: 0.85,
  },
  440: {
    slidesPerView: 3,
    spaceBetween: 10,
    resistanceRatio: 0.85,
  },
  600: {
    slidesPerView: 4,
    spaceBetween: 10,
    resistanceRatio: 0.75,
  },
  1100: {
    slidesPerView: 6,
    spaceBetween: 20,
    resistanceRatio: 0.5,
  },
};

export const SWIPER_BREAKPOINTS_LARGE_POSTER = {
  0: {
    slidesPerView: 1.5,
    spaceBetween: 10,
    resistanceRatio: 0.85,
  },
  440: {
    slidesPerView: 2,
    spaceBetween: 10,
    resistanceRatio: 0.85,
  },
  600: {
    slidesPerView: 3,
    spaceBetween: 10,
    resistanceRatio: 0.75,
  },
  1100: {
    slidesPerView: 4,
    spaceBetween: 20,
    resistanceRatio: 0.5,
  },
};

export const SWIPER_BREAKPOINTS_BACKDROP = {
  0: {
    slidesPerView: 1.5,
    spaceBetween: 10,
    resistanceRatio: 0.85,
  },
  440: {
    slidesPerView: 2,
    spaceBetween: 10,
    resistanceRatio: 0.85,
  },
  600: {
    slidesPerView: 3,
    spaceBetween: 10,
    resistanceRatio: 0.75,
  },
  1100: {
    slidesPerGroup: 2,
    slidesPerView: 4,
    spaceBetween: 10,
    resistanceRatio: 0.5,
  },
};

/**
 * Utilidad para crear configuración optimizada de Swiper
 */
export function createOptimizedSwiperConfig(
  breakpoints: any,
  customConfig?: Partial<SwiperOptimizedConfig>
): SwiperOptimizedConfig {
  return {
    ...SWIPER_BASE_CONFIG,
    ...customConfig,
    breakpoints,
  } as SwiperOptimizedConfig;
}

/**
 * Detecta si el dispositivo es móvil Android para optimizaciones específicas
 */
export function isAndroidMobile(): boolean {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes('android') && userAgent.includes('mobile');
}

/**
 * Configuración específica para Android con optimizaciones adicionales
 */
export function getAndroidOptimizedConfig(
  baseConfig: SwiperOptimizedConfig
): SwiperOptimizedConfig {
  if (isAndroidMobile()) {
    return {
      ...baseConfig,
      speed: 300, // Más rápido en Android
      touchRatio: 1.2, // Más sensible al touch
    };
  }
  return baseConfig;
}
