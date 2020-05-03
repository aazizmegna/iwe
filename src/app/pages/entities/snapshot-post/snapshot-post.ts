import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { SnapshotPost } from './snapshot-post.model';
import { SnapshotPostService } from './snapshot-post.service';

@Component({
  selector: 'page-snapshot-post',
  templateUrl: 'snapshot-post.html',
})
export class SnapshotPostPage {
  snapshotPosts: SnapshotPost[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private snapshotPostService: SnapshotPostService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.snapshotPosts = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.snapshotPostService
      .query()
      .pipe(
        filter((res: HttpResponse<SnapshotPost[]>) => res.ok),
        map((res: HttpResponse<SnapshotPost[]>) => res.body)
      )
      .subscribe(
        (response: SnapshotPost[]) => {
          this.snapshotPosts = response;
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

  trackId(index: number, item: SnapshotPost) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/snapshot-post/new');
  }

  edit(item: IonItemSliding, snapshotPost: SnapshotPost) {
    this.navController.navigateForward('/tabs/entities/snapshot-post/' + snapshotPost.id + '/edit');
    item.close();
  }

  async delete(snapshotPost) {
    this.snapshotPostService.delete(snapshotPost.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'SnapshotPost deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(snapshotPost: SnapshotPost) {
    this.navController.navigateForward('/tabs/entities/snapshot-post/' + snapshotPost.id + '/view');
  }
}
