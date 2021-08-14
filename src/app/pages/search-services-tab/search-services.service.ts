import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import {SearchServicesModel} from './search-services.model';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

type EntityArrayResponseType = HttpResponse<SearchServicesModel[]>;

export interface Search {
  price?: number;
}

@Injectable({ providedIn: 'root' })
export class SearchServicesService {
  private resourceUrl = ApiService.API_URL + '/services';
  public resourceSearchUrlByPrice = ApiService.API_URL + '/_search/servicesByPrice';
  public resourceSearchUrlByLocation = ApiService.API_URL + '/_search/servicesByLocation';

  constructor(protected http: HttpClient) {}

  find(id: number): Observable<HttpResponse<SearchServicesModel>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<SearchServicesModel[]>(this.resourceUrl , { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  searchByPrice(price: number): Observable<EntityArrayResponseType> {
    const options = createRequestOption({price});
    return this.http
      .get<SearchServicesModel[]>(this.resourceSearchUrlByPrice, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  searchByLocation(location: string): Observable<EntityArrayResponseType> {
    const options = createRequestOption({location});
    return this.http
      .get<SearchServicesModel[]>(this.resourceSearchUrlByLocation, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((service: SearchServicesModel) => {
        service.timePosted = service.timePosted ? moment(service.timePosted) : undefined;
      });
    }
    return res;
  }
}
