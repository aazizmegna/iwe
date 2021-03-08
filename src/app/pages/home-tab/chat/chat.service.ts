import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiService} from 'src/app/services/api/api.service';
import {ServiceProvider} from '../../entities/service-provider';
import {Message} from '../../entities/message';
import {createRequestOption} from '../../../shared';
import {SearchServicesModel} from '../../search-services-tab/search-services.model';
import {map} from 'rxjs/operators';
type EntityArrayResponseType = HttpResponse<Message[]>;


@Injectable({providedIn: 'root'})
export class ChatService {
  private resourceUrl = ApiService.API_URL + '/service-providers';
  private messagesResourceUrl = ApiService.API_URL + '/messages';

  constructor(protected http: HttpClient) {
  }

  find(id: number): Observable<HttpResponse<ServiceProvider>> {
    return this.http.get(`${this.resourceUrl}/${id}`, {observe: 'response'});
  }

  findChatMessages(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Message[]>(this.resourceUrl + '/' + req, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => res));
  }
}
