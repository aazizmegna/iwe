import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Rating } from './rating.model';
import { RatingService } from './rating.service';

@Component({
  selector: 'page-rating',
  templateUrl: 'rating.html',
})
export class RatingPage {
  ratings: Rating[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private ratingService: RatingService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.ratings = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.ratingService
      .query()
      .pipe(
        filter((res: HttpResponse<Rating[]>) => res.ok),
        map((res: HttpResponse<Rating[]>) => res.body)
      )
      .subscribe(
        (response: Rating[]) => {
          this.ratings = response;
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

  trackId(index: number, item: Rating) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/rating/new');
  }

  edit(item: IonItemSliding, rating: Rating) {
    this.navController.navigateForward('/tabs/entities/rating/' + rating.id + '/edit');
    item.close();
  }

  async delete(rating) {
    this.ratingService.delete(rating.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Rating deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(rating: Rating) {
    this.navController.navigateForward('/tabs/entities/rating/' + rating.id + '/view');
  }
}
