import { Component, OnInit } from '@angular/core';
import { MarketingPost } from './marketing-post.model';
import { MarketingPostService } from './marketing-post.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-marketing-post-detail',
  templateUrl: 'marketing-post-detail.html',
})
export class MarketingPostDetailPage implements OnInit {
  marketingPost: MarketingPost = {};

  constructor(
    private navController: NavController,
    private marketingPostService: MarketingPostService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.marketingPost = response.data;
    });
  }

  open(item: MarketingPost) {
    this.navController.navigateForward('/tabs/entities/marketing-post/' + item.id + '/edit');
  }

  async deleteModal(item: MarketingPost) {
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
            this.marketingPostService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/marketing-post');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
