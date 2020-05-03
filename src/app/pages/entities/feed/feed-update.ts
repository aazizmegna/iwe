import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Feed } from './feed.model';
import { FeedService } from './feed.service';
import { Post, PostService } from '../post';

@Component({
  selector: 'page-feed-update',
  templateUrl: 'feed-update.html',
})
export class FeedUpdatePage implements OnInit {
  feed: Feed;
  posts: Post[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    posts: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private postService: PostService,
    private feedService: FeedService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.postService.query().subscribe(
      (data) => {
        this.posts = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.feed = response.data;
      this.isNew = this.feed.id === null || this.feed.id === undefined;
      this.updateForm(this.feed);
    });
  }

  updateForm(feed: Feed) {
    this.form.patchValue({
      id: feed.id,
      posts: feed.posts,
    });
  }

  save() {
    this.isSaving = true;
    const feed = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.feedService.update(feed));
    } else {
      this.subscribeToSaveResponse(this.feedService.create(feed));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Feed>>) {
    result.subscribe(
      (res: HttpResponse<Feed>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Feed ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/feed');
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

  private createFromForm(): Feed {
    return {
      ...new Feed(),
      id: this.form.get(['id']).value,
      posts: this.form.get(['posts']).value,
    };
  }

  comparePost(first: Post, second: Post): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackPostById(index: number, item: Post) {
    return item.id;
  }
}
