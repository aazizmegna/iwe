import { BaseEntity } from 'src/model/base-entity';
import {Post} from './post.model';

export class PicturePost implements BaseEntity {
  constructor(public id?: number, public contentContentType?: string, public content?: any, public post?: Post) {}
}
