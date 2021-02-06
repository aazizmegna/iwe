import { BaseEntity } from 'src/model/base-entity';
import { Ride } from '../ride/ride.model';
import { Booking } from '../booking/booking.model';
import { Service } from '../service/service.model';
import { Message } from '../message/message.model';
import { Post } from '../post/post.model';
import { Reaction } from '../reaction/reaction.model';
import { Connection } from '../connection/connection.model';
import { Invitation } from '../invitation/invitation.model';
import {User} from '../../../services/user/user.model';

export class ServiceConsumer implements BaseEntity {
  constructor(
    public id?: number,
    public location?: string,
    public rides?: Ride[],
    public bookings?: Booking[],
    public services?: Service[],
    public messages?: Message[],
    public posts?: Post[],
    public reactions?: Reaction[],
    public connections?: Connection[],
    public invitations?: Invitation[],
    public user?: User,
    public contentContentType?: string,
    public content?: any,
  ) {}
}
