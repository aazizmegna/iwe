import {BaseEntity} from 'src/model/base-entity';
import {Booking} from '../booking/booking.model';
import {Service} from '../service/service.model';
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
    public user?: User,
    public bookings?: Booking[],
    public services?: Service[],
    public posts?: Post[],
    public contentContentType?: string,
    public content?: any,
    public shortBiography?: string,
  ) {
  }
}
