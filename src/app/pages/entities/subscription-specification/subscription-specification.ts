import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { SubscriptionSpecification } from './subscription-specification.model';
import { SubscriptionSpecificationService } from './subscription-specification.service';

@Component({
  selector: 'page-subscription-specification',
  templateUrl: 'subscription-specification.html',
})
export class SubscriptionSpecificationPage {
  subscriptionSpecifications: SubscriptionSpecification[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private subscriptionSpecificationService: SubscriptionSpecificationService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.subscriptionSpecifications = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.subscriptionSpecificationService
      .query()
      .pipe(
        filter((res: HttpResponse<SubscriptionSpecification[]>) => res.ok),
        map((res: HttpResponse<SubscriptionSpecification[]>) => res.body)
      )
      .subscribe(
        (response: SubscriptionSpecification[]) => {
          this.subscriptionSpecifications = response;
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

  trackId(index: number, item: SubscriptionSpecification) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/subscription-specification/new');
  }

  edit(item: IonItemSliding, subscriptionSpecification: SubscriptionSpecification) {
    this.navController.navigateForward('/tabs/entities/subscription-specification/' + subscriptionSpecification.id + '/edit');
    item.close();
  }

  async delete(subscriptionSpecification) {
    this.subscriptionSpecificationService.delete(subscriptionSpecification.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'SubscriptionSpecification deleted successfully.',
          duration: 3000,
          position: 'middle',
        });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(subscriptionSpecification: SubscriptionSpecification) {
    this.navController.navigateForward('/tabs/entities/subscription-specification/' + subscriptionSpecification.id + '/view');
  }
}
