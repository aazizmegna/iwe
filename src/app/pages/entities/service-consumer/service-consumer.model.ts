import { BaseEntity } from 'src/model/base-entity';
import { Booking } from '../booking/booking.model';
import { Service } from '../service/service.model';
import { Post } from '../post/post.model';
import {User} from '../../../services/user/user.model';

export class ServiceConsumer implements BaseEntity {
  constructor(
    public id?: number,
    public location?: string,
    public imageUrl?: string,
    public bookings?: Booking[],
    public services?: Service[],
    public posts?: Post[],
    public user?: User,
    public contentContentType?: string,
    public content?: any,
  ) {}
}
