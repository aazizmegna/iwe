import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Transaction } from './transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private resourceUrl = ApiService.API_URL + '/transactions';

  constructor(protected http: HttpClient) {}

  create(transaction: Transaction): Observable<HttpResponse<Transaction>> {
    return this.http.post<Transaction>(this.resourceUrl, transaction, { observe: 'response' });
  }

  update(transaction: Transaction): Observable<HttpResponse<Transaction>> {
    return this.http.put(this.resourceUrl, transaction, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Transaction>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Transaction[]>> {
    const options = createRequestOption(req);
    return this.http.get<Transaction[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
