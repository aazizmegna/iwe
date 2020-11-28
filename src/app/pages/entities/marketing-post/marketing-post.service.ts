import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { MarketingPost } from './marketing-post.model';

@Injectable({ providedIn: 'root' })
export class MarketingPostService {
  private resourceUrl = ApiService.API_URL + '/marketing-posts';

  constructor(protected http: HttpClient) {}

  create(marketingPost: MarketingPost): Observable<HttpResponse<MarketingPost>> {
    return this.http.post<MarketingPost>(this.resourceUrl, marketingPost, { observe: 'response' });
  }

  update(marketingPost: MarketingPost): Observable<HttpResponse<MarketingPost>> {
    return this.http.put(this.resourceUrl, marketingPost, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<MarketingPost>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<MarketingPost[]>> {
    const options = createRequestOption(req);
    return this.http.get<MarketingPost[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
