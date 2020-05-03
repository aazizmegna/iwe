import { Component, OnInit } from '@angular/core';
import { LocationServiceProvider } from './location-service-provider.model';
import { LocationServiceProviderService } from './location-service-provider.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-location-service-provider-detail',
  templateUrl: 'location-service-provider-detail.html',
})
export class LocationServiceProviderDetailPage implements OnInit {
  locationServiceProvider: LocationServiceProvider = {};

  constructor(
    private navController: NavController,
    private locationServiceProviderService: LocationServiceProviderService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.locationServiceProvider = response.data;
    });
  }

  open(item: LocationServiceProvider) {
    this.navController.navigateForward('/tabs/entities/location-service-provider/' + item.id + '/edit');
  }

  async deleteModal(item: LocationServiceProvider) {
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
            this.locationServiceProviderService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/location-service-provider');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
