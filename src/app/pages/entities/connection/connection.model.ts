import { BaseEntity } from 'src/model/base-entity';
import { ServiceConsumer } from '../service-consumer/service-consumer.model';
import { ServiceProvider } from '../service-provider/service-provider.model';

export class Connection implements BaseEntity {
  constructor(
    public id?: number,
    public startedAt?: any,
    public serviceConsumer?: ServiceConsumer,
    public serviceProvider?: ServiceProvider
  ) {}
}
