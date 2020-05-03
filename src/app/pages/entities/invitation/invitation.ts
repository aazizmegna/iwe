import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Invitation } from './invitation.model';
import { InvitationService } from './invitation.service';

@Component({
  selector: 'page-invitation',
  templateUrl: 'invitation.html',
})
export class InvitationPage {
  invitations: Invitation[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private invitationService: InvitationService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.invitations = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.invitationService
      .query()
      .pipe(
        filter((res: HttpResponse<Invitation[]>) => res.ok),
        map((res: HttpResponse<Invitation[]>) => res.body)
      )
      .subscribe(
        (response: Invitation[]) => {
          this.invitations = response;
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

  trackId(index: number, item: Invitation) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/invitation/new');
  }

  edit(item: IonItemSliding, invitation: Invitation) {
    this.navController.navigateForward('/tabs/entities/invitation/' + invitation.id + '/edit');
    item.close();
  }

  async delete(invitation) {
    this.invitationService.delete(invitation.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Invitation deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(invitation: Invitation) {
    this.navController.navigateForward('/tabs/entities/invitation/' + invitation.id + '/view');
  }
}
