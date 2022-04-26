import { BaseEntity } from 'src/model/base-entity';
import {ServiceConsumer} from '../entities/service-consumer';
import {ServiceProvider} from '../entities/service-provider';
import {Booking} from '../entities/booking';

export class Home implements BaseEntity {
  constructor(
    public id?: number,
    public location?: string,
    public description?: string,
    public timePosted?: any,
    public serviceConsumer?: ServiceConsumer,
    public serviceProvider?: ServiceProvider,
    public name?: string,
    public imageUrl?: string,
    public pictureContentType?: string,
    public picture?: any,
    public price?: number,
    public bookings?: Booking[],
  ) {}
}
