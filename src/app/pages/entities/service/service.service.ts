import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Service } from './service.model';

@Injectable({ providedIn: 'root' })
export class ServiceService {
  private resourceUrl = ApiService.API_URL;

  constructor(protected http: HttpClient) {}

  create(service: Service): Observable<HttpResponse<Service>> {
    return this.http.post<Service>(`${this.resourceUrl}/services`, service, { observe: 'response' });
  }

  update(service: Service): Observable<HttpResponse<Service>> {
    return this.http.put(`${this.resourceUrl}/services`, service, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Service>> {
    return this.http.get(`${this.resourceUrl}/findOneServices?id=${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Service[]>> {
    const options = createRequestOption(req);
    return this.http.get<Service[]>(`${this.resourceUrl}/listAllServices`, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
