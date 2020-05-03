import { Component, OnInit } from '@angular/core';
import { PicturePost } from './picture-post.model';
import { PicturePostService } from './picture-post.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-picture-post-detail',
  templateUrl: 'picture-post-detail.html',
})
export class PicturePostDetailPage implements OnInit {
  picturePost: PicturePost = {};

  constructor(
    private navController: NavController,
    private picturePostService: PicturePostService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.picturePost = response.data;
    });
  }

  open(item: PicturePost) {
    this.navController.navigateForward('/tabs/entities/picture-post/' + item.id + '/edit');
  }

  async deleteModal(item: PicturePost) {
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
            this.picturePostService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/picture-post');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
