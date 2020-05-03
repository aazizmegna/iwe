import { BaseEntity } from 'src/model/base-entity';
import { Ride } from '../ride/ride.model';
import { Transaction } from '../transaction/transaction.model';

export class LocationServiceProvider implements BaseEntity {
  constructor(
    public id?: number,
    public trafficRegistrationUrl?: string,
    public criminalRecordUrl?: string,
    public taxRegistrationUrl?: string,
    public rides?: Ride[],
    public transactions?: Transaction[]
  ) {}
}
