import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { TextPost } from './text-post.model';

@Injectable({ providedIn: 'root' })
export class TextPostService {
  private resourceUrl = ApiService.API_URL + '/text-posts';

  constructor(protected http: HttpClient) {}

  create(textPost: TextPost): Observable<HttpResponse<TextPost>> {
    return this.http.post<TextPost>(this.resourceUrl, textPost, { observe: 'response' });
  }

  update(textPost: TextPost): Observable<HttpResponse<TextPost>> {
    return this.http.put(this.resourceUrl, textPost, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<TextPost>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<TextPost[]>> {
    const options = createRequestOption(req);
    return this.http.get<TextPost[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
