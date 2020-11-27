import { BaseEntity } from 'src/model/base-entity';
import { Ride } from '../ride/ride.model';
import { Transaction } from '../transaction/transaction.model';

export class LocationServiceProvider implements BaseEntity {
  constructor(
    public id?: number,
    public trafficRegistrationContentType?: string,
    public trafficRegistration?: any,
    public criminalRecordContentType?: string,
    public criminalRecord?: any,
    public taxRegistrationContentType?: string,
    public taxRegistration?: any,
    public rides?: Ride[],
    public transactions?: Transaction[]
  ) {}
}
