import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'poster'
})
export class PosterPipe implements PipeTransform {

  transform(poster: string): string {
    if ( poster ) {
      return `https://image.tmdb.org/t/p/original${ poster }`;
    } else {
      return './assets/no-image.jpg';
    }
  }

}
