import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { JhiDataUtils } from 'ng-jhipster';
import { ServiceProvider } from './service-provider.model';
import { ServiceProviderService } from './service-provider.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'page-service-provider',
  templateUrl: 'service-provider.html',
})
export class ServiceProviderPage {
  serviceProviders: ServiceProvider[];
  currentSearch: string;


  // todo: add pagination

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private serviceProviderService: ServiceProviderService,
    private toastCtrl: ToastController,
    public plt: Platform,
    protected activatedRoute: ActivatedRoute
  ) {
    this.serviceProviders = [];
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams.search
        ? this.activatedRoute.snapshot.queryParams.search
        : '';
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.serviceProviderService
      .query()
      .pipe(
        filter((res: HttpResponse<ServiceProvider[]>) => res.ok),
        map((res: HttpResponse<ServiceProvider[]>) => res.body)
      )
      .subscribe(
        (response: ServiceProvider[]) => {
          this.serviceProviders = response;
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

  trackId(index: number, item: ServiceProvider) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  new() {
    this.navController.navigateForward('/tabs/entities/service-provider/new');
  }

  edit(item: IonItemSliding, serviceProvider: ServiceProvider) {
    this.navController.navigateForward('/tabs/entities/service-provider/' + serviceProvider.id + '/edit');
    item.close();
  }

  async delete(serviceProvider) {
    this.serviceProviderService.delete(serviceProvider.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'ServiceProvider deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(serviceProvider: ServiceProvider) {
    this.navController.navigateForward('/tabs/entities/service-provider/' + serviceProvider.id + '/view');
  }
}
