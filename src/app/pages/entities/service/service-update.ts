import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Service } from './service.model';
import { ServiceService } from './service.service';
import { ServiceConsumer, ServiceConsumerService } from '../service-consumer';
import { ServiceProvider, ServiceProviderService } from '../service-provider';

@Component({
  selector: 'page-service-update',
  templateUrl: 'service-update.html',
})
export class ServiceUpdatePage implements OnInit {
  service: Service;
  serviceConsumers: ServiceConsumer[];
  serviceProviders: ServiceProvider[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    name: [null, []],
    pictureURL: [null, []],
    location: [null, []],
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
    private serviceService: ServiceService
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
    this.activatedRoute.data.subscribe((response) => {
      this.service = response.data;
      this.isNew = this.service.id === null || this.service.id === undefined;
      this.updateForm(this.service);
    });
  }

  updateForm(service: Service) {
    this.form.patchValue({
      id: service.id,
      name: service.name,
      pictureURL: service.pictureURL,
      location: service.location,
      serviceConsumer: service.serviceConsumer,
      serviceProvider: service.serviceProvider,
    });
  }

  save() {
    this.isSaving = true;
    const service = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.serviceService.update(service));
    } else {
      this.subscribeToSaveResponse(this.serviceService.create(service));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Service>>) {
    result.subscribe(
      (res: HttpResponse<Service>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Service ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/service');
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

  private createFromForm(): Service {
    return {
      ...new Service(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      pictureURL: this.form.get(['pictureURL']).value,
      location: this.form.get(['location']).value,
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
}
