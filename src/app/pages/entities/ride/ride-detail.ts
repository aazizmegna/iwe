import { Component, OnInit } from '@angular/core';
import { Ride } from './ride.model';
import { RideService } from './ride.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-ride-detail',
  templateUrl: 'ride-detail.html',
})
export class RideDetailPage implements OnInit {
  ride: Ride = {};

  constructor(
    private navController: NavController,
    private rideService: RideService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.ride = response.data;
    });
  }

  open(item: Ride) {
    this.navController.navigateForward('/tabs/entities/ride/' + item.id + '/edit');
  }

  async deleteModal(item: Ride) {
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
            this.rideService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/ride');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
