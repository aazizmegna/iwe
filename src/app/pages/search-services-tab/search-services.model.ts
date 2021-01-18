import { BaseEntity } from 'src/model/base-entity';
import {ServiceProvider} from '../entities/service-provider';
import {ServiceConsumer} from '../entities/service-consumer';
// import { Booking } from '../booking/booking.model';
// import { Transaction } from '../transaction/transaction.model';
// import { ServiceConsumer } from '../service-consumer/service-consumer.model';

export class SearchServicesModel implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public pictureContentType?: string,
    public picture?: any,
    public location?: string,
    public price?: number,
    public timePosted?: any,
    public serviceProvider?: ServiceProvider,
    public serviceConsumer?: ServiceConsumer,
    public shortBiography?: string
    // public bookings?: Booking[],
    // public transactions?: Transaction[],
  ) {}
}
