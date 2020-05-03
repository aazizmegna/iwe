import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Invitation } from './invitation.model';

@Injectable({ providedIn: 'root' })
export class InvitationService {
  private resourceUrl = ApiService.API_URL + '/invitations';

  constructor(protected http: HttpClient) {}

  create(invitation: Invitation): Observable<HttpResponse<Invitation>> {
    return this.http.post<Invitation>(this.resourceUrl, invitation, { observe: 'response' });
  }

  update(invitation: Invitation): Observable<HttpResponse<Invitation>> {
    return this.http.put(this.resourceUrl, invitation, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Invitation>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Invitation[]>> {
    const options = createRequestOption(req);
    return this.http.get<Invitation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
