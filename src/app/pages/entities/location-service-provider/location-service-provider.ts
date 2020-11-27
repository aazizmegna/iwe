import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { JhiDataUtils } from 'ng-jhipster';
import { LocationServiceProvider } from './location-service-provider.model';
import { LocationServiceProviderService } from './location-service-provider.service';

@Component({
  selector: 'page-location-service-provider',
  templateUrl: 'location-service-provider.html',
})
export class LocationServiceProviderPage {
  locationServiceProviders: LocationServiceProvider[];

  // todo: add pagination

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private locationServiceProviderService: LocationServiceProviderService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.locationServiceProviders = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.locationServiceProviderService
      .query()
      .pipe(
        filter((res: HttpResponse<LocationServiceProvider[]>) => res.ok),
        map((res: HttpResponse<LocationServiceProvider[]>) => res.body)
      )
      .subscribe(
        (response: LocationServiceProvider[]) => {
          this.locationServiceProviders = response;
          if (typeof refresher !== 'undefined') {
            setTimeout(() => {
              refresher.target.complete();
            }, 750);
          }
        },
        async (error) => {
          console.error(error);
          const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
          toast.present();
        }
      );
  }

  trackId(index: number, item: LocationServiceProvider) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  new() {
    this.navController.navigateForward('/tabs/entities/location-service-provider/new');
  }

  edit(item: IonItemSliding, locationServiceProvider: LocationServiceProvider) {
    this.navController.navigateForward('/tabs/entities/location-service-provider/' + locationServiceProvider.id + '/edit');
    item.close();
  }

  async delete(locationServiceProvider) {
    this.locationServiceProviderService.delete(locationServiceProvider.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'LocationServiceProvider deleted successfully.',
          duration: 3000,
          position: 'middle',
        });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(locationServiceProvider: LocationServiceProvider) {
    this.navController.navigateForward('/tabs/entities/location-service-provider/' + locationServiceProvider.id + '/view');
  }
}
