import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ServiceConsumer } from './service-consumer.model';
import { ServiceConsumerService } from './service-consumer.service';

@Component({
  selector: 'page-service-consumer-update',
  templateUrl: 'service-consumer-update.html',
})
export class ServiceConsumerUpdatePage implements OnInit {
  serviceConsumer: ServiceConsumer;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    location: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private serviceConsumerService: ServiceConsumerService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((response) => {
      this.serviceConsumer = response.data;
      this.isNew = this.serviceConsumer.id === null || this.serviceConsumer.id === undefined;
      this.updateForm(this.serviceConsumer);
    });
  }

  updateForm(serviceConsumer: ServiceConsumer) {
    this.form.patchValue({
      id: serviceConsumer.id,
      location: serviceConsumer.location,
    });
  }

  save() {
    this.isSaving = true;
    const serviceConsumer = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.serviceConsumerService.update(serviceConsumer));
    } else {
      this.subscribeToSaveResponse(this.serviceConsumerService.create(serviceConsumer));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ServiceConsumer>>) {
    result.subscribe(
      (res: HttpResponse<ServiceConsumer>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `ServiceConsumer ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/service-consumer');
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

  private createFromForm(): ServiceConsumer {
    return {
      ...new ServiceConsumer(),
      id: this.form.get(['id']).value,
      location: this.form.get(['location']).value,
    };
  }
}
