import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Post } from './post.model';
import { PostService } from './post.service';

@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {
  posts: Post[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private postService: PostService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.posts = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.postService
      .query()
      .pipe(
        filter((res: HttpResponse<Post[]>) => res.ok),
        map((res: HttpResponse<Post[]>) => res.body)
      )
      .subscribe(
        (response: Post[]) => {
          this.posts = response;
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

  trackId(index: number, item: Post) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/post/new');
  }

  edit(item: IonItemSliding, post: Post) {
    this.navController.navigateForward('/tabs/entities/post/' + post.id + '/edit');
    item.close();
  }

  async delete(post) {
    this.postService.delete(post.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Post deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(post: Post) {
    this.navController.navigateForward('/tabs/entities/post/' + post.id + '/view');
  }
}
