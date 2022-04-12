import {BaseEntity} from 'src/model/base-entity';
import {IWESubscription} from '../iwe-subscription/iwe-subscription.model';
import {Booking} from '../booking/booking.model';
import {Ride} from '../ride/ride.model';
import {Message} from '../message/message.model';
import {Service} from '../service/service.model';
import {Reaction} from '../reaction/reaction.model';
import {Product} from '../product/product.model';
import {Connection} from '../connection/connection.model';
import {Post} from '../post/post.model';
import {User} from '../../../services/user/user.model';

export class ServiceProvider implements BaseEntity {
  constructor(
    public id?: number,
    public taxRegistrationContentType?: string,
    public profileImageUrl?: string,
    public taxRegistration?: any,
    public licenseOfTradeContentType?: string,
    public licenseOfTrade?: any,
    public criminalRecordContentType?: string,
    public criminalRecord?: any,
    public location?: string,
    public subscription?: IWESubscription,
    public user?: User,
    public bookings?: Booking[],
    public rides?: Ride[],
    public messages?: Message[],
    public services?: Service[],
    public reactions?: Reaction[],
    public products?: Product[],
    public connections?: Connection[],
    public posts?: Post[],
    public contentContentType?: string,
    public content?: any,
    public shortBiography?: string,
  ) {
  }
}
