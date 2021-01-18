
import { BaseEntity } from 'src/model/base-entity';
import {PicturePost} from '../entities/post';
import {Service} from '../entities/service';
import {Reaction} from '../entities/reaction';
import {ServiceConsumer} from '../entities/service-consumer';
import {ServiceProvider} from '../entities/service-provider';
import {Feed} from '../entities/feed';
import {Booking} from '../entities/booking';
import {Transaction} from '../entities/transaction';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class FeedsProvider implements BaseEntity {
  constructor(
    public id?: number,
    public location?: string,
    public description?: string,
    public timePosted?: any,
    public reactions?: Reaction[],
    public serviceConsumer?: ServiceConsumer,
    public serviceProvider?: ServiceProvider,
    public name?: string,
    public pictureContentType?: string,
    public picture?: any,
    public price?: number,
    public bookings?: Booking[],
    public transactions?: Transaction[],
  ) {}
}
