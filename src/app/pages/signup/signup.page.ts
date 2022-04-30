import { Component, OnInit } from '@angular/core';
import {AlertController, NavController, ToastController} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/services/user/user.service';
import {Router} from '@angular/router';
import {CognitoServiceProvider} from '../../providers/cognito-service/cognito-service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  // The account fields for the signup form
  public account: {
    login: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    langKey: string;
    oneSignalPlayerId: string;
  } = {
    login: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    langKey: 'en',
    oneSignalPlayerId: '',
  };

  // Our translated text strings
  private signupErrorString: string;
  private signupSuccessString: string;
  private existingUserError: string;
  private invalidPasswordError: string;

  constructor(
    public navController: NavController,
    public userService: UserService,
    public toastController: ToastController,
    public translateService: TranslateService,
    public route: Router,
    public CognitoService: CognitoServiceProvider,
    public alertController: AlertController,

  ) {
    this.translateService.get(['SIGNUP_ERROR', 'SIGNUP_SUCCESS', 'EXISTING_USER_ERROR', 'INVALID_PASSWORD_ERROR']).subscribe((values) => {
      this.signupErrorString = values.SIGNUP_ERROR;
      this.signupSuccessString = values.SIGNUP_SUCCESS;
      this.existingUserError = values.EXISTING_USER_ERROR;
      this.invalidPasswordError = values.INVALID_PASSWORD_ERROR;
    });
  }

  ngOnInit() {}

  register() {
    this.CognitoService.signUp(this.account.email, this.account.password).then(
     async (res) => {
        await this.promptVerificationCode();
      },
      async (err) => {
        console.log(err);
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
      }
    );
  }

  async promptVerificationCode() {
    const alert = await this.alertController.create({
      header: 'Enter your verification code',
      subHeader: 'a code was send to your email inbox',
      inputs: [
        {
          name: 'VerificationCode',
          placeholder: 'Verification Code'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Verify',
          handler: data => {
            this.verifyUser(data.VerificationCode);
          }
        }
      ]
    });
    await alert.present();
  }

  verifyUser(verificationCode) {
    this.CognitoService.confirmUser(verificationCode, this.account.email).then(
      async (res) => {
        await this.navController.navigateRoot('/tabs/home');
        console.log(res);
      },
      err => {
        alert(err.message);
      }
    );
  }
}
