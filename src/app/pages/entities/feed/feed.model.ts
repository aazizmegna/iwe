import { BaseEntity } from 'src/model/base-entity';
import { Post } from '../post/post.model';

export class Feed implements BaseEntity {
  constructor(public id?: number, public posts?: Post[]) {}
}
