import { BaseEntity } from 'src/model/base-entity';

export const enum SubscriptionType {
  'BRONZE',
  'SILVER',
  'GOLD',
  'PLATINUM',
}

export class IWESubscription implements BaseEntity {
  constructor(public id?: number, public type?: SubscriptionType) {}
}
