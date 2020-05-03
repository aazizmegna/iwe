import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { LocationServiceProvider } from './location-service-provider.model';
import { LocationServiceProviderService } from './location-service-provider.service';

@Component({
  selector: 'page-location-service-provider-update',
  templateUrl: 'location-service-provider-update.html',
})
export class LocationServiceProviderUpdatePage implements OnInit {
  locationServiceProvider: LocationServiceProvider;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    trafficRegistrationUrl: [null, []],
    criminalRecordUrl: [null, []],
    taxRegistrationUrl: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private locationServiceProviderService: LocationServiceProviderService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((response) => {
      this.locationServiceProvider = response.data;
      this.isNew = this.locationServiceProvider.id === null || this.locationServiceProvider.id === undefined;
      this.updateForm(this.locationServiceProvider);
    });
  }

  updateForm(locationServiceProvider: LocationServiceProvider) {
    this.form.patchValue({
      id: locationServiceProvider.id,
      trafficRegistrationUrl: locationServiceProvider.trafficRegistrationUrl,
      criminalRecordUrl: locationServiceProvider.criminalRecordUrl,
      taxRegistrationUrl: locationServiceProvider.taxRegistrationUrl,
    });
  }

  save() {
    this.isSaving = true;
    const locationServiceProvider = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.locationServiceProviderService.update(locationServiceProvider));
    } else {
      this.subscribeToSaveResponse(this.locationServiceProviderService.create(locationServiceProvider));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<LocationServiceProvider>>) {
    result.subscribe(
      (res: HttpResponse<LocationServiceProvider>) => this.onSaveSuccess(res),
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
      message: `LocationServiceProvider ${action} successfully.`,
      duration: 2000,
      position: 'middle',
    });
    toast.present();
    this.navController.navigateBack('/tabs/entities/location-service-provider');
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

  private createFromForm(): LocationServiceProvider {
    return {
      ...new LocationServiceProvider(),
      id: this.form.get(['id']).value,
      trafficRegistrationUrl: this.form.get(['trafficRegistrationUrl']).value,
      criminalRecordUrl: this.form.get(['criminalRecordUrl']).value,
      taxRegistrationUrl: this.form.get(['taxRegistrationUrl']).value,
    };
  }
}
