import {Component, OnInit} from '@angular/core';
import {NavController, Platform, ToastController} from '@ionic/angular';
import {SearchServicesModel} from '../../search-services-tab/search-services.model';
import {Booking, BookingService} from '../../entities/booking';
import {ServiceConsumer, ServiceConsumerService} from '../../entities/service-consumer';
import {ServiceProvider, ServiceProviderService} from '../../entities/service-provider';
import {Service, ServiceService} from '../../entities/service';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {Observable} from 'rxjs';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {BookingProvider} from '../booking/booking.provider';

@Component({
  selector: 'app-booking-overview',
  templateUrl: './booking-overview.page.html',
  styleUrls: ['./booking-overview.page.scss'],
})
export class BookingOverviewPage implements OnInit {
  searchServicesModels: SearchServicesModel[];
  booking: BookingProvider;
  serviceConsumers: ServiceConsumer[];
  serviceProviders: ServiceProvider[];
  services: Service[];
  dateTime: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private serviceConsumerService: ServiceConsumerService,
    private serviceProviderService: ServiceProviderService,
    private serviceService: ServiceService,
    private bookingService: BookingService,
    private bookingProvider: BookingProvider,
    private route: Router
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.searchServicesModels = response.data;
    });
  }

  async onSaveSuccess(response) {
    await this.route.navigate(['tabs/home/booking-confirm']);
  }

  async onError(error) {
    this.isSaving = false;
    console.error(error);
    const toast = await this.toastCtrl.create({message: 'Failed to create the booking', duration: 2000, position: 'middle'});
    toast.present();
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Booking>>) {
    result.subscribe(
      (res: HttpResponse<Booking>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res)
    );
  }

  save() {
    this.isSaving = true;
    this.subscribeToSaveResponse(this.bookingService.create(this.bookingProvider));
  }

}
