import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { TextPost } from './text-post.model';
import { TextPostService } from './text-post.service';
import { Post, PostService } from '../post';

@Component({
  selector: 'page-text-post-update',
  templateUrl: 'text-post-update.html',
})
export class TextPostUpdatePage implements OnInit {
  textPost: TextPost;
  posts: Post[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    content: [null, []],
    post: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private postService: PostService,
    private textPostService: TextPostService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.postService.query({ filter: 'textpost-is-null' }).subscribe(
      (data) => {
        if (!this.textPost.post || !this.textPost.post.id) {
          this.posts = data.body;
        } else {
          this.postService.find(this.textPost.post.id).subscribe(
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
      this.textPost = response.data;
      this.isNew = this.textPost.id === null || this.textPost.id === undefined;
      this.updateForm(this.textPost);
    });
  }

  updateForm(textPost: TextPost) {
    this.form.patchValue({
      id: textPost.id,
      content: textPost.content,
      post: textPost.post,
    });
  }

  save() {
    this.isSaving = true;
    const textPost = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.textPostService.update(textPost));
    } else {
      this.subscribeToSaveResponse(this.textPostService.create(textPost));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<TextPost>>) {
    result.subscribe(
      (res: HttpResponse<TextPost>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `TextPost ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/text-post');
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

  private createFromForm(): TextPost {
    return {
      ...new TextPost(),
      id: this.form.get(['id']).value,
      content: this.form.get(['content']).value,
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
