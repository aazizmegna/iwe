import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'ng-jhipster';
import { SnapshotPost } from './snapshot-post.model';
import { SnapshotPostService } from './snapshot-post.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-snapshot-post-detail',
  templateUrl: 'snapshot-post-detail.html',
})
export class SnapshotPostDetailPage implements OnInit {
  snapshotPost: SnapshotPost = {};

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private snapshotPostService: SnapshotPostService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.snapshotPost = response.data;
    });
  }

  open(item: SnapshotPost) {
    this.navController.navigateForward('/tabs/entities/snapshot-post/' + item.id + '/edit');
  }

  async deleteModal(item: SnapshotPost) {
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
            this.snapshotPostService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/snapshot-post');
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
