import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { IWESubscription } from './iwe-subscription.model';
import { IWESubscriptionService } from './iwe-subscription.service';

@Component({
  selector: 'page-iwe-subscription',
  templateUrl: 'iwe-subscription.html',
})
export class IWESubscriptionPage {
  iWESubscriptions: IWESubscription[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private iWESubscriptionService: IWESubscriptionService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.iWESubscriptions = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.iWESubscriptionService
      .query()
      .pipe(
        filter((res: HttpResponse<IWESubscription[]>) => res.ok),
        map((res: HttpResponse<IWESubscription[]>) => res.body)
      )
      .subscribe(
        (response: IWESubscription[]) => {
          this.iWESubscriptions = response;
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

  trackId(index: number, item: IWESubscription) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/iwe-subscription/new');
  }

  edit(item: IonItemSliding, iWESubscription: IWESubscription) {
    this.navController.navigateForward('/tabs/entities/iwe-subscription/' + iWESubscription.id + '/edit');
    item.close();
  }

  async delete(iWESubscription) {
    this.iWESubscriptionService.delete(iWESubscription.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'IWESubscription deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(iWESubscription: IWESubscription) {
    this.navController.navigateForward('/tabs/entities/iwe-subscription/' + iWESubscription.id + '/view');
  }
}
