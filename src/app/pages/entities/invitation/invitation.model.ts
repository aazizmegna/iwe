import { BaseEntity } from 'src/model/base-entity';
import { ServiceConsumer } from '../service-consumer/service-consumer.model';

export class Invitation implements BaseEntity {
  constructor(public id?: number, public sentTo?: string, public content?: string, public serviceConsumer?: ServiceConsumer) {}
}
