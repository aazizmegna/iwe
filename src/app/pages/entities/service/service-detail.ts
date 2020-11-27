import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'ng-jhipster';
import { Service } from './service.model';
import { ServiceService } from './service.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-service-detail',
  templateUrl: 'service-detail.html',
})
export class ServiceDetailPage implements OnInit {
  service: Service = {};

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private serviceService: ServiceService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.service = response.data;
    });
  }

  open(item: Service) {
    this.navController.navigateForward('/tabs/entities/service/' + item.id + '/edit');
  }

  async deleteModal(item: Service) {
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
            this.serviceService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/service');
            });
          },
        },
      ],
    });
    await alert.present();
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }
}
