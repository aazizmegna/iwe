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
    public plt: Platform
  ) {
    this.picturePosts = [];
  }

  trackId(index: number, item: PicturePost) {
    return item.id;
  }
}
