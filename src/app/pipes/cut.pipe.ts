import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cut'
})
export class CutPipe implements PipeTransform {

  transform(value: string, maxWords: number = 5): string {
    if (typeof value !== 'string') {
      return value;
    } else {
      const words = value.split(' ');

      if (words.length > maxWords) {
        return words.slice(0, maxWords).join(' ') + '...';
      } else {
        return value;
      }
    }
  }

}
