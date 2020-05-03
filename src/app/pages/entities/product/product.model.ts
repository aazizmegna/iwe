import { BaseEntity } from 'src/model/base-entity';
import { ServiceProvider } from '../service-provider/service-provider.model';

export class Product implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public sellingPrice?: number,
    public purchasePrice?: number,
    public qTYOnHand?: number,
    public pictureUrl?: string,
    public serviceProvider?: ServiceProvider
  ) {}
}
