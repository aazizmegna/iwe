import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ApiService} from '../api/api.service';
import {User} from '../user/user.model';
import {ServiceProviderService} from '../../pages/entities/service-provider';
import {ServiceConsumerService} from '../../pages/entities/service-consumer';

@Injectable({
  providedIn: 'root',
})
export class AuthServerProvider {
  public user: User;

  constructor(private http: HttpClient, private $localStorage: LocalStorageService,
              private $sessionStorage: SessionStorageService,
              private serviceProviderService: ServiceProviderService,
              private serviceConsumerService: ServiceConsumerService) {
  }

  getToken() {
    return this.$localStorage.retrieve('authenticationToken') || this.$sessionStorage.retrieve('authenticationToken');
  }

  login(credentials): any {
    const data = {
      username: credentials.username.trim(),
      password: credentials.password,
      rememberMe: credentials.rememberMe,
    };

    this.$localStorage.store('email', credentials.username.trim());



    // return this.http.post(ApiService.API_URL + '/authenticate', data, {observe: 'response'}).pipe(map(authenticateSuccess.bind(this)));

    // function authenticateSuccess(resp) {
    //   const bearerToken = resp.headers.get('Authorization');
    //   if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
    //     const jwt = bearerToken.slice(7, bearerToken.length);
    //     this.storeAuthenticationToken(jwt, credentials.rememberMe, credentials.username.trim());
    //     return jwt;
    //   }
    // }
  }



  async fetchUserByLogin(email: string): Promise<void> {
    // const user = await this.http.get<User>(ApiService.API_URL + '/users/' + login, {
    //   observe: 'response'
    // }).toPromise();
    // // this.user = user.body;
    const provider = await this.serviceProviderService.findByUserEmail(email).toPromise();
    const consumer =  await this.serviceConsumerService.findByUserEmail(email).toPromise();
    if (consumer.body && !provider.body) {
      this.user = consumer.body.user;
    } else if (!consumer.body && provider.body) {
      this.user = provider.body.user;
    }
  }

  loginWithToken(jwt, rememberMe) {
    if (jwt) {
      this.storeAuthenticationToken(jwt, rememberMe);
      return Promise.resolve(jwt);
    } else {
      return Promise.reject('auth-jwt-service Promise reject'); // Put appropriate error message here
    }
  }

  storeAuthenticationToken(jwt, rememberMe, email?: string) {
    this.$localStorage.store('email', email);

    if (rememberMe) {
      this.$localStorage.store('authenticationToken', jwt);
    } else {
      this.$sessionStorage.store('authenticationToken', jwt);
    }
  }

  logout(): Observable<any> {
    return new Observable((observer) => {
      this.$localStorage.clear('authenticationToken');
      this.$sessionStorage.clear('authenticationToken');
      observer.complete();
    });
  }
}
