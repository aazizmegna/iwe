
import { BaseEntity } from 'src/model/base-entity';
import {ServiceConsumer} from '../entities/service-consumer';
import {ServiceProvider} from '../entities/service-provider';
import {Booking} from '../entities/booking';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class FeedsProvider implements BaseEntity {
  constructor(
    public id?: number,
    public location?: string,
    public description?: string,
    public timePosted?: any,
    public serviceConsumer?: ServiceConsumer,
    public serviceProvider?: ServiceProvider,
    public name?: string,
    public pictureContentType?: string,
    public picture?: any,
    public price?: number,
    public bookings?: Booking[],
  ) {}
}
