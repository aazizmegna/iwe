import { Component, OnInit } from '@angular/core';
import { Invitation } from './invitation.model';
import { InvitationService } from './invitation.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-invitation-detail',
  templateUrl: 'invitation-detail.html',
})
export class InvitationDetailPage implements OnInit {
  invitation: Invitation = {};

  constructor(
    private navController: NavController,
    private invitationService: InvitationService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.invitation = response.data;
    });
  }

  open(item: Invitation) {
    this.navController.navigateForward('/tabs/entities/invitation/' + item.id + '/edit');
  }

  async deleteModal(item: Invitation) {
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
            this.invitationService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/invitation');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
