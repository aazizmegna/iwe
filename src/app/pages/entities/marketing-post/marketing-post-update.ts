import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MarketingPost } from './marketing-post.model';
import { MarketingPostService } from './marketing-post.service';

@Component({
  selector: 'page-marketing-post-update',
  templateUrl: 'marketing-post-update.html',
})
export class MarketingPostUpdatePage implements OnInit {
  marketingPost: MarketingPost;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    price: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private marketingPostService: MarketingPostService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((response) => {
      this.marketingPost = response.data;
      this.isNew = this.marketingPost.id === null || this.marketingPost.id === undefined;
      this.updateForm(this.marketingPost);
    });
  }

  updateForm(marketingPost: MarketingPost) {
    this.form.patchValue({
      id: marketingPost.id,
      price: marketingPost.price,
    });
  }

  save() {
    this.isSaving = true;
    const marketingPost = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.marketingPostService.update(marketingPost));
    } else {
      this.subscribeToSaveResponse(this.marketingPostService.create(marketingPost));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<MarketingPost>>) {
    result.subscribe(
      (res: HttpResponse<MarketingPost>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `MarketingPost ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/marketing-post');
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

  private createFromForm(): MarketingPost {
    return {
      ...new MarketingPost(),
      id: this.form.get(['id']).value,
      price: this.form.get(['price']).value,
    };
  }
}
