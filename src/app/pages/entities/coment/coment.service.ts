import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Coment } from './coment.model';

@Injectable({ providedIn: 'root' })
export class ComentService {
  private resourceUrl = ApiService.API_URL + '/coments';

  constructor(protected http: HttpClient) {}

  create(coment: Coment): Observable<HttpResponse<Coment>> {
    return this.http.post<Coment>(this.resourceUrl, coment, { observe: 'response' });
  }

  update(coment: Coment): Observable<HttpResponse<Coment>> {
    return this.http.put(this.resourceUrl, coment, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Coment>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Coment[]>> {
    const options = createRequestOption(req);
    return this.http.get<Coment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
