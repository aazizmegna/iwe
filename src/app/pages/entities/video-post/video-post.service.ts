import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { VideoPost } from './video-post.model';

@Injectable({ providedIn: 'root' })
export class VideoPostService {
  private resourceUrl = ApiService.API_URL + '/video-posts';

  constructor(protected http: HttpClient) {}

  create(videoPost: VideoPost): Observable<HttpResponse<VideoPost>> {
    return this.http.post<VideoPost>(this.resourceUrl, videoPost, { observe: 'response' });
  }

  update(videoPost: VideoPost): Observable<HttpResponse<VideoPost>> {
    return this.http.put(this.resourceUrl, videoPost, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<VideoPost>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<VideoPost[]>> {
    const options = createRequestOption(req);
    return this.http.get<VideoPost[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
