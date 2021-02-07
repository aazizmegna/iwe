import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Booking } from './booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private resourceUrl = ApiService.API_URL + '/bookings';

  constructor(protected http: HttpClient) {}

  create(booking: Booking): Observable<HttpResponse<Booking>> {
    return this.http.post<Booking>(this.resourceUrl, booking, { observe: 'response' });
  }

  update(booking: Booking): Observable<HttpResponse<Booking>> {
    return this.http.put(this.resourceUrl, booking, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Booking>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Booking[]>> {
    const options = createRequestOption(req);
    return this.http.get<Booking[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  queryByServiceConsumerId(id?: any): Observable<HttpResponse<Booking[]>> {
    const options = createRequestOption(id);
    return this.http.get<Booking[]>(`${this.resourceUrl}/consumer-bookings/${id}`, { params: options, observe: 'response' });
  }

  queryByServiceProviderId(id?: any): Observable<HttpResponse<Booking[]>> {
    const options = createRequestOption(id);
    return this.http.get<Booking[]>(`${this.resourceUrl}/provider-bookings/${id}`, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
