import { BaseEntity } from 'src/model/base-entity';
import { Booking } from '../booking/booking.model';
import { Transaction } from '../transaction/transaction.model';
import { ServiceConsumer } from '../service-consumer/service-consumer.model';
import { ServiceProvider } from '../service-provider/service-provider.model';

export class Service implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public pictureContentType?: string,
    public picture?: any,
    public location?: string,
    public price?: number,
    public timePosted?: any,
    public bookings?: Booking[],
    public transactions?: Transaction[],
    public serviceConsumer?: ServiceConsumer,
    public serviceProvider?: ServiceProvider
  ) {}
}
