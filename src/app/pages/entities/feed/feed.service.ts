import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Feed } from './feed.model';

@Injectable({ providedIn: 'root' })
export class FeedService {
  private resourceUrl = ApiService.API_URL + '/feeds';

  constructor(protected http: HttpClient) {}

  create(feed: Feed): Observable<HttpResponse<Feed>> {
    return this.http.post<Feed>(this.resourceUrl, feed, { observe: 'response' });
  }

  update(feed: Feed): Observable<HttpResponse<Feed>> {
    return this.http.put(this.resourceUrl, feed, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Feed>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Feed[]>> {
    const options = createRequestOption(req);
    return this.http.get<Feed[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
