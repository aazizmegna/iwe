import { BaseEntity } from 'src/model/base-entity';
import { ServiceProvider } from '../service-provider/service-provider.model';
import { ServiceConsumer } from '../service-consumer/service-consumer.model';

export class Rating implements BaseEntity {
  constructor(
    public id?: number,
    public rating?: number,
    public serviceProviders?: ServiceProvider[],
    public serviceConsumers?: ServiceConsumer[]
  ) {}
}
