import {Component} from '@angular/core';
import {NavController, ToastController, Platform, IonItemSliding} from '@ionic/angular';
import {filter, map} from 'rxjs/operators';
import {HttpResponse} from '@angular/common/http';
import {JhiDataUtils} from 'ng-jhipster';
import {ActivatedRoute} from '@angular/router';
import {SearchServicesService} from './search-services.service';
import {SearchServicesModel} from './search-services.model';

@Component({
  selector: 'page-search-services',
  templateUrl: 'search-services.page.html',
})
export class SearchServicesPage {
  searchServicesModels: SearchServicesModel[];
  location: string;
  price: number;

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private searchServicesService: SearchServicesService,
    private toastCtrl: ToastController,
    public plt: Platform,
    protected activatedRoute: ActivatedRoute
  ) {
    this.searchServicesModels = [];
    this.location =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams.search
        ? this.activatedRoute.snapshot.queryParams.search
        : '';
    this.price =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams.search
        ? this.activatedRoute.snapshot.queryParams.search
        : '';
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    if (this.price) {
      this.searchServicesService
        .searchByPrice(
           this.price,
        ).pipe(
        filter((res: HttpResponse<SearchServicesModel[]>) => res.ok),
        map((res: HttpResponse<SearchServicesModel[]>) => res.body)
      ).subscribe(
        (response: SearchServicesModel[]) => {
          this.searchServicesModels = response;
          if (typeof refresher !== 'undefined') {
            setTimeout(() => {
              refresher.target.complete();
            }, 750);
          }
        },
        async (error) => {
          console.error(error);
          const toast = await this.toastCtrl.create({message: 'Failed to load data', duration: 2000, position: 'middle'});
          toast.present();
        }
      );
      return;
    }
    if (this.location) {
      this.searchServicesService
        .searchByLocation(
          this.location,
        ).pipe(
        filter((res: HttpResponse<SearchServicesModel[]>) => res.ok),
        map((res: HttpResponse<SearchServicesModel[]>) => res.body)
      ).subscribe(
        (response: SearchServicesModel[]) => {
          this.searchServicesModels = response;
          if (typeof refresher !== 'undefined') {
            setTimeout(() => {
              refresher.target.complete();
            }, 750);
          }
        },
        async (error) => {
          console.error(error);
          const toast = await this.toastCtrl.create({message: 'Failed to load data', duration: 2000, position: 'middle'});
          toast.present();
        }
      );
      return;
    }

    this.searchServicesService
      .query()
      .pipe(
        filter((res: HttpResponse<SearchServicesModel[]>) => res.ok),
        map((res: HttpResponse<SearchServicesModel[]>) => res.body)
      )
      .subscribe(
        (response: SearchServicesModel[]) => {
          this.searchServicesModels = response;
          if (typeof refresher !== 'undefined') {
            setTimeout(() => {
              refresher.target.complete();
            }, 750);
          }
        },
        async (error) => {
          console.error(error);
          const toast = await this.toastCtrl.create({message: 'Failed to load data', duration: 2000, position: 'middle'});
          toast.present();
        }
      );
  }

  trackId(index: number, item: SearchServicesModel) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  openProfile(serviceProvider: SearchServicesModel) {
    this.navController.navigateForward('/tabs/entities/service-provider/' + serviceProvider.id + '/view');
  }

  searchByLocation(location: string): void {
    this.location = location;
    this.loadAll();
  }

  searchByPrice(price: number): void {
    this.price = price;
    this.loadAll();
  }
}
