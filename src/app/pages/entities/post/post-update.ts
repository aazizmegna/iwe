import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Post } from './post.model';
import { PostService } from './post.service';
import { ServiceConsumer, ServiceConsumerService } from '../service-consumer';
import { ServiceProvider, ServiceProviderService } from '../service-provider';
import { Feed, FeedService } from '../feed';

@Component({
  selector: 'page-post-update',
  templateUrl: 'post-update.html',
})
export class PostUpdatePage implements OnInit {
  post: Post;
  serviceConsumers: ServiceConsumer[];
  serviceProviders: ServiceProvider[];
  feeds: Feed[];
  timePosted: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    location: [null, []],
    description: [null, []],
    timePosted: [null, []],
    serviceConsumer: [null, []],
    serviceProvider: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private serviceConsumerService: ServiceConsumerService,
    private serviceProviderService: ServiceProviderService,
    private feedService: FeedService,
    private postService: PostService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.serviceConsumerService.query().subscribe(
      (data) => {
        this.serviceConsumers = data.body;
      },
      (error) => this.onError(error)
    );
    this.serviceProviderService.query().subscribe(
      (data) => {
        this.serviceProviders = data.body;
      },
      (error) => this.onError(error)
    );
    this.feedService.query().subscribe(
      (data) => {
        this.feeds = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.post = response.data;
      this.isNew = this.post.id === null || this.post.id === undefined;
      this.updateForm(this.post);
    });
  }

  updateForm(post: Post) {
    this.form.patchValue({
      id: post.id,
      location: post.location,
      description: post.description,
      timePosted: this.isNew ? new Date().toISOString() : post.timePosted,
      serviceConsumer: post.serviceConsumer,
      serviceProvider: post.serviceProvider,
    });
  }

  save() {
    this.isSaving = true;
    const post = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.postService.update(post));
    } else {
      this.subscribeToSaveResponse(this.postService.create(post));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Post>>) {
    result.subscribe(
      (res: HttpResponse<Post>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Post ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/post');
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

  private createFromForm(): Post {
    return {
      ...new Post(),
      id: this.form.get(['id']).value,
      location: this.form.get(['location']).value,
      description: this.form.get(['description']).value,
      timePosted: new Date(this.form.get(['timePosted']).value),
      serviceConsumer: this.form.get(['serviceConsumer']).value,
      serviceProvider: this.form.get(['serviceProvider']).value,
    };
  }

  compareServiceConsumer(first: ServiceConsumer, second: ServiceConsumer): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackServiceConsumerById(index: number, item: ServiceConsumer) {
    return item.id;
  }
  compareServiceProvider(first: ServiceProvider, second: ServiceProvider): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackServiceProviderById(index: number, item: ServiceProvider) {
    return item.id;
  }
  compareFeed(first: Feed, second: Feed): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackFeedById(index: number, item: Feed) {
    return item.id;
  }
}
