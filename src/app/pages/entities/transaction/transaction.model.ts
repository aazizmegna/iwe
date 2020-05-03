import { BaseEntity } from 'src/model/base-entity';
import { LocationServiceProvider } from '../location-service-provider/location-service-provider.model';
import { Service } from '../service/service.model';

export const enum PaymentType {
  'CARD',
  'CASH',
}

export class Transaction implements BaseEntity {
  constructor(
    public id?: number,
    public paymentType?: PaymentType,
    public timestamp?: any,
    public locationServiceProvider?: LocationServiceProvider,
    public service?: Service
  ) {}
}
