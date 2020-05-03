import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Ride } from './ride.model';
import { RideService } from './ride.service';
import { LocationServiceProvider, LocationServiceProviderService } from '../location-service-provider';
import { ServiceConsumer, ServiceConsumerService } from '../service-consumer';
import { ServiceProvider, ServiceProviderService } from '../service-provider';

@Component({
  selector: 'page-ride-update',
  templateUrl: 'ride-update.html',
})
export class RideUpdatePage implements OnInit {
  ride: Ride;
  locationServiceProviders: LocationServiceProvider[];
  serviceConsumers: ServiceConsumer[];
  serviceProviders: ServiceProvider[];
  startedAt: string;
  endedAt: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    departure: [null, []],
    destination: [null, []],
    startedAt: [null, []],
    endedAt: [null, []],
    locationServiceProvider: [null, []],
    serviceConsumer: [null, []],
    serviceProvider: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private locationServiceProviderService: LocationServiceProviderService,
    private serviceConsumerService: ServiceConsumerService,
    private serviceProviderService: ServiceProviderService,
    private rideService: RideService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.locationServiceProviderService.query().subscribe(
      (data) => {
        this.locationServiceProviders = data.body;
      },
      (error) => this.onError(error)
    );
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
      this.ride = response.data;
      this.isNew = this.ride.id === null || this.ride.id === undefined;
      this.updateForm(this.ride);
    });
  }

  updateForm(ride: Ride) {
    this.form.patchValue({
      id: ride.id,
      departure: ride.departure,
      destination: ride.destination,
      startedAt: this.isNew ? new Date().toISOString() : ride.startedAt,
      endedAt: this.isNew ? new Date().toISOString() : ride.endedAt,
      locationServiceProvider: ride.locationServiceProvider,
      serviceConsumer: ride.serviceConsumer,
      serviceProvider: ride.serviceProvider,
    });
  }

  save() {
    this.isSaving = true;
    const ride = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.rideService.update(ride));
    } else {
      this.subscribeToSaveResponse(this.rideService.create(ride));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Ride>>) {
    result.subscribe(
      (res: HttpResponse<Ride>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Ride ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/ride');
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

  private createFromForm(): Ride {
    return {
      ...new Ride(),
      id: this.form.get(['id']).value,
      departure: this.form.get(['departure']).value,
      destination: this.form.get(['destination']).value,
      startedAt: new Date(this.form.get(['startedAt']).value),
      endedAt: new Date(this.form.get(['endedAt']).value),
      locationServiceProvider: this.form.get(['locationServiceProvider']).value,
      serviceConsumer: this.form.get(['serviceConsumer']).value,
      serviceProvider: this.form.get(['serviceProvider']).value,
    };
  }

  compareLocationServiceProvider(first: LocationServiceProvider, second: LocationServiceProvider): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackLocationServiceProviderById(index: number, item: LocationServiceProvider) {
    return item.id;
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
