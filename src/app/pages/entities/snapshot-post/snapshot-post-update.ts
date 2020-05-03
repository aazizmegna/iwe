import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { SnapshotPost } from './snapshot-post.model';
import { SnapshotPostService } from './snapshot-post.service';
import { Post, PostService } from '../post';

@Component({
  selector: 'page-snapshot-post-update',
  templateUrl: 'snapshot-post-update.html',
})
export class SnapshotPostUpdatePage implements OnInit {
  snapshotPost: SnapshotPost;
  posts: Post[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    contentUrl: [null, []],
    duration: [null, []],
    post: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private postService: PostService,
    private snapshotPostService: SnapshotPostService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.postService.query({ filter: 'snapshotpost-is-null' }).subscribe(
      (data) => {
        if (!this.snapshotPost.post || !this.snapshotPost.post.id) {
          this.posts = data.body;
        } else {
          this.postService.find(this.snapshotPost.post.id).subscribe(
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
      this.snapshotPost = response.data;
      this.isNew = this.snapshotPost.id === null || this.snapshotPost.id === undefined;
      this.updateForm(this.snapshotPost);
    });
  }

  updateForm(snapshotPost: SnapshotPost) {
    this.form.patchValue({
      id: snapshotPost.id,
      contentUrl: snapshotPost.contentUrl,
      duration: snapshotPost.duration,
      post: snapshotPost.post,
    });
  }

  save() {
    this.isSaving = true;
    const snapshotPost = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.snapshotPostService.update(snapshotPost));
    } else {
      this.subscribeToSaveResponse(this.snapshotPostService.create(snapshotPost));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<SnapshotPost>>) {
    result.subscribe(
      (res: HttpResponse<SnapshotPost>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `SnapshotPost ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/snapshot-post');
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

  private createFromForm(): SnapshotPost {
    return {
      ...new SnapshotPost(),
      id: this.form.get(['id']).value,
      contentUrl: this.form.get(['contentUrl']).value,
      duration: this.form.get(['duration']).value,
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
