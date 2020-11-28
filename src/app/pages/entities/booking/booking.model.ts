import { BaseEntity } from 'src/model/base-entity';
import { ServiceConsumer } from '../service-consumer/service-consumer.model';
import { ServiceProvider } from '../service-provider/service-provider.model';
import { Service } from '../service/service.model';

export class Booking implements BaseEntity {
  constructor(
    public id?: number,
    public dateTime?: any,
    public serviceConsumer?: ServiceConsumer,
    public serviceProvider?: ServiceProvider,
    public service?: Service
  ) {}
}
