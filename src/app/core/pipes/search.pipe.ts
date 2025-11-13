import { Pipe, PipeTransform } from '@angular/core';
import { IProduct } from '../interfaces/iproduct';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {

  transform(products: IProduct[], searchTerm: string): IProduct[] {
        if (!products || !searchTerm) return products;
    return products.filter((item)=> item.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }

}
