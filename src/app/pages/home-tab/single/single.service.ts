import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import {SearchServicesModel} from '../../search-services-tab/search-services.model';
import {ServiceProvider} from '../../entities/service-provider';

type EntityArrayResponseType = HttpResponse<SearchServicesModel[]>;

export interface Search {
  query: string;
}

@Injectable({ providedIn: 'root' })
export class SingleService {
  private resourceUrl = ApiService.API_URL + '/provider-services';

  constructor(protected http: HttpClient) {}

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<SearchServicesModel[]>(this.resourceUrl + '/' + req, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => res));
  }

  find(id: number): Observable<HttpResponse<ServiceProvider>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
