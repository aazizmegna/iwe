import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Service } from './service.model';
import { ServiceService } from './service.service';

@Component({
  selector: 'page-service',
  templateUrl: 'service.html',
})
export class ServicePage {
  services: Service[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private serviceService: ServiceService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.services = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.serviceService
      .query()
      .pipe(
        filter((res: HttpResponse<Service[]>) => res.ok),
        map((res: HttpResponse<Service[]>) => res.body)
      )
      .subscribe(
        (response: Service[]) => {
          this.services = response;
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

  trackId(index: number, item: Service) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/service/new');
  }

  edit(item: IonItemSliding, service: Service) {
    this.navController.navigateForward('/tabs/entities/service/' + service.id + '/edit');
    item.close();
  }

  async delete(service) {
    this.serviceService.delete(service.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Service deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(service: Service) {
    this.navController.navigateForward('/tabs/entities/service/' + service.id + '/view');
  }
}
