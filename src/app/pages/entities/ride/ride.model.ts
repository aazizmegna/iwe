import { BaseEntity } from 'src/model/base-entity';
import { LocationServiceProvider } from '../location-service-provider/location-service-provider.model';
import { ServiceConsumer } from '../service-consumer/service-consumer.model';
import { ServiceProvider } from '../service-provider/service-provider.model';

export class Ride implements BaseEntity {
  constructor(
    public id?: number,
    public departure?: string,
    public destination?: string,
    public startedAt?: any,
    public endedAt?: any,
    public locationServiceProvider?: LocationServiceProvider,
    public serviceConsumer?: ServiceConsumer,
    public serviceProvider?: ServiceProvider
  ) {}
}
