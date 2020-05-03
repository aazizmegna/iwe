import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { ServiceConsumer } from './service-consumer.model';

@Injectable({ providedIn: 'root' })
export class ServiceConsumerService {
  private resourceUrl = ApiService.API_URL + '/service-consumers';

  constructor(protected http: HttpClient) {}

  create(serviceConsumer: ServiceConsumer): Observable<HttpResponse<ServiceConsumer>> {
    return this.http.post<ServiceConsumer>(this.resourceUrl, serviceConsumer, { observe: 'response' });
  }

  update(serviceConsumer: ServiceConsumer): Observable<HttpResponse<ServiceConsumer>> {
    return this.http.put(this.resourceUrl, serviceConsumer, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<ServiceConsumer>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<ServiceConsumer[]>> {
    const options = createRequestOption(req);
    return this.http.get<ServiceConsumer[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
