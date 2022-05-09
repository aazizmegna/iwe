import { Component, OnInit } from '@angular/core';
import {AlertController, NavController, ToastController} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from 'src/app/services/login/login.service';
import { Auth } from 'aws-amplify';
import { CognitoServiceProvider } from '../../providers/cognito-service/cognito-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  // The account fields for the login form.
  account: { email: string; password: string; rememberMe: boolean } = {
    email: '',
    password: '',
    rememberMe: false,
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(
    public translateService: TranslateService,
    public loginService: LoginService,
    public toastController: ToastController,
    public navController: NavController,
    public CognitoService: CognitoServiceProvider,
    public alertController: AlertController,
  ) {}

  ngOnInit() {
    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    });
  }

  async facebookLogin() {
    await Auth.federatedSignIn({customProvider: 'Facebook'});
  }

  async googleLogin() {
    await Auth.federatedSignIn({customProvider: 'Google'});
  }

  async doLogin() {
    console.log('in login');
    this.CognitoService.authenticate(this.account.email.trim(), this.account.password)
      .then(async (res) => {
        await this.navController.navigateRoot('/tabs/home');
        await this.loginService.login(this.account);
        console.log(res);
      }, async (err) => {
        const alert = await this.alertController.create({
          header: 'An Error occurred',
          subHeader: err.message,
          buttons: [
            {
              text: 'Retry',
              role: 'cancel',
              handler: data => {
                console.log('Cancel clicked');
              }
            },
          ]
        });
        await alert.present();
        console.log(err);
      });
  }

}
