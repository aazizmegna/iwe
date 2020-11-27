import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'ng-jhipster';
import { ServiceProvider } from './service-provider.model';
import { ServiceProviderService } from './service-provider.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-service-provider-detail',
  templateUrl: 'service-provider-detail.html',
})
export class ServiceProviderDetailPage implements OnInit {
  serviceProvider: ServiceProvider = {};

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private serviceProviderService: ServiceProviderService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.serviceProvider = response.data;
    });
  }

  open(item: ServiceProvider) {
    this.navController.navigateForward('/tabs/entities/service-provider/' + item.id + '/edit');
  }

  async deleteModal(item: ServiceProvider) {
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
            this.serviceProviderService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/service-provider');
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
