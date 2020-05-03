import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IWESubscription } from './iwe-subscription.model';
import { IWESubscriptionService } from './iwe-subscription.service';

@Component({
  selector: 'page-iwe-subscription-update',
  templateUrl: 'iwe-subscription-update.html',
})
export class IWESubscriptionUpdatePage implements OnInit {
  iWESubscription: IWESubscription;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    type: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private iWESubscriptionService: IWESubscriptionService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((response) => {
      this.iWESubscription = response.data;
      this.isNew = this.iWESubscription.id === null || this.iWESubscription.id === undefined;
      this.updateForm(this.iWESubscription);
    });
  }

  updateForm(iWESubscription: IWESubscription) {
    this.form.patchValue({
      id: iWESubscription.id,
      type: iWESubscription.type,
    });
  }

  save() {
    this.isSaving = true;
    const iWESubscription = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.iWESubscriptionService.update(iWESubscription));
    } else {
      this.subscribeToSaveResponse(this.iWESubscriptionService.create(iWESubscription));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWESubscription>>) {
    result.subscribe(
      (res: HttpResponse<IWESubscription>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `IWESubscription ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/iwe-subscription');
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

  private createFromForm(): IWESubscription {
    return {
      ...new IWESubscription(),
      id: this.form.get(['id']).value,
      type: this.form.get(['type']).value,
    };
  }
}
