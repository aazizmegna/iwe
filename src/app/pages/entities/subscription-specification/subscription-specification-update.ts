import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { SubscriptionSpecification } from './subscription-specification.model';
import { SubscriptionSpecificationService } from './subscription-specification.service';
import { IWESubscription, IWESubscriptionService } from '../iwe-subscription';

@Component({
  selector: 'page-subscription-specification-update',
  templateUrl: 'subscription-specification-update.html',
})
export class SubscriptionSpecificationUpdatePage implements OnInit {
  subscriptionSpecification: SubscriptionSpecification;
  iweSubscriptions: IWESubscription[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    numberOfUsers: [null, []],
    targetArea: [null, []],
    profilePage: [null, []],
    paymentOption: [null, []],
    subscription: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private iWESubscriptionService: IWESubscriptionService,
    private subscriptionSpecificationService: SubscriptionSpecificationService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.iWESubscriptionService.query({ filter: 'subscriptionspecification-is-null' }).subscribe(
      (data) => {
        if (!this.subscriptionSpecification.subscription || !this.subscriptionSpecification.subscription.id) {
          this.iweSubscriptions = data.body;
        } else {
          this.iWESubscriptionService.find(this.subscriptionSpecification.subscription.id).subscribe(
            (subData: HttpResponse<IWESubscription>) => {
              this.iweSubscriptions = [subData.body].concat(subData.body);
            },
            (error) => this.onError(error)
          );
        }
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.subscriptionSpecification = response.data;
      this.isNew = this.subscriptionSpecification.id === null || this.subscriptionSpecification.id === undefined;
      this.updateForm(this.subscriptionSpecification);
    });
  }

  updateForm(subscriptionSpecification: SubscriptionSpecification) {
    this.form.patchValue({
      id: subscriptionSpecification.id,
      numberOfUsers: subscriptionSpecification.numberOfUsers,
      targetArea: subscriptionSpecification.targetArea,
      profilePage: subscriptionSpecification.profilePage,
      paymentOption: subscriptionSpecification.paymentOption,
      subscription: subscriptionSpecification.subscription,
    });
  }

  save() {
    this.isSaving = true;
    const subscriptionSpecification = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.subscriptionSpecificationService.update(subscriptionSpecification));
    } else {
      this.subscribeToSaveResponse(this.subscriptionSpecificationService.create(subscriptionSpecification));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<SubscriptionSpecification>>) {
    result.subscribe(
      (res: HttpResponse<SubscriptionSpecification>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({
      message: `SubscriptionSpecification ${action} successfully.`,
      duration: 2000,
      position: 'middle',
    });
    toast.present();
    this.navController.navigateBack('/tabs/entities/subscription-specification');
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

  private createFromForm(): SubscriptionSpecification {
    return {
      ...new SubscriptionSpecification(),
      id: this.form.get(['id']).value,
      numberOfUsers: this.form.get(['numberOfUsers']).value,
      targetArea: this.form.get(['targetArea']).value,
      profilePage: this.form.get(['profilePage']).value,
      paymentOption: this.form.get(['paymentOption']).value,
      subscription: this.form.get(['subscription']).value,
    };
  }

  compareIWESubscription(first: IWESubscription, second: IWESubscription): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackIWESubscriptionById(index: number, item: IWESubscription) {
    return item.id;
  }
}
