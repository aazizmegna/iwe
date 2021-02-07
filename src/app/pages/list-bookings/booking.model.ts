import {BaseEntity} from '../../../model/base-entity';
import {ServiceConsumer} from '../entities/service-consumer';
import {ServiceProvider} from '../entities/service-provider';
import {Service} from '../entities/service';


export class Booking implements BaseEntity {
  constructor(
    public id?: number,
    public dateTime?: any,
    public serviceConsumer?: ServiceConsumer,
    public serviceProvider?: ServiceProvider,
    public service?: Service
  ) {}
}
