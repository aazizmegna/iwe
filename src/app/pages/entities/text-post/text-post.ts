import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { TextPost } from './text-post.model';
import { TextPostService } from './text-post.service';

@Component({
  selector: 'page-text-post',
  templateUrl: 'text-post.html',
})
export class TextPostPage {
  textPosts: TextPost[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private textPostService: TextPostService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.textPosts = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.textPostService
      .query()
      .pipe(
        filter((res: HttpResponse<TextPost[]>) => res.ok),
        map((res: HttpResponse<TextPost[]>) => res.body)
      )
      .subscribe(
        (response: TextPost[]) => {
          this.textPosts = response;
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

  trackId(index: number, item: TextPost) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/text-post/new');
  }

  edit(item: IonItemSliding, textPost: TextPost) {
    this.navController.navigateForward('/tabs/entities/text-post/' + textPost.id + '/edit');
    item.close();
  }

  async delete(textPost) {
    this.textPostService.delete(textPost.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'TextPost deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(textPost: TextPost) {
    this.navController.navigateForward('/tabs/entities/text-post/' + textPost.id + '/view');
  }
}
