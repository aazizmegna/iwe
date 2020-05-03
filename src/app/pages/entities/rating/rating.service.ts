import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Rating } from './rating.model';

@Injectable({ providedIn: 'root' })
export class RatingService {
  private resourceUrl = ApiService.API_URL + '/ratings';

  constructor(protected http: HttpClient) {}

  create(rating: Rating): Observable<HttpResponse<Rating>> {
    return this.http.post<Rating>(this.resourceUrl, rating, { observe: 'response' });
  }

  update(rating: Rating): Observable<HttpResponse<Rating>> {
    return this.http.put(this.resourceUrl, rating, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Rating>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Rating[]>> {
    const options = createRequestOption(req);
    return this.http.get<Rating[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
