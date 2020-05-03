import { Component, OnInit } from '@angular/core';
import { Rating } from './rating.model';
import { RatingService } from './rating.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-rating-detail',
  templateUrl: 'rating-detail.html',
})
export class RatingDetailPage implements OnInit {
  rating: Rating = {};

  constructor(
    private navController: NavController,
    private ratingService: RatingService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.rating = response.data;
    });
  }

  open(item: Rating) {
    this.navController.navigateForward('/tabs/entities/rating/' + item.id + '/edit');
  }

  async deleteModal(item: Rating) {
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
            this.ratingService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/rating');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
