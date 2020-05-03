import { Component, OnInit } from '@angular/core';
import { ServiceConsumer } from './service-consumer.model';
import { ServiceConsumerService } from './service-consumer.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-service-consumer-detail',
  templateUrl: 'service-consumer-detail.html',
})
export class ServiceConsumerDetailPage implements OnInit {
  serviceConsumer: ServiceConsumer = {};

  constructor(
    private navController: NavController,
    private serviceConsumerService: ServiceConsumerService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.serviceConsumer = response.data;
    });
  }

  open(item: ServiceConsumer) {
    this.navController.navigateForward('/tabs/entities/service-consumer/' + item.id + '/edit');
  }

  async deleteModal(item: ServiceConsumer) {
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
            this.serviceConsumerService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/service-consumer');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
