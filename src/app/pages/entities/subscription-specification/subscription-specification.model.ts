import { BaseEntity } from 'src/model/base-entity';
import { IWESubscription } from '../iwe-subscription/iwe-subscription.model';

export const enum ProfilePageType {
  'GENERAL',
  'CUSTOM',
}

export const enum PaymentType {
  'CARD',
  'CASH',
}

export class SubscriptionSpecification implements BaseEntity {
  constructor(
    public id?: number,
    public numberOfUsers?: number,
    public targetArea?: number,
    public profilePage?: ProfilePageType,
    public paymentOption?: PaymentType,
    public subscription?: IWESubscription
  ) {}
}
