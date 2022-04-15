import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { ServiceProvider } from './service-provider.model';

@Injectable({ providedIn: 'root' })
export class ServiceProviderService {
  private resourceUrl = ApiService.API_URL;

  constructor(protected http: HttpClient) {}

  create(serviceProvider: ServiceProvider): Observable<HttpResponse<ServiceProvider>> {
    return this.http.post<ServiceProvider>(`${this.resourceUrl}/service-providers`, serviceProvider, { observe: 'response' });
  }

  update(serviceProvider: ServiceProvider): Observable<HttpResponse<ServiceProvider>> {
    return this.http.put(`${this.resourceUrl}/service-providers`, serviceProvider, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<ServiceProvider>> {
    return this.http.get(`${this.resourceUrl}/findServiceProvider/?id=${id}`, { observe: 'response' });
  }

  findByUserEmail(userEmail: string): Observable<HttpResponse<ServiceProvider>> {
    return this.http.get(`${this.resourceUrl}/findServiceProvidersByEmail/?email=${userEmail}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<ServiceProvider[]>> {
    const options = createRequestOption(req);
    return this.http.get<ServiceProvider[]>(`${this.resourceUrl}/listServiceProviders`, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
