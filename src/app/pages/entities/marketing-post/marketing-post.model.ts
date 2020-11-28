import { BaseEntity } from 'src/model/base-entity';

export class MarketingPost implements BaseEntity {
  constructor(public id?: number, public price?: number) {}
}
