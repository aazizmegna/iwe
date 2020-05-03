import { Component, OnInit } from '@angular/core';
import { IWESubscription } from './iwe-subscription.model';
import { IWESubscriptionService } from './iwe-subscription.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-iwe-subscription-detail',
  templateUrl: 'iwe-subscription-detail.html',
})
export class IWESubscriptionDetailPage implements OnInit {
  iWESubscription: IWESubscription = {};

  constructor(
    private navController: NavController,
    private iWESubscriptionService: IWESubscriptionService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.iWESubscription = response.data;
    });
  }

  open(item: IWESubscription) {
    this.navController.navigateForward('/tabs/entities/iwe-subscription/' + item.id + '/edit');
  }

  async deleteModal(item: IWESubscription) {
    const alert = await this.alertController.create({
      header: 'Confirm the deletion?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            this.iWESubscriptionService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/iwe-subscription');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
