import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Reaction } from './reaction.model';
import { ReactionService } from './reaction.service';
import { ServiceConsumer, ServiceConsumerService } from '../service-consumer';
import { ServiceProvider, ServiceProviderService } from '../service-provider';
import { Post, PostService } from '../post';

@Component({
  selector: 'page-reaction-update',
  templateUrl: 'reaction-update.html',
})
export class ReactionUpdatePage implements OnInit {
  reaction: Reaction;
  serviceConsumers: ServiceConsumer[];
  serviceProviders: ServiceProvider[];
  posts: Post[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    serviceConsumer: [null, []],
    serviceProvider: [null, []],
    post: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private serviceConsumerService: ServiceConsumerService,
    private serviceProviderService: ServiceProviderService,
    private postService: PostService,
    private reactionService: ReactionService
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
    this.postService.query().subscribe(
      (data) => {
        this.posts = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.reaction = response.data;
      this.isNew = this.reaction.id === null || this.reaction.id === undefined;
      this.updateForm(this.reaction);
    });
  }

  updateForm(reaction: Reaction) {
    this.form.patchValue({
      id: reaction.id,
      serviceConsumer: reaction.serviceConsumer,
      serviceProvider: reaction.serviceProvider,
      post: reaction.post,
    });
  }

  save() {
    this.isSaving = true;
    const reaction = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.reactionService.update(reaction));
    } else {
      this.subscribeToSaveResponse(this.reactionService.create(reaction));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Reaction>>) {
    result.subscribe(
      (res: HttpResponse<Reaction>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Reaction ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/reaction');
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

  private createFromForm(): Reaction {
    return {
      ...new Reaction(),
      id: this.form.get(['id']).value,
      serviceConsumer: this.form.get(['serviceConsumer']).value,
      serviceProvider: this.form.get(['serviceProvider']).value,
      post: this.form.get(['post']).value,
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
  comparePost(first: Post, second: Post): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackPostById(index: number, item: Post) {
    return item.id;
  }
}
