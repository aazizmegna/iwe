import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ServiceConsumer } from './service-consumer.model';
import { ServiceConsumerService } from './service-consumer.service';

@Component({
  selector: 'page-service-consumer',
  templateUrl: 'service-consumer.html',
})
export class ServiceConsumerPage {
  serviceConsumers: ServiceConsumer[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private serviceConsumerService: ServiceConsumerService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.serviceConsumers = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.serviceConsumerService
      .query()
      .pipe(
        filter((res: HttpResponse<ServiceConsumer[]>) => res.ok),
        map((res: HttpResponse<ServiceConsumer[]>) => res.body)
      )
      .subscribe(
        (response: ServiceConsumer[]) => {
          this.serviceConsumers = response;
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

  trackId(index: number, item: ServiceConsumer) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/service-consumer/new');
  }

  edit(item: IonItemSliding, serviceConsumer: ServiceConsumer) {
    this.navController.navigateForward('/tabs/entities/service-consumer/' + serviceConsumer.id + '/edit');
    item.close();
  }

  async delete(serviceConsumer) {
    this.serviceConsumerService.delete(serviceConsumer.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'ServiceConsumer deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(serviceConsumer: ServiceConsumer) {
    this.navController.navigateForward('/tabs/entities/service-consumer/' + serviceConsumer.id + '/view');
  }
}
