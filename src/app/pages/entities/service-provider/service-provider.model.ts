import { BaseEntity } from 'src/model/base-entity';
import { IWESubscription } from '../iwe-subscription/iwe-subscription.model';
import { Ride } from '../ride/ride.model';
import { Message } from '../message/message.model';
import { Service } from '../service/service.model';
import { Reaction } from '../reaction/reaction.model';
import { Product } from '../product/product.model';
import { Connection } from '../connection/connection.model';
import { Post } from '../post/post.model';
import { Rating } from '../rating/rating.model';

export class ServiceProvider implements BaseEntity {
  constructor(
    public id?: number,
    public taxRegistrationUrl?: string,
    public licenseOfTradeUrl?: string,
    public criminalRecordUrl?: string,
    public location?: string,
    public subscription?: IWESubscription,
    public rides?: Ride[],
    public messages?: Message[],
    public services?: Service[],
    public reactions?: Reaction[],
    public products?: Product[],
    public connections?: Connection[],
    public posts?: Post[],
    public ratings?: Rating[]
  ) {}
}
