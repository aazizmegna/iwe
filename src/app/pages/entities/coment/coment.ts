import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Coment } from './coment.model';
import { ComentService } from './coment.service';

@Component({
  selector: 'page-coment',
  templateUrl: 'coment.html',
})
export class ComentPage {
  coments: Coment[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private comentService: ComentService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.coments = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.comentService
      .query()
      .pipe(
        filter((res: HttpResponse<Coment[]>) => res.ok),
        map((res: HttpResponse<Coment[]>) => res.body)
      )
      .subscribe(
        (response: Coment[]) => {
          this.coments = response;
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

  trackId(index: number, item: Coment) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/coment/new');
  }

  edit(item: IonItemSliding, coment: Coment) {
    this.navController.navigateForward('/tabs/entities/coment/' + coment.id + '/edit');
    item.close();
  }

  async delete(coment) {
    this.comentService.delete(coment.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Coment deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(coment: Coment) {
    this.navController.navigateForward('/tabs/entities/coment/' + coment.id + '/view');
  }
}
