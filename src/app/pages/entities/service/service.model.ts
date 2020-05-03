import { BaseEntity } from 'src/model/base-entity';
import { Transaction } from '../transaction/transaction.model';
import { ServiceConsumer } from '../service-consumer/service-consumer.model';
import { ServiceProvider } from '../service-provider/service-provider.model';

export class Service implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public pictureURL?: string,
    public location?: string,
    public transactions?: Transaction[],
    public serviceConsumer?: ServiceConsumer,
    public serviceProvider?: ServiceProvider
  ) {}
}
