import { Component, OnInit } from '@angular/core';
import { VideoPost } from './video-post.model';
import { VideoPostService } from './video-post.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-video-post-detail',
  templateUrl: 'video-post-detail.html',
})
export class VideoPostDetailPage implements OnInit {
  videoPost: VideoPost = {};

  constructor(
    private navController: NavController,
    private videoPostService: VideoPostService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.videoPost = response.data;
    });
  }

  open(item: VideoPost) {
    this.navController.navigateForward('/tabs/entities/video-post/' + item.id + '/edit');
  }

  async deleteModal(item: VideoPost) {
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
            this.videoPostService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/video-post');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
