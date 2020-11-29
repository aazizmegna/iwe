import { BaseEntity } from 'src/model/base-entity';
import { Reaction } from '../reaction/reaction.model';
import { ServiceConsumer } from '../service-consumer/service-consumer.model';
import { ServiceProvider } from '../service-provider/service-provider.model';
import { Feed } from '../feed/feed.model';

export class Post implements BaseEntity {
  constructor(
    public id?: number,
    public location?: string,
    public description?: string,
    public timePosted?: any,
    public reactions?: Reaction[],
    public serviceConsumer?: ServiceConsumer,
    public serviceProvider?: ServiceProvider,
    public feeds?: Feed[]
  ) {}
}
