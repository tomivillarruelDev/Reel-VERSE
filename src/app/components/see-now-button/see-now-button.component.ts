import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-see-now-button',
  template: ` <a class="see-now-button text-sm" [href]="link" target="_blank">
    <i class="fa-solid fa-play"></i>
    Ver ahora
  </a>`,
})
export class SeeNowButtonComponent implements OnChanges {
  @Input() link: string = '';

  ngOnChanges() {
    if (!this.link) {
      console.log(this.link);
      console.warn('El enlace no está definido');
    }
  }
}
