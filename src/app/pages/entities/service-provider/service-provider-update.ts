import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ServiceProvider } from './service-provider.model';
import { ServiceProviderService } from './service-provider.service';
import { IWESubscription, IWESubscriptionService } from '../iwe-subscription';
import { Rating, RatingService } from '../rating';

@Component({
  selector: 'page-service-provider-update',
  templateUrl: 'service-provider-update.html',
})
export class ServiceProviderUpdatePage implements OnInit {
  serviceProvider: ServiceProvider;
  iweSubscriptions: IWESubscription[];
  ratings: Rating[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    taxRegistrationUrl: [null, []],
    licenseOfTradeUrl: [null, []],
    criminalRecordUrl: [null, []],
    location: [null, []],
    subscription: [null, []],
    ratings: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private iWESubscriptionService: IWESubscriptionService,
    private ratingService: RatingService,
    private serviceProviderService: ServiceProviderService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.iWESubscriptionService.query({ filter: 'serviceprovider-is-null' }).subscribe(
      (data) => {
        if (!this.serviceProvider.subscription || !this.serviceProvider.subscription.id) {
          this.iweSubscriptions = data.body;
        } else {
          this.iWESubscriptionService.find(this.serviceProvider.subscription.id).subscribe(
            (subData: HttpResponse<IWESubscription>) => {
              this.iweSubscriptions = [subData.body].concat(subData.body);
            },
            (error) => this.onError(error)
          );
        }
      },
      (error) => this.onError(error)
    );
    this.ratingService.query().subscribe(
      (data) => {
        this.ratings = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.serviceProvider = response.data;
      this.isNew = this.serviceProvider.id === null || this.serviceProvider.id === undefined;
      this.updateForm(this.serviceProvider);
    });
  }

  updateForm(serviceProvider: ServiceProvider) {
    this.form.patchValue({
      id: serviceProvider.id,
      taxRegistrationUrl: serviceProvider.taxRegistrationUrl,
      licenseOfTradeUrl: serviceProvider.licenseOfTradeUrl,
      criminalRecordUrl: serviceProvider.criminalRecordUrl,
      location: serviceProvider.location,
      subscription: serviceProvider.subscription,
      ratings: serviceProvider.ratings,
    });
  }

  save() {
    this.isSaving = true;
    const serviceProvider = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.serviceProviderService.update(serviceProvider));
    } else {
      this.subscribeToSaveResponse(this.serviceProviderService.create(serviceProvider));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ServiceProvider>>) {
    result.subscribe(
      (res: HttpResponse<ServiceProvider>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `ServiceProvider ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/service-provider');
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

  private createFromForm(): ServiceProvider {
    return {
      ...new ServiceProvider(),
      id: this.form.get(['id']).value,
      taxRegistrationUrl: this.form.get(['taxRegistrationUrl']).value,
      licenseOfTradeUrl: this.form.get(['licenseOfTradeUrl']).value,
      criminalRecordUrl: this.form.get(['criminalRecordUrl']).value,
      location: this.form.get(['location']).value,
      subscription: this.form.get(['subscription']).value,
      ratings: this.form.get(['ratings']).value,
    };
  }

  compareIWESubscription(first: IWESubscription, second: IWESubscription): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackIWESubscriptionById(index: number, item: IWESubscription) {
    return item.id;
  }
  compareRating(first: Rating, second: Rating): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackRatingById(index: number, item: Rating) {
    return item.id;
  }
}
