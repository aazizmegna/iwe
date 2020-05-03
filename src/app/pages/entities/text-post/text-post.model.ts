import { BaseEntity } from 'src/model/base-entity';
import { Post } from '../post/post.model';

export class TextPost implements BaseEntity {
  constructor(public id?: number, public content?: string, public post?: Post) {}
}
