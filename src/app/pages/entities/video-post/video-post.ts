import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { JhiDataUtils } from 'ng-jhipster';
import { VideoPost } from './video-post.model';
import { VideoPostService } from './video-post.service';

@Component({
  selector: 'page-video-post',
  templateUrl: 'video-post.html',
})
export class VideoPostPage {
  videoPosts: VideoPost[];

  // todo: add pagination

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private videoPostService: VideoPostService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.videoPosts = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.videoPostService
      .query()
      .pipe(
        filter((res: HttpResponse<VideoPost[]>) => res.ok),
        map((res: HttpResponse<VideoPost[]>) => res.body)
      )
      .subscribe(
        (response: VideoPost[]) => {
          this.videoPosts = response;
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

  trackId(index: number, item: VideoPost) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  new() {
    this.navController.navigateForward('/tabs/entities/video-post/new');
  }

  edit(item: IonItemSliding, videoPost: VideoPost) {
    this.navController.navigateForward('/tabs/entities/video-post/' + videoPost.id + '/edit');
    item.close();
  }

  async delete(videoPost) {
    this.videoPostService.delete(videoPost.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'VideoPost deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(videoPost: VideoPost) {
    this.navController.navigateForward('/tabs/entities/video-post/' + videoPost.id + '/view');
  }
}
