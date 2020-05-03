import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Like } from './like.model';

@Injectable({ providedIn: 'root' })
export class LikeService {
  private resourceUrl = ApiService.API_URL + '/likes';

  constructor(protected http: HttpClient) {}

  create(like: Like): Observable<HttpResponse<Like>> {
    return this.http.post<Like>(this.resourceUrl, like, { observe: 'response' });
  }

  update(like: Like): Observable<HttpResponse<Like>> {
    return this.http.put(this.resourceUrl, like, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Like>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Like[]>> {
    const options = createRequestOption(req);
    return this.http.get<Like[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
