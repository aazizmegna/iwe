import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Message } from './message.model';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private resourceUrl = ApiService.API_URL + '/messages';

  constructor(protected http: HttpClient) {}

  create(message: Message): Observable<HttpResponse<Message>> {
    return this.http.post<Message>(this.resourceUrl, message, { observe: 'response' });
  }

  update(message: Message): Observable<HttpResponse<Message>> {
    return this.http.put(this.resourceUrl, message, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Message>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Message[]>> {
    const options = createRequestOption(req);
    return this.http.get<Message[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
