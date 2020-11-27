import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'ng-jhipster';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ServiceProvider } from './service-provider.model';
import { ServiceProviderService } from './service-provider.service';
import { IWESubscription, IWESubscriptionService } from '../iwe-subscription';

@Component({
  selector: 'page-service-provider-update',
  templateUrl: 'service-provider-update.html',
})
export class ServiceProviderUpdatePage implements OnInit {
  serviceProvider: ServiceProvider;
  iweSubscriptions: IWESubscription[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    taxRegistration: [null, []],
    taxRegistrationContentType: [null, []],
    licenseOfTrade: [null, []],
    licenseOfTradeContentType: [null, []],
    criminalRecord: [null, []],
    criminalRecordContentType: [null, []],
    location: [null, []],
    subscription: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private dataUtils: JhiDataUtils,
    private iWESubscriptionService: IWESubscriptionService,
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
    this.activatedRoute.data.subscribe((response) => {
      this.serviceProvider = response.data;
      this.isNew = this.serviceProvider.id === null || this.serviceProvider.id === undefined;
      this.updateForm(this.serviceProvider);
    });
  }

  updateForm(serviceProvider: ServiceProvider) {
    this.form.patchValue({
      id: serviceProvider.id,
      taxRegistration: serviceProvider.taxRegistration,
      taxRegistrationContentType: serviceProvider.taxRegistrationContentType,
      licenseOfTrade: serviceProvider.licenseOfTrade,
      licenseOfTradeContentType: serviceProvider.licenseOfTradeContentType,
      criminalRecord: serviceProvider.criminalRecord,
      criminalRecordContentType: serviceProvider.criminalRecordContentType,
      location: serviceProvider.location,
      subscription: serviceProvider.subscription,
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
      taxRegistration: this.form.get(['taxRegistration']).value,
      taxRegistrationContentType: this.form.get(['taxRegistrationContentType']).value,
      licenseOfTrade: this.form.get(['licenseOfTrade']).value,
      licenseOfTradeContentType: this.form.get(['licenseOfTradeContentType']).value,
      criminalRecord: this.form.get(['criminalRecord']).value,
      criminalRecordContentType: this.form.get(['criminalRecordContentType']).value,
      location: this.form.get(['location']).value,
      subscription: this.form.get(['subscription']).value,
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

  compareIWESubscription(first: IWESubscription, second: IWESubscription): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackIWESubscriptionById(index: number, item: IWESubscription) {
    return item.id;
  }
}
