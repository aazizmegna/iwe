import { Component, OnInit } from '@angular/core';
import { SubscriptionSpecification } from './subscription-specification.model';
import { SubscriptionSpecificationService } from './subscription-specification.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-subscription-specification-detail',
  templateUrl: 'subscription-specification-detail.html',
})
export class SubscriptionSpecificationDetailPage implements OnInit {
  subscriptionSpecification: SubscriptionSpecification = {};

  constructor(
    private navController: NavController,
    private subscriptionSpecificationService: SubscriptionSpecificationService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.subscriptionSpecification = response.data;
    });
  }

  open(item: SubscriptionSpecification) {
    this.navController.navigateForward('/tabs/entities/subscription-specification/' + item.id + '/edit');
  }

  async deleteModal(item: SubscriptionSpecification) {
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
            this.subscriptionSpecificationService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/subscription-specification');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
