import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from '../auth/account.service';
import { AuthServerProvider } from '../auth/auth-jwt.service';
import {Account} from '../../../model/account.model';
import {LocalStorageService} from 'ngx-webstorage';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private accountService: AccountService,
    private authServerProvider: AuthServerProvider,
    private translate: TranslateService,
    private $localStorage: LocalStorageService
  ) {}

  async login(credentials: { email: string; password: string; rememberMe: boolean }, callback?) {
    this.$localStorage.store('email', credentials.email.trim());
    await this.authServerProvider.fetchUserByLogin(credentials.email);

    // const cb = callback || function () {};
    // return new Promise( (resolve, reject) => {
    //   this.authServerProvider.login(credentials).subscribe(
    //     (data) => {
    //       this.accountService.identity(true).then((account) => {
    //         // After the login the language will be changed to
    //         // the language selected by the user during his registration
    //         if (account !== null) {
    //           this.translate.use(account.langKey);
    //         }
    //         resolve(data);
    //       });
    //       this.authServerProvider.fetchUserByLogin(credentials.username);
    //       return cb();
    //     },
    //     (err) => {
    //       this.logout();
    //       reject(err);
    //       return cb(err);
    //     }
    //   );
    // });
  }

  loginWithToken(jwt, rememberMe) {
    return this.authServerProvider.loginWithToken(jwt, rememberMe);
  }

  logout() {
    this.authServerProvider.logout().subscribe();
    this.accountService.authenticate(null);
  }
}
