import { BaseEntity } from 'src/model/base-entity';
import { Post } from '../post/post.model';

export class VideoPost implements BaseEntity {
  constructor(public id?: number, public contentContentType?: string, public content?: any, public duration?: number, public post?: Post) {}
}
