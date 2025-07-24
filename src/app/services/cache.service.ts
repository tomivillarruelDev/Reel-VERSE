import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // en millisegundos
}

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 minutos

  constructor() {}

  set<T>(
    key: string,
    data: T,
    expiresIn: number = this.DEFAULT_CACHE_TIME
  ): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresIn,
    };
    this.cache.set(key, entry);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > entry.expiresIn;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    const isExpired = Date.now() - entry.timestamp > entry.expiresIn;

    if (isExpired) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  // Limpieza automática de entradas expiradas
  clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.expiresIn) {
        this.cache.delete(key);
      }
    }
  }
}
