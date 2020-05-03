import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Feed } from './feed.model';
import { FeedService } from './feed.service';

@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {
  feeds: Feed[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private feedService: FeedService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.feeds = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.feedService
      .query()
      .pipe(
        filter((res: HttpResponse<Feed[]>) => res.ok),
        map((res: HttpResponse<Feed[]>) => res.body)
      )
      .subscribe(
        (response: Feed[]) => {
          this.feeds = response;
          if (typeof refresher !== 'undefined') {
            setTimeout(() => {
              refresher.target.complete();
            }, 750);
          }
        },
        async (error) => {
          console.error(error);
          const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
          toast.present();
        }
      );
  }

  trackId(index: number, item: Feed) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/feed/new');
  }

  edit(item: IonItemSliding, feed: Feed) {
    this.navController.navigateForward('/tabs/entities/feed/' + feed.id + '/edit');
    item.close();
  }

  async delete(feed) {
    this.feedService.delete(feed.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Feed deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(feed: Feed) {
    this.navController.navigateForward('/tabs/entities/feed/' + feed.id + '/view');
  }
}
