import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Connection } from './connection.model';

@Injectable({ providedIn: 'root' })
export class ConnectionService {
  private resourceUrl = ApiService.API_URL + '/connections';

  constructor(protected http: HttpClient) {}

  create(connection: Connection): Observable<HttpResponse<Connection>> {
    return this.http.post<Connection>(this.resourceUrl, connection, { observe: 'response' });
  }

  update(connection: Connection): Observable<HttpResponse<Connection>> {
    return this.http.put(this.resourceUrl, connection, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Connection>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Connection[]>> {
    const options = createRequestOption(req);
    return this.http.get<Connection[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
