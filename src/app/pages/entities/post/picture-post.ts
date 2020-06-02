import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { JhiDataUtils } from 'ng-jhipster';
import { PicturePost } from './picture-post.model';
import { PicturePostService } from './picture-post.service';

@Component({
  selector: 'page-picture-post',
  templateUrl: 'picture-post.html',
})
export class PicturePostPage {
  picturePosts: PicturePost[];

  // todo: add pagination

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private picturePostService: PicturePostService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.picturePosts = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.picturePostService
      .query()
      .pipe(
        filter((res: HttpResponse<PicturePost[]>) => res.ok),
        map((res: HttpResponse<PicturePost[]>) => res.body)
      )
      .subscribe(
        (response: PicturePost[]) => {
          this.picturePosts = response;
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

  trackId(index: number, item: PicturePost) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  new() {
    this.navController.navigateForward('/tabs/entities/picture-post/new');
  }

  edit(item: IonItemSliding, picturePost: PicturePost) {
    this.navController.navigateForward('/tabs/entities/picture-post/' + picturePost.id + '/edit');
    item.close();
  }

  async delete(picturePost) {
    this.picturePostService.delete(picturePost.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'PicturePost deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(picturePost: PicturePost) {
    this.navController.navigateForward('/tabs/entities/picture-post/' + picturePost.id + '/view');
  }
}
