import { Component, OnInit } from '@angular/core';
import { Feed } from './feed.model';
import { FeedService } from './feed.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-feed-detail',
  templateUrl: 'feed-detail.html',
})
export class FeedDetailPage implements OnInit {
  feed: Feed = {};

  constructor(
    private navController: NavController,
    private feedService: FeedService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.feed = response.data;
    });
  }

  open(item: Feed) {
    this.navController.navigateForward('/tabs/entities/feed/' + item.id + '/edit');
  }

  async deleteModal(item: Feed) {
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
            this.feedService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/feed');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
