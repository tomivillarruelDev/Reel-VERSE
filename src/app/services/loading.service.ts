import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  // Mapa de estados de loading por componente/operación
  private loadingStates = new Map<string, boolean>();
  private loadingSubject = new BehaviorSubject<Map<string, boolean>>(new Map());
  
  // Observable que emite true si HAY AL MENOS UN loading activo
  isLoading: Observable<boolean> = this.loadingSubject.asObservable().pipe(
    map(states => Array.from(states.values()).some(loading => loading))
  );

  constructor() { }

  /**
   * Establece el estado de loading para un componente específico
   * @param componentId - Identificador único del componente/operación
   * @param isLoading - Estado de loading
   */
  public setLoading(isLoading: boolean, componentId: string = 'default'): void {
    if (isLoading) {
      this.loadingStates.set(componentId, true);
    } else {
      this.loadingStates.delete(componentId);
    }
    
    // Emitir nueva copia del Map para asegurar que los subscriptores detecten el cambio
    this.loadingSubject.next(new Map(this.loadingStates));
  }

  /**
   * Verifica si un componente específico está cargando
   * @param componentId - Identificador del componente
   * @returns true si el componente está cargando
   */
  public isComponentLoading(componentId: string): boolean {
    return this.loadingStates.get(componentId) || false;
  }

  /**
   * Verifica si hay algún loading activo
   * @returns true si hay al menos un loading activo
   */
  public hasAnyLoading(): boolean {
    return Array.from(this.loadingStates.values()).some(loading => loading);
  }

  /**
   * Limpia todos los estados de loading
   */
  public clearAllLoading(): void {
    this.loadingStates.clear();
    this.loadingSubject.next(new Map());
  }

  /**
   * Obtiene todos los componentes que están cargando (útil para debugging)
   */
  public getActiveLoadings(): string[] {
    return Array.from(this.loadingStates.keys()).filter(key => 
      this.loadingStates.get(key)
    );
  }
}
