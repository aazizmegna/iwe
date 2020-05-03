import { Component, OnInit } from '@angular/core';
import { TextPost } from './text-post.model';
import { TextPostService } from './text-post.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-text-post-detail',
  templateUrl: 'text-post-detail.html',
})
export class TextPostDetailPage implements OnInit {
  textPost: TextPost = {};

  constructor(
    private navController: NavController,
    private textPostService: TextPostService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.textPost = response.data;
    });
  }

  open(item: TextPost) {
    this.navController.navigateForward('/tabs/entities/text-post/' + item.id + '/edit');
  }

  async deleteModal(item: TextPost) {
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
            this.textPostService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/text-post');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
