import { Component, OnInit } from '@angular/core';
import { Message } from './message.model';
import { MessageService } from './message.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-message-detail',
  templateUrl: 'message-detail.html',
})
export class MessageDetailPage implements OnInit {
  message: Message = {};

  constructor(
    private navController: NavController,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.message = response.data;
    });
  }

  open(item: Message) {
    this.navController.navigateForward('/tabs/entities/message/' + item.id + '/edit');
  }

  async deleteModal(item: Message) {
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
            this.messageService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/message');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
