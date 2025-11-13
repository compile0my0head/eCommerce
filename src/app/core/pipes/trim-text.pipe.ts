import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimText',
  standalone: true
})
export class TrimTextPipe implements PipeTransform {

  transform(txt: string, limit: number): string {
    return txt.split(" ", limit).join(" ")
  }

}
