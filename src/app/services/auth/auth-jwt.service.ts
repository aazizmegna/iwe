import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ApiService} from '../api/api.service';
import {User} from '../user/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthServerProvider {
  public user: User;

  constructor(private http: HttpClient, private $localStorage: LocalStorageService, private $sessionStorage: SessionStorageService) {
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

  async fetchUserByLogin(login: string): Promise<void> {
    const user = await this.http.get<User>(ApiService.API_URL + '/users/' + login, {
      observe: 'response'
    }).toPromise();
    this.user = user.body;
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
    this.$localStorage.store('login', email);

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
