import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { SnapshotPost } from './snapshot-post.model';

@Injectable({ providedIn: 'root' })
export class SnapshotPostService {
  private resourceUrl = ApiService.API_URL + '/snapshot-posts';

  constructor(protected http: HttpClient) {}

  create(snapshotPost: SnapshotPost): Observable<HttpResponse<SnapshotPost>> {
    return this.http.post<SnapshotPost>(this.resourceUrl, snapshotPost, { observe: 'response' });
  }

  update(snapshotPost: SnapshotPost): Observable<HttpResponse<SnapshotPost>> {
    return this.http.put(this.resourceUrl, snapshotPost, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<SnapshotPost>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<SnapshotPost[]>> {
    const options = createRequestOption(req);
    return this.http.get<SnapshotPost[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
