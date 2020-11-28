import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Booking } from './booking.model';
import { BookingService } from './booking.service';
import { ServiceConsumer, ServiceConsumerService } from '../service-consumer';
import { ServiceProvider, ServiceProviderService } from '../service-provider';
import { Service, ServiceService } from '../service';

@Component({
  selector: 'page-booking-update',
  templateUrl: 'booking-update.html',
})
export class BookingUpdatePage implements OnInit {
  booking: Booking;
  serviceConsumers: ServiceConsumer[];
  serviceProviders: ServiceProvider[];
  services: Service[];
  dateTime: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    dateTime: [null, []],
    serviceConsumer: [null, []],
    serviceProvider: [null, []],
    service: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private serviceConsumerService: ServiceConsumerService,
    private serviceProviderService: ServiceProviderService,
    private serviceService: ServiceService,
    private bookingService: BookingService
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
    this.serviceService.query().subscribe(
      (data) => {
        this.services = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.booking = response.data;
      this.isNew = this.booking.id === null || this.booking.id === undefined;
      this.updateForm(this.booking);
    });
  }

  updateForm(booking: Booking) {
    this.form.patchValue({
      id: booking.id,
      dateTime: this.isNew ? new Date().toISOString() : booking.dateTime,
      serviceConsumer: booking.serviceConsumer,
      serviceProvider: booking.serviceProvider,
      service: booking.service,
    });
  }

  save() {
    this.isSaving = true;
    const booking = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.bookingService.update(booking));
    } else {
      this.subscribeToSaveResponse(this.bookingService.create(booking));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Booking>>) {
    result.subscribe(
      (res: HttpResponse<Booking>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Booking ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/booking');
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

  private createFromForm(): Booking {
    return {
      ...new Booking(),
      id: this.form.get(['id']).value,
      dateTime: new Date(this.form.get(['dateTime']).value),
      serviceConsumer: this.form.get(['serviceConsumer']).value,
      serviceProvider: this.form.get(['serviceProvider']).value,
      service: this.form.get(['service']).value,
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
  compareService(first: Service, second: Service): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackServiceById(index: number, item: Service) {
    return item.id;
  }
}
