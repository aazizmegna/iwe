import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { MarketingPost } from './marketing-post.model';
import { MarketingPostService } from './marketing-post.service';

@Component({
  selector: 'page-marketing-post',
  templateUrl: 'marketing-post.html',
})
export class MarketingPostPage {
  marketingPosts: MarketingPost[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private marketingPostService: MarketingPostService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.marketingPosts = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.marketingPostService
      .query()
      .pipe(
        filter((res: HttpResponse<MarketingPost[]>) => res.ok),
        map((res: HttpResponse<MarketingPost[]>) => res.body)
      )
      .subscribe(
        (response: MarketingPost[]) => {
          this.marketingPosts = response;
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

  trackId(index: number, item: MarketingPost) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/marketing-post/new');
  }

  edit(item: IonItemSliding, marketingPost: MarketingPost) {
    this.navController.navigateForward('/tabs/entities/marketing-post/' + marketingPost.id + '/edit');
    item.close();
  }

  async delete(marketingPost) {
    this.marketingPostService.delete(marketingPost.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'MarketingPost deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(marketingPost: MarketingPost) {
    this.navController.navigateForward('/tabs/entities/marketing-post/' + marketingPost.id + '/view');
  }
}
