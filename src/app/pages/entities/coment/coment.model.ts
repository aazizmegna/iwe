import { BaseEntity } from 'src/model/base-entity';
import { Reaction } from '../reaction/reaction.model';

export class Coment implements BaseEntity {
  constructor(
    public id?: number,
    public content?: string,
    public pictureUrl?: string,
    public createdAt?: any,
    public reaction?: Reaction
  ) {}
}
