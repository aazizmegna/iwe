import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { IWESubscription } from './iwe-subscription.model';

@Injectable({ providedIn: 'root' })
export class IWESubscriptionService {
  private resourceUrl = ApiService.API_URL + '/iwe-subscriptions';

  constructor(protected http: HttpClient) {}

  create(iWESubscription: IWESubscription): Observable<HttpResponse<IWESubscription>> {
    return this.http.post<IWESubscription>(this.resourceUrl, iWESubscription, { observe: 'response' });
  }

  update(iWESubscription: IWESubscription): Observable<HttpResponse<IWESubscription>> {
    return this.http.put(this.resourceUrl, iWESubscription, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<IWESubscription>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<IWESubscription[]>> {
    const options = createRequestOption(req);
    return this.http.get<IWESubscription[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
