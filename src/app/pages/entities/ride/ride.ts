import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Ride } from './ride.model';
import { RideService } from './ride.service';

@Component({
  selector: 'page-ride',
  templateUrl: 'ride.html',
})
export class RidePage {
  rides: Ride[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private rideService: RideService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.rides = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.rideService
      .query()
      .pipe(
        filter((res: HttpResponse<Ride[]>) => res.ok),
        map((res: HttpResponse<Ride[]>) => res.body)
      )
      .subscribe(
        (response: Ride[]) => {
          this.rides = response;
          if (typeof refresher !== 'undefined') {
            setTimeout(() => {
              refresher.target.complete();
            }, 750);
          }
        },
        async (error) => {
          console.error(error);
          const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
          toast.present();
        }
      );
  }

  trackId(index: number, item: Ride) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/ride/new');
  }

  edit(item: IonItemSliding, ride: Ride) {
    this.navController.navigateForward('/tabs/entities/ride/' + ride.id + '/edit');
    item.close();
  }

  async delete(ride) {
    this.rideService.delete(ride.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Ride deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(ride: Ride) {
    this.navController.navigateForward('/tabs/entities/ride/' + ride.id + '/view');
  }
}
