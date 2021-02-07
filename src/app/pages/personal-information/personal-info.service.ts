import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import {User} from '../../services/user/user.model';

@Injectable({ providedIn: 'root' })
export class PersonalInfoService {
  private resourceUrl = ApiService.API_URL + '/account';

  constructor(protected http: HttpClient) {}

  create(user: User): Observable<HttpResponse<User>> {
    return this.http.post<User>(this.resourceUrl, user, { observe: 'response' });
  }

  update(picturePost: User): Observable<HttpResponse<User>> {
    return this.http.put(this.resourceUrl, picturePost, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<User>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
