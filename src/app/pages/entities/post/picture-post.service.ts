import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { PicturePost } from './picture-post.model';

@Injectable({ providedIn: 'root' })
export class PicturePostService {
  private resourceUrl = ApiService.API_URL;

  constructor(protected http: HttpClient) {}

  create(picturePost: PicturePost): Observable<HttpResponse<PicturePost>> {
    return this.http.post<PicturePost>(`${this.resourceUrl}/picture-posts`, picturePost, { observe: 'response' });
  }

  update(picturePost: PicturePost): Observable<HttpResponse<PicturePost>> {
    return this.http.put(`${this.resourceUrl}/picture-posts`, picturePost, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<PicturePost>> {
    return this.http.get(`${this.resourceUrl}/findPostById/?id=${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<PicturePost[]>> {
    const options = createRequestOption(req);
    return this.http.get<PicturePost[]>(`${this.resourceUrl}/listAllPicturePosts`, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
