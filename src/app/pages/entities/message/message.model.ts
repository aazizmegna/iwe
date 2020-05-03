import { BaseEntity } from 'src/model/base-entity';
import { ServiceConsumer } from '../service-consumer/service-consumer.model';
import { ServiceProvider } from '../service-provider/service-provider.model';

export class Message implements BaseEntity {
  constructor(
    public id?: number,
    public content?: string,
    public sender?: string,
    public receiver?: string,
    public timestamp?: any,
    public serviceConsumer?: ServiceConsumer,
    public serviceProvider?: ServiceProvider
  ) {}
}
