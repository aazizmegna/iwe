import { BaseEntity } from 'src/model/base-entity';

export class Rating implements BaseEntity {
  constructor(public id?: number, public rating?: number) {}
}
