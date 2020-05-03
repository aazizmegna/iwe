import { Component, OnInit } from '@angular/core';
import { Like } from './like.model';
import { LikeService } from './like.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-like-detail',
  templateUrl: 'like-detail.html',
})
export class LikeDetailPage implements OnInit {
  like: Like = {};

  constructor(
    private navController: NavController,
    private likeService: LikeService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.like = response.data;
    });
  }

  open(item: Like) {
    this.navController.navigateForward('/tabs/entities/like/' + item.id + '/edit');
  }

  async deleteModal(item: Like) {
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
            this.likeService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/like');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
