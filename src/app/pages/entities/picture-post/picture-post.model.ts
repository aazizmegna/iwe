import { BaseEntity } from 'src/model/base-entity';
import { Post } from '../post/post.model';

export class PicturePost implements BaseEntity {
  constructor(public id?: number, public contentContentType?: string, public content?: any, public imageUrl?: string, public post?: Post) {}
}
