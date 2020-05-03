import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { PicturePost } from './picture-post.model';
import { PicturePostService } from './picture-post.service';
import { Post, PostService } from '../post';

@Component({
  selector: 'page-picture-post-update',
  templateUrl: 'picture-post-update.html',
})
export class PicturePostUpdatePage implements OnInit {
  picturePost: PicturePost;
  posts: Post[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    contentUrl: [null, []],
    post: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private postService: PostService,
    private picturePostService: PicturePostService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.postService.query({ filter: 'picturepost-is-null' }).subscribe(
      (data) => {
        if (!this.picturePost.post || !this.picturePost.post.id) {
          this.posts = data.body;
        } else {
          this.postService.find(this.picturePost.post.id).subscribe(
            (subData: HttpResponse<Post>) => {
              this.posts = [subData.body].concat(subData.body);
            },
            (error) => this.onError(error)
          );
        }
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.picturePost = response.data;
      this.isNew = this.picturePost.id === null || this.picturePost.id === undefined;
      this.updateForm(this.picturePost);
    });
  }

  updateForm(picturePost: PicturePost) {
    this.form.patchValue({
      id: picturePost.id,
      contentUrl: picturePost.contentUrl,
      post: picturePost.post,
    });
  }

  save() {
    this.isSaving = true;
    const picturePost = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.picturePostService.update(picturePost));
    } else {
      this.subscribeToSaveResponse(this.picturePostService.create(picturePost));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<PicturePost>>) {
    result.subscribe(
      (res: HttpResponse<PicturePost>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `PicturePost ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/picture-post');
  }

  previousState() {
    window.history.back();
  }

  async onError(error) {
    this.isSaving = false;
    console.error(error);
    const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
    toast.present();
  }

  private createFromForm(): PicturePost {
    return {
      ...new PicturePost(),
      id: this.form.get(['id']).value,
      contentUrl: this.form.get(['contentUrl']).value,
      post: this.form.get(['post']).value,
    };
  }

  comparePost(first: Post, second: Post): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackPostById(index: number, item: Post) {
    return item.id;
  }
}
