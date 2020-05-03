import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Like } from './like.model';
import { LikeService } from './like.service';

@Component({
  selector: 'page-like',
  templateUrl: 'like.html',
})
export class LikePage {
  likes: Like[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private likeService: LikeService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.likes = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.likeService
      .query()
      .pipe(
        filter((res: HttpResponse<Like[]>) => res.ok),
        map((res: HttpResponse<Like[]>) => res.body)
      )
      .subscribe(
        (response: Like[]) => {
          this.likes = response;
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

  trackId(index: number, item: Like) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/like/new');
  }

  edit(item: IonItemSliding, like: Like) {
    this.navController.navigateForward('/tabs/entities/like/' + like.id + '/edit');
    item.close();
  }

  async delete(like) {
    this.likeService.delete(like.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Like deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(like: Like) {
    this.navController.navigateForward('/tabs/entities/like/' + like.id + '/view');
  }
}
