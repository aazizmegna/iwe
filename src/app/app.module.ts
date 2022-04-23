import {HttpClient, HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {IonicModule, IonicRouteStrategy, Platform} from '@ionic/angular';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {NgxWebstorageModule} from 'ngx-webstorage';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthExpiredInterceptor} from './interceptors/auth-expired.interceptor';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import {BookingProvider} from './pages/home-tab/booking/booking.provider';
import {IonicImageLoader} from 'ionic-image-loader';
import {WebView} from '@ionic-native/ionic-webview/ngx';
import {InjectableRxStompConfig, RxStompService, rxStompServiceFactory, StompService} from '@stomp/ng2-stompjs';
import {stompConfig} from './pages/home-tab/chat/stomp-config';
import {DeviceAccounts} from '@awesome-cordova-plugins/device-accounts/ngx';
import { WonderPush } from '@awesome-cordova-plugins/wonderpush/ngx';

declare module '@angular/core' {
  interface ModuleWithProviders<T = any> {
    ngModule: Type<T>;
    providers?: Provider[];
  }
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    IonicModule.forRoot(),
    IonicImageLoader.forRoot(),
    NgxWebstorageModule.forRoot({prefix: 'jhi', separator: '-'}),
    AppRoutingModule,
  ],
  providers: [
    BookingProvider,
    StatusBar,
    SplashScreen,
    StompService,
    DeviceAccounts,
    WonderPush,
    {
      provide: InjectableRxStompConfig,
      useValue: stompConfig,
    },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig],
    },
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthExpiredInterceptor,
      multi: true,
    },
    WebView
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
