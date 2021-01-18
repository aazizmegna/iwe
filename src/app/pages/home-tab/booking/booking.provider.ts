import {Injectable} from '@angular/core';
import {ServiceConsumer} from '../../entities/service-consumer';
import {ServiceProvider} from '../../entities/service-provider';
import {Service} from '../../entities/service';

@Injectable({providedIn: 'root'})
export class BookingProvider {
  public id?: number;
  public dateTime?: any;
  public serviceConsumer?: ServiceConsumer;
  public serviceProvider?: ServiceProvider;
  public service?: Service;
  constructor(
  ) {}
}
