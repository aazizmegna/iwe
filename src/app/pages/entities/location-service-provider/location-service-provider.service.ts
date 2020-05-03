import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { LocationServiceProvider } from './location-service-provider.model';

@Injectable({ providedIn: 'root' })
export class LocationServiceProviderService {
  private resourceUrl = ApiService.API_URL + '/location-service-providers';

  constructor(protected http: HttpClient) {}

  create(locationServiceProvider: LocationServiceProvider): Observable<HttpResponse<LocationServiceProvider>> {
    return this.http.post<LocationServiceProvider>(this.resourceUrl, locationServiceProvider, { observe: 'response' });
  }

  update(locationServiceProvider: LocationServiceProvider): Observable<HttpResponse<LocationServiceProvider>> {
    return this.http.put(this.resourceUrl, locationServiceProvider, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<LocationServiceProvider>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<LocationServiceProvider[]>> {
    const options = createRequestOption(req);
    return this.http.get<LocationServiceProvider[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
