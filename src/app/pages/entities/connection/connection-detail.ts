import { Component, OnInit } from '@angular/core';
import { Connection } from './connection.model';
import { ConnectionService } from './connection.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-connection-detail',
  templateUrl: 'connection-detail.html',
})
export class ConnectionDetailPage implements OnInit {
  connection: Connection = {};

  constructor(
    private navController: NavController,
    private connectionService: ConnectionService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.connection = response.data;
    });
  }

  open(item: Connection) {
    this.navController.navigateForward('/tabs/entities/connection/' + item.id + '/edit');
  }

  async deleteModal(item: Connection) {
    const alert = await this.alertController.create({
      header: 'Confirm the deletion?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            this.connectionService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/connection');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
