import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Ride } from './ride.model';

@Injectable({ providedIn: 'root' })
export class RideService {
  private resourceUrl = ApiService.API_URL + '/rides';

  constructor(protected http: HttpClient) {}

  create(ride: Ride): Observable<HttpResponse<Ride>> {
    return this.http.post<Ride>(this.resourceUrl, ride, { observe: 'response' });
  }

  update(ride: Ride): Observable<HttpResponse<Ride>> {
    return this.http.put(this.resourceUrl, ride, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Ride>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Ride[]>> {
    const options = createRequestOption(req);
    return this.http.get<Ride[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
