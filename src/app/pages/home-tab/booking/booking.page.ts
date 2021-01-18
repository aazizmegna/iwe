import {Component, OnInit} from '@angular/core';
import {NavController, Platform, ToastController} from '@ionic/angular';
import {SearchServicesModel} from '../../search-services-tab/search-services.model';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {Booking, BookingService} from '../../entities/booking';
import {ServiceConsumer, ServiceConsumerService} from '../../entities/service-consumer';
import {ServiceProvider, ServiceProviderService} from '../../entities/service-provider';
import {Service, ServiceService} from '../../entities/service';
import {FormBuilder} from '@angular/forms';
import {Observable} from 'rxjs';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {BookingProvider} from './booking.provider';
import {AuthServerProvider} from '../../../services/auth/auth-jwt.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit {

  searchServicesModels: SearchServicesModel[];
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
    private bookingService: BookingService,
    private bookingProvider: BookingProvider,
    private route: Router,
    private authProvider: AuthServerProvider
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  openBookingOverview() {
    const form = this.createFromForm();
    this.bookingProvider.dateTime = form.dateTime;
    this.bookingProvider.serviceConsumer = form.serviceConsumer;
    this.bookingProvider.serviceProvider = form.serviceProvider;
    this.route.navigate(['tabs/home/booking-overview']);
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.searchServicesModels = response.data;
    });
  }

  private createFromForm(): Booking {
    return {
      ...new Booking(),
      id: this.form.get(['id']).value,
      dateTime: new Date(this.form.get(['dateTime']).value),
      serviceConsumer: this.searchServicesModels[0].serviceConsumer,
      serviceProvider: this.searchServicesModels[0].serviceProvider
    };
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({message: `Booking ${action} successfully.`, duration: 2000, position: 'middle'});
    toast.present();
    this.navController.navigateBack('/tabs/home/');
  }

  async onError(error) {
    this.isSaving = false;
    console.error(error);
    const toast = await this.toastCtrl.create({message: 'Failed to load data', duration: 2000, position: 'middle'});
    toast.present();
  }
}
