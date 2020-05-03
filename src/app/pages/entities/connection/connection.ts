import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Connection } from './connection.model';
import { ConnectionService } from './connection.service';

@Component({
  selector: 'page-connection',
  templateUrl: 'connection.html',
})
export class ConnectionPage {
  connections: Connection[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private connectionService: ConnectionService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.connections = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.connectionService
      .query()
      .pipe(
        filter((res: HttpResponse<Connection[]>) => res.ok),
        map((res: HttpResponse<Connection[]>) => res.body)
      )
      .subscribe(
        (response: Connection[]) => {
          this.connections = response;
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

  trackId(index: number, item: Connection) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/connection/new');
  }

  edit(item: IonItemSliding, connection: Connection) {
    this.navController.navigateForward('/tabs/entities/connection/' + connection.id + '/edit');
    item.close();
  }

  async delete(connection) {
    this.connectionService.delete(connection.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Connection deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(connection: Connection) {
    this.navController.navigateForward('/tabs/entities/connection/' + connection.id + '/view');
  }
}
