import { BaseEntity } from 'src/model/base-entity';
import { ServiceConsumer } from '../service-consumer/service-consumer.model';
import { ServiceProvider } from '../service-provider/service-provider.model';
import { Post } from '../post/post.model';

export class Reaction implements BaseEntity {
  constructor(public id?: number, public serviceConsumer?: ServiceConsumer, public serviceProvider?: ServiceProvider, public post?: Post) {}
}
