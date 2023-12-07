import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hoursMinutes'
})
export class HoursMinutesPipe implements PipeTransform {

  transform(value: number): string {
    const hours: number = Math.floor(value / 60);
    const minutes: number = (value % 60);

    if ( hours > 0 ) {
      return `${hours} H ${minutes} MIN`;
    } else {
      return `${minutes} MIN`;
    }
  }

}