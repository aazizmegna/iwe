import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { SubscriptionSpecification } from './subscription-specification.model';

@Injectable({ providedIn: 'root' })
export class SubscriptionSpecificationService {
  private resourceUrl = ApiService.API_URL + '/subscription-specifications';

  constructor(protected http: HttpClient) {}

  create(subscriptionSpecification: SubscriptionSpecification): Observable<HttpResponse<SubscriptionSpecification>> {
    return this.http.post<SubscriptionSpecification>(this.resourceUrl, subscriptionSpecification, { observe: 'response' });
  }

  update(subscriptionSpecification: SubscriptionSpecification): Observable<HttpResponse<SubscriptionSpecification>> {
    return this.http.put(this.resourceUrl, subscriptionSpecification, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<SubscriptionSpecification>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<SubscriptionSpecification[]>> {
    const options = createRequestOption(req);
    return this.http.get<SubscriptionSpecification[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
