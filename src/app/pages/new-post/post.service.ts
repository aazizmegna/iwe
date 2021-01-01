import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private resourceUrl = ApiService.API_URL + '/posts';

  constructor(protected http: HttpClient) {}

  create(post: Post): Observable<HttpResponse<Post>> {
    return this.http.post<Post>(this.resourceUrl, post, { observe: 'response' });
  }

  update(post: Post): Observable<HttpResponse<Post>> {
    return this.http.put(this.resourceUrl, post, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Post>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Post[]>> {
    const options = createRequestOption(req);
    return this.http.get<Post[]>(this.resourceUrl, { params: options, observe: 'response' });
  }
}
