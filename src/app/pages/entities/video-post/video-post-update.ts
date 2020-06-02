import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'ng-jhipster';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { VideoPost } from './video-post.model';
import { VideoPostService } from './video-post.service';
import { Post, PostService } from '../post';

@Component({
  selector: 'page-video-post-update',
  templateUrl: 'video-post-update.html',
})
export class VideoPostUpdatePage implements OnInit {
  videoPost: VideoPost;
  posts: Post[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    content: [null, []],
    contentContentType: [null, []],
    duration: [null, []],
    post: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private dataUtils: JhiDataUtils,
    private postService: PostService,
    private videoPostService: VideoPostService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.postService.query({ filter: 'videopost-is-null' }).subscribe(
      (data) => {
        if (!this.videoPost.post || !this.videoPost.post.id) {
          this.posts = data.body;
        } else {
          this.postService.find(this.videoPost.post.id).subscribe(
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
      this.videoPost = response.data;
      this.isNew = this.videoPost.id === null || this.videoPost.id === undefined;
      this.updateForm(this.videoPost);
    });
  }

  updateForm(videoPost: VideoPost) {
    this.form.patchValue({
      id: videoPost.id,
      content: videoPost.content,
      contentContentType: videoPost.contentContentType,
      duration: videoPost.duration,
      post: videoPost.post,
    });
  }

  save() {
    this.isSaving = true;
    const videoPost = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.videoPostService.update(videoPost));
    } else {
      this.subscribeToSaveResponse(this.videoPostService.create(videoPost));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<VideoPost>>) {
    result.subscribe(
      (res: HttpResponse<VideoPost>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `VideoPost ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/video-post');
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

  private createFromForm(): VideoPost {
    return {
      ...new VideoPost(),
      id: this.form.get(['id']).value,
      content: this.form.get(['content']).value,
      contentContentType: this.form.get(['contentContentType']).value,
      duration: this.form.get(['duration']).value,
      post: this.form.get(['post']).value,
    };
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  setFileData(event, field, isImage) {
    this.dataUtils.loadFileToForm(event, this.form, field, isImage).subscribe();
  }

  comparePost(first: Post, second: Post): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackPostById(index: number, item: Post) {
    return item.id;
  }
}
