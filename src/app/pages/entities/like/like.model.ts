import { BaseEntity } from 'src/model/base-entity';
import { Reaction } from '../reaction/reaction.model';

export class Like implements BaseEntity {
  constructor(public id?: number, public amount?: number, public reaction?: Reaction) {}
}
