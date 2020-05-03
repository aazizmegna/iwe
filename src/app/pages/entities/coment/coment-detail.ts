import { Component, OnInit } from '@angular/core';
import { Coment } from './coment.model';
import { ComentService } from './coment.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-coment-detail',
  templateUrl: 'coment-detail.html',
})
export class ComentDetailPage implements OnInit {
  coment: Coment = {};

  constructor(
    private navController: NavController,
    private comentService: ComentService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.coment = response.data;
    });
  }

  open(item: Coment) {
    this.navController.navigateForward('/tabs/entities/coment/' + item.id + '/edit');
  }

  async deleteModal(item: Coment) {
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
            this.comentService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/coment');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
