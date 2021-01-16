import { BaseEntity } from 'src/model/base-entity';
import {Reaction} from '../entities/reaction';
import {ServiceConsumer} from '../entities/service-consumer';
import {ServiceProvider} from '../entities/service-provider';
import {Feed} from '../entities/feed';

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
